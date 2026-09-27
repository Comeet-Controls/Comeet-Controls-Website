import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Login rate limiter — max 5 attempts per IP per 15 minutes
// Prevents brute-force password guessing attacks
// ---------------------------------------------------------------------------
const loginAttempts = new Map();
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;

function checkLoginRateLimit(ip) {
  const now = Date.now();

  // Housekeeping: remove expired entries
  if (loginAttempts.size > 500) {
    for (const [key, val] of loginAttempts.entries()) {
      if (val.expiresAt < now) loginAttempts.delete(key);
    }
  }

  const record = loginAttempts.get(ip);
  if (!record || record.expiresAt < now) {
    loginAttempts.set(ip, { count: 1, expiresAt: now + LOGIN_WINDOW_MS });
    return { limited: false };
  }
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    return { limited: true };
  }
  record.count += 1;
  return { limited: false };
}

export async function POST(request) {
  try {
    // 1. Rate limit by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "127.0.0.1";

    const { limited } = checkLoginRateLimit(ip);
    if (limited) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 15 minutes." },
        { status: 429 }
      );
    }

    // 2. Parse and validate input
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string" || password.length > 200) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // 3. Check ADMIN_PASSWORD env var (never use fallback in production)
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("SECURITY: ADMIN_PASSWORD env var is not configured.");
      return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
    }

    if (password !== adminPassword) {
      // Use consistent response time to prevent timing attacks
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    // 4. Set secure session cookie
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
