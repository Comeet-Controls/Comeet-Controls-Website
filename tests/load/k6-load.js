/**
 * tests/load/k6-load.js
 * ---------------------------------------------------------------------------
 * Phase 5: Load Testing Script — k6
 * Install k6: https://k6.io/docs/getting-started/installation/
 * Run: k6 run tests/load/k6-load.js
 * Run with more VUs: k6 run --vus 50 --duration 60s tests/load/k6-load.js
 * ---------------------------------------------------------------------------
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

// Custom metrics
const errorRate    = new Rate("error_rate");
const apiDuration  = new Trend("api_duration_ms");

// ---------------------------------------------------------------------------
// Test configuration
// Change BASE_URL via: k6 run -e BASE_URL=https://www.comeetindia.com k6-load.js
// ---------------------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "15s", target: 10  }, // Ramp up to 10 users in 15s
    { duration: "30s", target: 30  }, // Ramp up to 30 concurrent users
    { duration: "30s", target: 50  }, // Peak: 50 concurrent users
    { duration: "15s", target: 0   }, // Ramp down
  ],
  thresholds: {
    // 95% of requests must complete in under 3 seconds
    http_req_duration: ["p(95)<3000"],
    // Error rate must stay below 1%
    error_rate: ["rate<0.01"],
    // 99% of requests must complete in under 5 seconds
    "http_req_duration{type:api}": ["p(99)<5000"],
  },
};

// ---------------------------------------------------------------------------
// Main test function — runs once per virtual user per iteration
// ---------------------------------------------------------------------------
export default function () {
  const headers = { "Content-Type": "application/json" };

  // --- Test 1: Homepage ---
  {
    const res = http.get(`${BASE_URL}/`, { tags: { type: "page" } });
    const ok = check(res, {
      "homepage → 200": (r) => r.status === 200,
      "homepage → responds under 3s": (r) => r.timings.duration < 3000,
    });
    errorRate.add(!ok);
  }

  sleep(0.5);

  // --- Test 2: Public Stats API ---
  {
    const res = http.get(`${BASE_URL}/api/data/stats`, { tags: { type: "api" } });
    const ok = check(res, {
      "GET /api/data/stats → 200":       (r) => r.status === 200,
      "stats response is JSON array":     (r) => { try { return Array.isArray(JSON.parse(r.body)); } catch { return false; } },
      "stats responds under 2s":          (r) => r.timings.duration < 2000,
    });
    apiDuration.add(res.timings.duration);
    errorRate.add(!ok);
  }

  sleep(0.3);

  // --- Test 3: Projects API ---
  {
    const res = http.get(`${BASE_URL}/api/data/projects`, { tags: { type: "api" } });
    const ok = check(res, {
      "GET /api/data/projects → 200":    (r) => r.status === 200,
      "projects responds under 2s":       (r) => r.timings.duration < 2000,
    });
    apiDuration.add(res.timings.duration);
    errorRate.add(!ok);
  }

  sleep(0.3);

  // --- Test 4: Contact API (Disabled — must return 503, not crash) ---
  {
    const payload = JSON.stringify({
      name: "Load Test User",
      email: "loadtest@example.com",
      phone: "+91 9999999999",
      service: "PLC Programming",
      message: "Load test message — automated test.",
      company_fax: "",
      _timestamp: Date.now() - 5000,
    });
    const res = http.post(`${BASE_URL}/api/contact`, payload, {
      headers,
      tags: { type: "api" },
    });
    const ok = check(res, {
      "POST /api/contact → 503 (disabled, not 500)": (r) => r.status === 503,
      "contact responds under 2s":                    (r) => r.timings.duration < 2000,
    });
    apiDuration.add(res.timings.duration);
    errorRate.add(!ok);
  }

  sleep(0.3);

  // --- Test 5: Wrong password brute force simulation ---
  {
    const res = http.post(
      `${BASE_URL}/api/admin/login`,
      JSON.stringify({ password: "wrongpass" }),
      { headers, tags: { type: "api" } }
    );
    check(res, {
      "Brute force → 401 or 429 (rate limited)": (r) => r.status === 401 || r.status === 429,
    });
  }

  sleep(1);
}

// ---------------------------------------------------------------------------
// Summary output after test run
// ---------------------------------------------------------------------------
export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration?.values?.["p(95)"] || 0;
  const errRate = (data.metrics.error_rate?.values?.rate || 0) * 100;
  const totalReqs = data.metrics.http_reqs?.values?.count || 0;

  console.log("\n===== LOAD TEST SUMMARY =====");
  console.log(`Total Requests   : ${totalReqs}`);
  console.log(`p95 Response Time: ${p95.toFixed(0)}ms`);
  console.log(`Error Rate       : ${errRate.toFixed(2)}%`);
  console.log(`Status           : ${errRate < 1 && p95 < 3000 ? "✅ PASSED" : "❌ FAILED"}`);
  console.log("=============================\n");

  return {
    "tests/load/results.json": JSON.stringify(data, null, 2),
  };
}
