// ---------------------------------------------------------------------------
// Auth helpers for the admin CMS session
// SECURITY: Uses HMAC-SHA256 (one-way cryptographic hash), NOT reversible Base64
// ---------------------------------------------------------------------------

import { createHmac } from "crypto";

const SALT = "comeet_salt_2024";
const COOKIE_NAME = "admin_session";
const SEVEN_DAYS = 7 * 24 * 60 * 60; // seconds

/**
 * Generates the expected session token using HMAC-SHA256.
 * This is a one-way hash — cannot be reversed to get the password.
 */
function getExpectedToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is not set. Add it to Vercel environment variables."
    );
  }
  return createHmac("sha256", SALT).update(password).digest("hex");
}

/**
 * Reads the admin_session cookie from a Next.js Request and validates it.
 * @param {import('next/server').NextRequest} request
 * @returns {boolean}
 */
export function getAdminSession(request) {
  try {
    let token;
    if (request.cookies && typeof request.cookies.get === "function") {
      token = request.cookies.get(COOKIE_NAME)?.value;
    } else {
      // Fallback: manual parse with explicit decode
      const cookieHeader = request.headers.get("cookie") || "";
      const cookies = Object.fromEntries(
        cookieHeader.split(";").map((c) => {
          const [k, ...v] = c.trim().split("=");
          return [k.trim(), decodeURIComponent(v.join("="))];
        })
      );
      token = cookies[COOKIE_NAME];
    }
    if (!token) return false;
    return token === getExpectedToken();
  } catch {
    return false;
  }
}

/**
 * Returns a Set-Cookie header string for a valid admin session.
 * @returns {string}
 */
export function createSessionCookie() {
  const token = getExpectedToken();
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "; Secure" : "";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SEVEN_DAYS}${secure}`;
}

/**
 * Returns a Set-Cookie header string that clears the admin session.
 * @returns {string}
 */
export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}
