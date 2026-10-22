/**
 * tests/api/api.test.js
 * ---------------------------------------------------------------------------
 * Phase 2: Backend & API Integration Tests
 * Hits the real running dev server at http://localhost:3000
 * Run `npm run dev` in one terminal, then `npm test` in another.
 * ---------------------------------------------------------------------------
 */

import { describe, it, expect } from "@jest/globals";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "comeet@admin2024";

// Helper: fetch with timeout
async function api(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

// Helper: get admin session cookie
async function getAdminCookie() {
  const res = await api("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: ADMIN_PASSWORD }),
  });
  const setCookie = res.headers.get("set-cookie");
  return setCookie?.split(";")[0] || "";
}

// ---------------------------------------------------------------------------
// PHASE 2A — Public Data API Endpoints
// ---------------------------------------------------------------------------
describe("Phase 2A: Public Data APIs (GET /api/data/*)", () => {
  const endpoints = [
    "/api/data/stats",
    "/api/data/projects",
    "/api/data/services",
    "/api/data/journey",
    "/api/data/certifications",
  ];

  for (const endpoint of endpoints) {
    it(`GET ${endpoint} → 200 + JSON array`, async () => {
      const res = await api(endpoint);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });

    it(`GET ${endpoint} → no raw SQL/DB error leaks`, async () => {
      const res = await api(endpoint);
      const text = await res.text();
      // These strings should NEVER appear in a client response
      expect(text).not.toMatch(/NeonDbError/i);
      expect(text).not.toMatch(/PostgreSQL/i);
      expect(text).not.toMatch(/stack trace/i);
      expect(text).not.toMatch(/at Object\./i);
    });

    it(`GET ${endpoint} → Cache-Control: no-store header set`, async () => {
      const res = await api(endpoint);
      expect(res.headers.get("cache-control")).toMatch(/no-store/i);
    });
  }
});

// ---------------------------------------------------------------------------
// PHASE 2B — Contact API (Currently Disabled)
// ---------------------------------------------------------------------------
describe("Phase 2B: Contact API (POST /api/contact)", () => {
  it("returns 503 Service Unavailable while form is disabled", async () => {
    const res = await api("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@test.com",
        phone: "+91 9999999999",
        service: "PLC Programming",
        message: "This is a test message.",
        company_fax: "",
        _timestamp: Date.now() - 5000,
        recaptchaToken: "",
      }),
    });
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data).toHaveProperty("error");
    // Error message should NOT contain raw DB/server details
    expect(data.error).not.toMatch(/DATABASE_URL/i);
    expect(data.error).not.toMatch(/stack/i);
  });

  it("POST with no body → does not crash server (returns 4xx or 503)", async () => {
    const res = await api("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    expect([400, 503]).toContain(res.status);
  });
});

// ---------------------------------------------------------------------------
// PHASE 2C — Admin Login
// ---------------------------------------------------------------------------
describe("Phase 2C: Admin Login (POST /api/admin/login)", () => {
  it("correct password → 200 + Set-Cookie header", async () => {
    const res = await api("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    const cookie = res.headers.get("set-cookie");
    expect(cookie).toBeTruthy();
    expect(cookie).toMatch(/admin_session=/);
    expect(cookie).toMatch(/HttpOnly/i);
  });

  it("wrong password → 401", async () => {
    const res = await api("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrongpassword123" }),
    });
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty("error");
    // Must NOT leak the actual password or hint at it
    expect(data.error).not.toMatch(/comeet/i);
    expect(data.error).not.toMatch(/environment/i);
  });

  it("missing password field → 400", async () => {
    const res = await api("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("oversized password (>200 chars) → 400", async () => {
    const res = await api("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "A".repeat(201) }),
    });
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// PHASE 2D — Admin Protected Routes (Auth Enforcement)
// ---------------------------------------------------------------------------
describe("Phase 2D: Admin Protected Routes (Auth Enforcement)", () => {
  const protectedRoutes = [
    { method: "GET",    path: "/api/admin/stats" },
    { method: "GET",    path: "/api/admin/projects" },
    { method: "GET",    path: "/api/admin/services" },
    { method: "GET",    path: "/api/admin/journey" },
    { method: "GET",    path: "/api/admin/certifications" },
  ];

  for (const route of protectedRoutes) {
    it(`${route.method} ${route.path} without cookie → 401`, async () => {
      const res = await api(route.path, { method: route.method });
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toMatch(/unauthorized/i);
    });
  }

  it("GET /api/admin/stats WITH valid session cookie → 200", async () => {
    const cookie = await getAdminCookie();
    expect(cookie).toBeTruthy();
    const res = await api("/api/admin/stats", {
      method: "GET",
      headers: { Cookie: cookie },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// PHASE 2E — Security Tests
// ---------------------------------------------------------------------------
describe("Phase 2E: Security", () => {
  it("Security headers present on homepage", async () => {
    const res = await api("/");
    expect(res.headers.get("x-frame-options")).toBe("DENY");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("referrer-policy")).toBeTruthy();
    expect(res.headers.get("content-security-policy")).toBeTruthy();
  });

  it("SQL injection in login password → 401, not 500", async () => {
    const payloads = [
      "' OR '1'='1",
      "'; DROP TABLE cms_stats; --",
      "admin'--",
      "1' UNION SELECT * FROM cms_stats--",
    ];
    for (const payload of payloads) {
      const res = await api("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: payload }),
      });
      // Must NOT be 200 (that would mean injection worked) or 500 (raw crash)
      expect(res.status).toBe(401);
    }
  });

  it("XSS payload in contact form body → does not crash (503 while disabled)", async () => {
    const res = await api("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "<script>alert('xss')</script>",
        email: "xss@test.com",
        message: "<img src=x onerror=alert(1)>",
        company_fax: "",
        _timestamp: Date.now() - 5000,
      }),
    });
    // 503 = disabled, 400 = validation caught it — both are correct
    expect([400, 503]).toContain(res.status);
    // Response must not echo back raw script tags
    const text = await res.text();
    expect(text).not.toMatch(/<script>/i);
  });

  it("Admin routes with fake/tampered cookie → 401", async () => {
    const res = await api("/api/admin/stats", {
      method: "GET",
      headers: { Cookie: "admin_session=fakehackertoken123" },
    });
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// PHASE 2F — Vercel/Next.js Route Integrity
// ---------------------------------------------------------------------------
describe("Phase 2F: Route Integrity", () => {
  const publicPages = ["/", "/about", "/services", "/projects", "/quality", "/contact"];

  for (const page of publicPages) {
    it(`${page} → 200 OK (page renders without error)`, async () => {
      const res = await api(page);
      expect(res.status).toBe(200);
    });
  }

  it("Non-existent route → 404", async () => {
    const res = await api("/this-page-does-not-exist-xyz");
    expect(res.status).toBe(404);
  });

  it("Old URL /about-us → 308 redirect to /about", async () => {
    const res = await api("/about-us", { redirect: "manual" });
    expect([301, 308]).toContain(res.status);
    expect(res.headers.get("location")).toMatch(/\/about/);
  });
});
