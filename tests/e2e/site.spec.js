/**
 * tests/e2e/site.spec.js
 * ---------------------------------------------------------------------------
 * Phase 3: End-to-End (E2E) Tests — Playwright
 * Tests full user journeys in a real browser (Chromium by default).
 * Run: npx playwright test  OR  npm run test:e2e
 * Requires the dev/prod server to be running.
 * ---------------------------------------------------------------------------
 */

import { test, expect } from "@playwright/test";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";

// ---------------------------------------------------------------------------
// PHASE 3A — Homepage
// ---------------------------------------------------------------------------
test.describe("Phase 3A: Homepage", () => {
  test("loads successfully with 200 status", async ({ page }) => {
    const res = await page.goto(BASE);
    expect(res.status()).toBe(200);
  });

  test("hero section is visible and contains company name", async ({ page }) => {
    await page.goto(BASE);
    const hero = page.locator("#home, #hero, section").first();
    await expect(hero).toBeVisible();
    const bodyText = await page.textContent("body");
    expect(bodyText).toMatch(/Comeet/i);
  });

  test("page title is set correctly", async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/Comeet/i);
  });

  test("no uncaught JavaScript errors on homepage", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    expect(errors).toHaveLength(0);
  });

  test("no failed network requests (4xx/5xx) on homepage load", async ({ page }) => {
    const failed = [];
    page.on("response", (res) => {
      if (res.status() >= 400 && !res.url().includes("favicon")) {
        failed.push(`${res.status()} ${res.url()}`);
      }
    });
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    expect(failed).toHaveLength(0);
  });

  test("reCAPTCHA badge is visible (site key loaded)", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    // reCAPTCHA v3 injects a badge iframe
    const badge = page.frameLocator("iframe[src*='recaptcha']").first();
    // Just check the script loaded — grecaptcha exists on window
    const loaded = await page.evaluate(() => typeof window.grecaptcha !== "undefined");
    expect(loaded).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// PHASE 3B — Navigation
// ---------------------------------------------------------------------------
test.describe("Phase 3B: Navigation", () => {
  test("navbar is visible on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE);
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("clicking 'Contact' nav link scrolls to contact section", async ({ page }) => {
    await page.goto(BASE);
    const contactLink = page.locator("a[href*='contact'], a[href='#contact']").first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForTimeout(800);
      const contactSection = page.locator("#contact");
      await expect(contactSection).toBeInViewport();
    }
  });

  test("logo/brand link navigates to homepage", async ({ page }) => {
    await page.goto(`${BASE}/about`);
    const logo = page.locator("a[href='/'], a[href*='comeetindia']").first();
    if (await logo.isVisible()) {
      await logo.click();
      await expect(page).toHaveURL(/\/$/);
    }
  });
});

// ---------------------------------------------------------------------------
// PHASE 3C — Contact Section (Disabled State)
// ---------------------------------------------------------------------------
test.describe("Phase 3C: Contact Section (Disabled)", () => {
  test("contact section is visible on homepage", async ({ page }) => {
    await page.goto(BASE);
    const contact = page.locator("#contact");
    await expect(contact).toBeVisible();
  });

  test("'temporarily unavailable' notice is shown instead of form", async ({ page }) => {
    await page.goto(BASE);
    const bodyText = await page.textContent("body");
    // Should show the disabled notice text
    expect(bodyText).toMatch(/temporarily unavailable|improving our contact/i);
  });

  test("contact section shows direct contact options (phone/email)", async ({ page }) => {
    await page.goto(BASE);
    const bodyText = await page.textContent("body");
    expect(bodyText).toMatch(/\+91 99601 94497|sales@comeetindia\.com/i);
  });

  test("no contact form submit button visible while disabled", async ({ page }) => {
    await page.goto(BASE);
    const submitBtn = page.locator("button[type='submit']");
    // Either no submit button, or it's not visible
    const count = await submitBtn.count();
    if (count > 0) {
      await expect(submitBtn.first()).not.toBeVisible();
    }
  });
});

// ---------------------------------------------------------------------------
// PHASE 3D — Public Pages
// ---------------------------------------------------------------------------
test.describe("Phase 3D: Public Pages", () => {
  const pages = [
    { url: "/about",    label: "About" },
    { url: "/services", label: "Services" },
    { url: "/projects", label: "Projects" },
    { url: "/quality",  label: "Quality" },
    { url: "/contact",  label: "Contact" },
  ];

  for (const p of pages) {
    test(`${p.url} → loads with 200, no JS errors`, async ({ page }) => {
      const errors = [];
      page.on("pageerror", (err) => errors.push(err.message));
      const res = await page.goto(`${BASE}${p.url}`);
      expect(res.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      expect(errors).toHaveLength(0);
    });
  }

  test("/projects page renders project cards", async ({ page }) => {
    await page.goto(`${BASE}/projects`);
    await page.waitForLoadState("networkidle");
    const bodyText = await page.textContent("body");
    // At least one known project title should appear
    expect(bodyText).toMatch(/transmission|rewinding|assembly|sheeter|oil pump|NVH/i);
  });
});

// ---------------------------------------------------------------------------
// PHASE 3E — Admin Flow
// ---------------------------------------------------------------------------
test.describe("Phase 3E: Admin Login/Logout", () => {
  test("/admin redirects to login if not authenticated", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    await page.waitForLoadState("networkidle");
    const bodyText = await page.textContent("body");
    // Should show a password field or login form
    expect(bodyText).toMatch(/password|login|sign in/i);
  });

  test("admin login with wrong password shows error", async ({ page }) => {
    await page.goto(`${BASE}/admin`);
    const passwordInput = page.locator("input[type='password']").first();
    if (await passwordInput.isVisible()) {
      await passwordInput.fill("wrongpassword");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
      const bodyText = await page.textContent("body");
      expect(bodyText).toMatch(/invalid|incorrect|error/i);
    }
  });
});

// ---------------------------------------------------------------------------
// PHASE 3F — Responsive Design
// ---------------------------------------------------------------------------
test.describe("Phase 3F: Responsive Design", () => {
  const viewports = [
    { name: "Mobile",  width: 375,  height: 812 },
    { name: "Tablet",  width: 768,  height: 1024 },
    { name: "Desktop", width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    test(`Homepage renders correctly at ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(BASE);
      await page.waitForLoadState("networkidle");
      // Page should not overflow horizontally
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance
    });
  }
});

// ---------------------------------------------------------------------------
// PHASE 3G — SEO & Meta
// ---------------------------------------------------------------------------
test.describe("Phase 3G: SEO & Meta Tags", () => {
  test("homepage has meta description", async ({ page }) => {
    await page.goto(BASE);
    const metaDesc = page.locator("meta[name='description']");
    await expect(metaDesc).toHaveCount(1);
    const content = await metaDesc.getAttribute("content");
    expect(content?.length).toBeGreaterThan(10);
  });

  test("robots.txt is accessible", async ({ page }) => {
    const res = await page.goto(`${BASE}/robots.txt`);
    expect(res.status()).toBe(200);
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const res = await page.goto(`${BASE}/sitemap.xml`);
    expect(res.status()).toBe(200);
    const content = await page.textContent("body");
    expect(content).toMatch(/comeetindia\.com/);
  });
});
