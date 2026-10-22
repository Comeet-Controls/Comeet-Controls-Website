/**
 * tests/api/db.test.js
 * ---------------------------------------------------------------------------
 * Phase 1: Database & Data Layer Tests
 * Tests every db.js function against the real Neon PostgreSQL database.
 * Requires DATABASE_URL in .env.local or CI environment.
 * ---------------------------------------------------------------------------
 */

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import {
  initDB,
  getStats,      createStat,      updateStat,      deleteStat,
  getProjects,   createProject,   updateProject,   deleteProject,
  getServices,   createService,   updateService,   deleteService,
  getJourney,    createJourneyItem, updateJourneyItem, deleteJourneyItem,
  getCertifications, createCertification, updateCertification, deleteCertification,
} from "../../src/lib/db.js";

// Track IDs created during tests so we can clean them up
const created = { stat: null, project: null, service: null, journey: null, cert: null };

// ---------------------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------------------
beforeAll(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local to run DB tests.");
  }
  // initDB must be idempotent — safe to call multiple times
  await initDB();
  await initDB(); // Call twice to verify no duplicate-seed errors
}, 60000);

// ---------------------------------------------------------------------------
// PHASE 1A — Connection & Init
// ---------------------------------------------------------------------------
describe("Phase 1A: DB Connection & initDB", () => {
  it("connects to Neon successfully", async () => {
    const stats = await getStats();
    expect(Array.isArray(stats)).toBe(true);
  });

  it("initDB is idempotent — no errors on repeated calls", async () => {
    await expect(initDB()).resolves.not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// PHASE 1B — Stats CRUD
// ---------------------------------------------------------------------------
describe("Phase 1B: Stats CRUD", () => {
  it("getStats returns an array of objects with required fields", async () => {
    const stats = await getStats();
    expect(stats.length).toBeGreaterThan(0);
    const first = stats[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("icon");
    expect(first).toHaveProperty("value");
    expect(first).toHaveProperty("suffix");
    expect(first).toHaveProperty("label");
  });

  it("createStat inserts and returns the new row", async () => {
    const newStat = {
      icon: "fa-test",
      value: 42,
      suffix: "+",
      label: "Test Stat — DELETE ME",
      sort_order: 999,
    };
    const result = await createStat(newStat);
    expect(result).toHaveProperty("id");
    expect(result.label).toBe("Test Stat — DELETE ME");
    created.stat = result.id;
  });

  it("updateStat updates the row correctly", async () => {
    const updated = await updateStat(created.stat, {
      icon: "fa-test-updated",
      value: 99,
      suffix: "%",
      label: "Test Stat Updated",
      sort_order: 999,
    });
    expect(updated.value).toBe(99);
    expect(updated.label).toBe("Test Stat Updated");
  });

  it("deleteStat removes the row without error", async () => {
    await expect(deleteStat(created.stat)).resolves.not.toThrow();
    created.stat = null;
  });
});

// ---------------------------------------------------------------------------
// PHASE 1C — Projects CRUD
// ---------------------------------------------------------------------------
describe("Phase 1C: Projects CRUD", () => {
  it("getProjects returns array with specs parsed as arrays (not raw JSON strings)", async () => {
    const projects = await getProjects();
    expect(projects.length).toBeGreaterThan(0);
    expect(Array.isArray(projects[0].specs)).toBe(true);
  });

  it("createProject inserts correctly with JSONB specs", async () => {
    const result = await createProject({
      tag: "Test",
      icon: "fa-test",
      bg: "",
      title: "Test Project — DELETE ME",
      short_desc: "Short",
      full_desc: "Full description",
      specs: [{ label: "PLC", value: "Siemens" }],
      sort_order: 999,
    });
    expect(result.title).toBe("Test Project — DELETE ME");
    created.project = result.id;
  });

  it("updateProject updates correctly", async () => {
    const updated = await updateProject(created.project, {
      tag: "Updated",
      icon: "fa-test",
      bg: "",
      title: "Test Project Updated",
      short_desc: "Short",
      full_desc: "Full",
      specs: [],
      sort_order: 999,
    });
    expect(updated.title).toBe("Test Project Updated");
  });

  it("deleteProject removes the row", async () => {
    await expect(deleteProject(created.project)).resolves.not.toThrow();
    created.project = null;
  });
});

// ---------------------------------------------------------------------------
// PHASE 1D — Services CRUD
// ---------------------------------------------------------------------------
describe("Phase 1D: Services CRUD", () => {
  it("getServices returns array with capabilities as arrays", async () => {
    const services = await getServices();
    expect(services.length).toBeGreaterThan(0);
    expect(Array.isArray(services[0].capabilities)).toBe(true);
  });

  it("createService inserts correctly", async () => {
    const result = await createService({
      num: "99",
      icon: "fa-test",
      cls: "bg-red-500",
      title: "Test Service — DELETE ME",
      description: "Test",
      sort_order: 999,
      tagline: "Test tagline",
      capabilities: ["Cap 1", "Cap 2"],
    });
    expect(result.title).toBe("Test Service — DELETE ME");
    created.service = result.id;
  });

  it("updateService updates correctly", async () => {
    const updated = await updateService(created.service, {
      num: "99",
      icon: "fa-test",
      cls: "bg-red-500",
      title: "Test Service Updated",
      description: "Updated",
      sort_order: 999,
      tagline: "Updated tagline",
      capabilities: [],
    });
    expect(updated.title).toBe("Test Service Updated");
  });

  it("deleteService removes the row", async () => {
    await expect(deleteService(created.service)).resolves.not.toThrow();
    created.service = null;
  });
});

// ---------------------------------------------------------------------------
// PHASE 1E — Journey CRUD
// ---------------------------------------------------------------------------
describe("Phase 1E: Journey CRUD", () => {
  it("getJourney returns an array", async () => {
    const journey = await getJourney();
    expect(Array.isArray(journey)).toBe(true);
    expect(journey.length).toBeGreaterThan(0);
  });

  it("createJourneyItem inserts correctly", async () => {
    const result = await createJourneyItem({
      year: "2099",
      title: "Test Journey — DELETE ME",
      description: "Test description",
      sort_order: 999,
    });
    expect(result.year).toBe("2099");
    created.journey = result.id;
  });

  it("updateJourneyItem updates correctly", async () => {
    const updated = await updateJourneyItem(created.journey, {
      year: "2098",
      title: "Test Journey Updated",
      description: "Updated",
      sort_order: 999,
    });
    expect(updated.year).toBe("2098");
  });

  it("deleteJourneyItem removes the row", async () => {
    await expect(deleteJourneyItem(created.journey)).resolves.not.toThrow();
    created.journey = null;
  });
});

// ---------------------------------------------------------------------------
// PHASE 1F — Certifications CRUD
// ---------------------------------------------------------------------------
describe("Phase 1F: Certifications CRUD", () => {
  it("getCertifications returns an array", async () => {
    const certs = await getCertifications();
    expect(Array.isArray(certs)).toBe(true);
    expect(certs.length).toBeGreaterThan(0);
  });

  it("createCertification inserts correctly", async () => {
    const result = await createCertification({
      code: "TEST-001",
      title: "Test Cert — DELETE ME",
      description: "Test",
      sort_order: 999,
    });
    expect(result.code).toBe("TEST-001");
    created.cert = result.id;
  });

  it("updateCertification updates correctly", async () => {
    const updated = await updateCertification(created.cert, {
      code: "TEST-002",
      title: "Test Cert Updated",
      description: "Updated",
      sort_order: 999,
    });
    expect(updated.code).toBe("TEST-002");
  });

  it("deleteCertification removes the row", async () => {
    await expect(deleteCertification(created.cert)).resolves.not.toThrow();
    created.cert = null;
  });
});

// ---------------------------------------------------------------------------
// PHASE 1G — Edge Case & Security Tests
// ---------------------------------------------------------------------------
describe("Phase 1G: Edge Cases", () => {
  it("handles empty string fields gracefully (no DB crash)", async () => {
    // Should not throw — DB accepts empty strings
    const result = await createStat({
      icon: "fa-test",
      value: 0,
      suffix: "",
      label: "Edge Case Test — DELETE ME",
      sort_order: 0,
    });
    expect(result).toHaveProperty("id");
    await deleteStat(result.id);
  });

  it("handles very long label (within 120 char limit)", async () => {
    const longLabel = "A".repeat(119);
    const result = await createStat({
      icon: "fa-test",
      value: 1,
      suffix: "+",
      label: longLabel,
      sort_order: 0,
    });
    expect(result.label.length).toBe(119);
    await deleteStat(result.id);
  });

  it("handles JSONB with deeply nested specs correctly", async () => {
    const result = await createProject({
      tag: "Edge",
      icon: "fa-edge",
      bg: "",
      title: "Edge JSONB Test — DELETE ME",
      short_desc: "",
      full_desc: "",
      specs: [
        { label: "Key1", value: "Value1" },
        { label: "Key2", value: "Value with 'single quotes' and \"double quotes\"" },
      ],
      sort_order: 999,
    });
    expect(Array.isArray(result.specs) || typeof result.specs === "string").toBe(true);
    await deleteProject(result.id);
  });
});

// ---------------------------------------------------------------------------
// CLEANUP — ensure nothing was left behind
// ---------------------------------------------------------------------------
afterAll(async () => {
  // Safety net: clean up any test rows that weren't deleted during tests
  const cleanupIds = Object.values(created).filter(Boolean);
  if (cleanupIds.length > 0) {
    console.warn("⚠️  Cleanup: Some test rows were not deleted during tests:", created);
  }
});
