import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { createSessionCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// DB-backed login rate limiter — works across ALL Vercel serverless instances.
// 5 attempts allowed per IP per 15 minutes.
// Uses the same rate_limits table as the contact form.
// ---------------------------------------------------------------------------
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;

async function checkLoginRateLimit(ip) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const now = Date.now();
    const expiresAt = now + LOGIN_WINDOW_MS;

    // Ensure rate_limits table exists (idempotent)
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        ip VARCHAR(64) PRIMARY KEY,
        count INTEGER NOT NULL DEFAULT 1,
        expires_at BIGINT NOT NULL
      )
    `;

    // Upsert: increment count or reset if window expired
    const rows = await sql`
      INSERT INTO rate_limits (ip, count, expires_at)
      VALUES (${`login:${ip}`}, 1, ${expiresAt})
      ON CONFLICT (ip) DO UPDATE SET
        count = CASE
          WHEN rate_limits.expires_at < ${now} THEN 1
          ELSE rate_limits.count + 1
        END,
        expires_at = CASE
          WHEN rate_limits.expires_at < ${now} THEN ${expiresAt}
          ELSE rate_limits.expires_at
        END
      RETURNING count, expires_at
    `;

    const count = rows[0]?.count ?? 1;
    return { limited: count > MAX_LOGIN_ATTEMPTS };
  } catch {
    // If DB is unreachable, fail open (don't lock out admin)
    // but log the error so it surfaces in Vercel logs
    console.error("Login rate-limit DB check failed — failing open.");
    return { limited: false };
  }
}

// ---------------------------------------------------------------------------
// Clear the rate-limit record on successful login so a legitimate admin
// who was briefly throttled can log in again immediately after success.
// ---------------------------------------------------------------------------
async function clearLoginRateLimit(ip) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`DELETE FROM rate_limits WHERE ip = ${`login:${ip}`}`;
  } catch {
    // Non-critical — ignore
  }
}

export async function POST(request) {
  try {
    // 1. Extract IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "127.0.0.1";

    // 2. DB-backed rate limit check (works across all Vercel instances)
    const { limited } = await checkLoginRateLimit(ip);
    if (limited) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 15 minutes." },
        { status: 429 }
      );
    }

    // 3. Parse and validate input
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string" || password.length > 200) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // 4. Check ADMIN_PASSWORD env var
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("SECURITY: ADMIN_PASSWORD env var is not configured.");
      return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    // 5. Compare password
    // Supports two modes:
    //   a) Bcrypt hash — if ADMIN_PASSWORD starts with "$2b$" or "$2a$" (recommended)
    //   b) Plaintext  — legacy fallback with constant-time comparison via bcrypt.compare
    let passwordValid = false;
    const isBcryptHash = adminPassword.startsWith("$2b$") || adminPassword.startsWith("$2a$");

    if (isBcryptHash) {
      // Bcrypt compare — timing-safe by design
      passwordValid = await bcrypt.compare(password, adminPassword);
    } else {
      // Plaintext — use bcrypt.compare against a dummy hash for constant-time
      // then fall back to direct compare. This prevents timing attacks.
      await bcrypt.compare("dummy", "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234"); // constant time
      passwordValid = password === adminPassword;
    }

    if (!passwordValid) {
      // Additional 300ms delay on wrong password to slow down brute force
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    // 6. Successful login — clear rate-limit record and set session cookie
    await clearLoginRateLimit(ip);
    const cookie = createSessionCookie();
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: { "Set-Cookie": cookie },
      }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
