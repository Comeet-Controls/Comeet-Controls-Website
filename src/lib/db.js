import { neon } from "@neondatabase/serverless";

// ---------------------------------------------------------------------------
// Lazy SQL connection — only created on first real API call, not at build time
// This prevents build failures when DATABASE_URL is not set in the build env.
// ---------------------------------------------------------------------------
let _sql = null;

function sql(strings, ...values) {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set. Add it to .env.local (local) or Vercel Environment Variables (production)."
      );
    }
    _sql = neon(process.env.DATABASE_URL, {
      fetchOptions: {
        cache: "no-store",
      },
    });
  }
  return _sql(strings, ...values);
}

// ---------------------------------------------------------------------------
// initDB — runs schema creation/migration on every cold start.
// In Vercel serverless each request may be a fresh instance, so we do NOT
// cache the promise at module level — that would prevent fresh reads.
// The CREATE TABLE IF NOT EXISTS and ALTER TABLE IF NOT EXISTS statements
// are idempotent so running them on every cold start is safe.
// ---------------------------------------------------------------------------
export async function initDB() {
  await _doInit();
}

async function _doInit() {
  await sql`
    CREATE TABLE IF NOT EXISTS cms_stats (
      id SERIAL PRIMARY KEY,
      icon VARCHAR(60) NOT NULL,
      value INTEGER NOT NULL,
      suffix VARCHAR(10) NOT NULL DEFAULT '+',
      label VARCHAR(120) NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_projects (
      id SERIAL PRIMARY KEY,
      tag VARCHAR(100),
      icon VARCHAR(60),
      bg VARCHAR(300),
      title VARCHAR(200) NOT NULL,
      short_desc TEXT,
      full_desc TEXT,
      specs JSONB DEFAULT '[]',
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_services (
      id SERIAL PRIMARY KEY,
      num VARCHAR(5),
      icon VARCHAR(60),
      cls VARCHAR(200),
      title VARCHAR(200) NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      tagline TEXT,
      capabilities JSONB DEFAULT '[]'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_journey (
      id SERIAL PRIMARY KEY,
      year VARCHAR(20) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cms_certifications (
      id SERIAL PRIMARY KEY,
      code VARCHAR(100) NOT NULL,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0
    )
  `;

  // Migrations — add new columns to existing tables without dropping data
  await sql`ALTER TABLE cms_services ADD COLUMN IF NOT EXISTS tagline TEXT`;
  await sql`ALTER TABLE cms_services ADD COLUMN IF NOT EXISTS capabilities JSONB DEFAULT '[]'`;

  await seed();
}

// ---------------------------------------------------------------------------
// Seed default data if tables are empty
// ---------------------------------------------------------------------------
async function seed() {
  // Stats
  const statsRows = await sql`SELECT COUNT(*) as count FROM cms_stats`;
  if (parseInt(statsRows[0].count) === 0) {
    const statsData = [
      { icon: "fa-face-smile",        value: 75,  suffix: "+",  label: "Happy Clients",              sort_order: 0 },
      { icon: "fa-diagram-project",   value: 50,  suffix: "+",  label: "Projects Done",              sort_order: 1 },
      { icon: "fa-users",             value: 10,  suffix: "+",  label: "Expert Engineers",           sort_order: 2 },
      { icon: "fa-calendar-check",    value: 12,  suffix: "+",  label: "Years Experience",           sort_order: 3 },
      { icon: "fa-boxes-stacked",     value: 50,  suffix: "+",  label: "Total Projects Delivered",   sort_order: 4 },
      { icon: "fa-clock-rotate-left", value: 98,  suffix: "%",  label: "On-Time Commissioning",      sort_order: 5 },
      { icon: "fa-circle-check",      value: 100, suffix: "%",  label: "FAT Clearance on 1st Run",   sort_order: 6 },
      { icon: "fa-headset",           value: 24,  suffix: "/7", label: "Post-Handover Support",      sort_order: 7 },
    ];
    for (const s of statsData) {
      await sql`INSERT INTO cms_stats (icon, value, suffix, label, sort_order)
                VALUES (${s.icon}, ${s.value}, ${s.suffix}, ${s.label}, ${s.sort_order})`;
    }
  }

  // Projects
  const projRows = await sql`SELECT COUNT(*) as count FROM cms_projects`;
  if (parseInt(projRows[0].count) === 0) {
    const projectsData = [
      {
        tag: "Test Equipment", icon: "fa-gear", bg: "",
        title: "Transmission Test Rig",
        short_desc: "Automated test rig identifying defects in transmission components before final assembly.",
        full_desc: "A fully automated end-of-line test rig built to evaluate automotive transmission assemblies. The system performs multi-parameter testing including gear-shift quality, torque transmission efficiency, NVH signature comparison, and bearing vibration profiling — all within a single automated cycle.",
        specs: JSON.stringify([{ label: "PLC Platform", value: "Siemens S7-1500" }, { label: "HMI", value: "Siemens KTP900" }, { label: "Cycle Time", value: "< 90 seconds" }, { label: "Industry", value: "Automotive — Tier 1" }]),
        sort_order: 0,
      },
      {
        tag: "Manufacturing", icon: "fa-rotate", bg: "linear-gradient(135deg,#051a2e,#0a2a44)",
        title: "Rewinding Machine",
        short_desc: "Precision rewinding lines with advanced tension control for multiple materials.",
        full_desc: "A high-speed multi-material rewinding system with closed-loop tension control using servo drives. Handles paper, metallic foil, steel coil, and corrugated sheets with automatic splicer and web-break detection.",
        specs: JSON.stringify([{ label: "Drive System", value: "Servo Motor + VFD" }, { label: "Max Speed", value: "300 m/min" }, { label: "Industry", value: "Paper & Foil Manufacturing" }]),
        sort_order: 1,
      },
      {
        tag: "Assembly", icon: "fa-industry", bg: "linear-gradient(135deg,#05192a,#082138)",
        title: "Complete Assembly Line",
        short_desc: "Full EOL assembly line with integrated data acquisition for traceability.",
        full_desc: "A turnkey end-of-line automated assembly station with multi-station PLC interlocking, barcode-based part traceability, torque monitoring, and real-time SCADA dashboard reporting.",
        specs: JSON.stringify([{ label: "Traceability", value: "Barcode + SQL DB" }, { label: "PLC Platform", value: "Allen Bradley" }, { label: "Industry", value: "Automotive & White Goods" }]),
        sort_order: 2,
      },
      {
        tag: "Paper Industry", icon: "fa-file", bg: "linear-gradient(135deg,#061c2f,#0b2840)",
        title: "Paper Sheeter Line",
        short_desc: "Automated sheeter producing precise sheets from roll stock.",
        full_desc: "A fully automated sheeting line that converts large paper rolls into precision-cut sheets using a rotary knife with servo-controlled cut registration and automatic jam clearance.",
        specs: JSON.stringify([{ label: "Cut Accuracy", value: "±0.5 mm" }, { label: "Output Speed", value: "200 cuts/min" }, { label: "Industry", value: "Paper & Printing" }]),
        sort_order: 3,
      },
      {
        tag: "Hydraulics", icon: "fa-oil-can", bg: "linear-gradient(135deg,#061422,#0a1e32)",
        title: "Oil Pump Test Rig",
        short_desc: "Performance evaluation test rig for oil pumps ensuring reliability.",
        full_desc: "A hydraulic pump performance test rig that evaluates volumetric efficiency, pressure relief behavior, flow rate linearity, and leakage under cyclic load conditions with automatic pass/fail reporting.",
        specs: JSON.stringify([{ label: "Pressure Range", value: "0–350 Bar" }, { label: "Flow Rate", value: "0–150 LPM" }, { label: "Industry", value: "Hydraulics & Power" }]),
        sort_order: 4,
      },
      {
        tag: "Quality Control", icon: "fa-wave-square", bg: "linear-gradient(135deg,#04131f,#081b2c)",
        title: "NVH System Integration",
        short_desc: "Noise, Vibration & Harshness detection systems using reference-based analysis.",
        full_desc: "A production-integrated NVH system that captures high-resolution vibration signatures from rotating assemblies using tri-axial accelerometers and microphones. Defects detected by FFT spectra comparison against a golden-unit reference.",
        specs: JSON.stringify([{ label: "Analysis", value: "FFT, RMS, Envelope" }, { label: "Reject Accuracy", value: "> 97%" }, { label: "Industry", value: "Automotive & Gearbox" }]),
        sort_order: 5,
      },
    ];
    for (const p of projectsData) {
      await sql`INSERT INTO cms_projects (tag, icon, bg, title, short_desc, full_desc, specs, sort_order)
                VALUES (${p.tag}, ${p.icon}, ${p.bg}, ${p.title}, ${p.short_desc}, ${p.full_desc}, ${p.specs}, ${p.sort_order})`;
    }
  }

  // Services
  const svcRows = await sql`SELECT COUNT(*) as count FROM cms_services`;
  if (parseInt(svcRows[0].count) === 0) {
    const servicesData = [
      {
        num: "01", icon: "fa-gears", cls: "bg-accent2/15 text-accent2",
        title: "Special Purpose Machines",
        description: "Custom-designed SPMs — full design, development, installation, and commissioning to meet your unique production requirements.",
        tagline: "Custom-engineered automated machinery to solve complex assembly and testing bottlenecks.",
        capabilities: JSON.stringify([
          "End-of-line component testing rigs and inspection benches",
          "Automated and semi-automated multi-station assembly lines",
          "Pneumatic, hydraulic, and servo-driven indexing mechanisms",
          "Poka-Yoke error-proofing, sensor verification, and barcode tracking",
          "Complete 3D CAD modeling, structural FEA, and fabrication",
        ]),
        sort_order: 0,
      },
      {
        num: "02", icon: "fa-microchip", cls: "bg-accent/15 text-accent",
        title: "PLC & HMI Programming",
        description: "Expert PLC, HMI, VFD, and servo-based programming for smooth machine operation and precise process automation.",
        tagline: "Deterministic control logic, intuitive touch interfaces, and fail-safe interlocking.",
        capabilities: JSON.stringify([
          "Siemens TIA Portal (S7-1200, S7-1500, Safety PLCs)",
          "Rockwell Automation Studio 5000 / RSLogix (ControlLogix, CompactLogix)",
          "Mitsubishi Electric (GX Works 2/3, iQ-R, FX Series)",
          "Schneider Electric EcoStruxure & Delta Automation PLCs",
          "Ergonomic HMI screens with recipe handling, event logs, and animated mimics",
        ]),
        sort_order: 1,
      },
      {
        num: "03", icon: "fa-display", cls: "bg-[#00c8a0]/15 text-[#00c8a0]",
        title: "SCADA Development",
        description: "Comprehensive SCADA design and development for real-time monitoring, control, and data acquisition across your plant.",
        tagline: "Real-time plant visibility, historical data trending, and enterprise integration.",
        capabilities: JSON.stringify([
          "Centralized SCADA architecture with client-server deployment",
          "Real-time graphical plant mimics and interactive equipment control",
          "High-speed SQL data logging and automated shift/daily PDF reports",
          "OPC-UA, Modbus TCP/RTU, Profinet, and MQTT protocol integration",
          "Mobile and web-based dashboard access for plant managers",
        ]),
        sort_order: 2,
      },
      {
        num: "04", icon: "fa-bolt", cls: "bg-[#9650ff]/15 text-[#9650ff]",
        title: "Electrical Control Panels",
        description: "Design and manufacturing of PLC control panels and power distribution panels to exacting industry standards.",
        tagline: "Engineered panel manufacturing compliant with IEC/IS industrial standards.",
        capabilities: JSON.stringify([
          "IP55 / IP65 enclosure ratings with climate control (AC/exhaust fans)",
          "Computerized ferruling, structured wiring routing, and neat busbar layouts",
          "Comprehensive electrical schematics created in EPLAN Electric P8",
          "Short-circuit withstand, megger insulation, and high-voltage testing",
          "CE/IS standard compliance with branded switchgear (Schneider, Siemens, ABB)",
        ]),
        sort_order: 3,
      },
      {
        num: "05", icon: "fa-wrench", cls: "bg-yellow-400/15 text-yellow-400",
        title: "Troubleshooting & AMC",
        description: "Expert fault-finding team that minimizes downtime and keeps your production lines running at peak efficiency.",
        tagline: "Emergency fault diagnosis, cycle time optimization, and legacy modernization.",
        capabilities: JSON.stringify([
          "24/7 on-site emergency troubleshooting across Pune & Maharashtra",
          "Legacy controller migration (e.g. Siemens S5 to S7, older Omron to modern PLCs)",
          "Drive tuning, VFD harmonic minimization, and servo jitter reduction",
          "Cycle-time reduction audits and software refactoring",
          "Annual Maintenance Contracts (AMC) with scheduled preventative audits",
        ]),
        sort_order: 4,
      },
      {
        num: "06", icon: "fa-layer-group", cls: "bg-[#ff3c78]/15 text-[#ff3c78]",
        title: "Laser Cutting & Components",
        description: "Precision acrylic and wood laser cutting, hardware engineering, and supply of automation and control components.",
        tagline: "High-precision CNC cutting for enclosures, acrylics, wood, and hardware distribution.",
        capabilities: JSON.stringify([
          "High-precision laser cutting of acrylic panels, polycarbonate shields, and wood",
          "Custom machine fascia plates, engraved legend plates, and terminal covers",
          "Supply of certified industrial automation sensors, proximity switches, and relays",
          "VFDs, servo packages, power supplies, and terminal blocks at competitive rates",
          "Rapid prototyping and custom bracket fabrication for machine sensors",
        ]),
        sort_order: 5,
      },
    ];
    for (const s of servicesData) {
      await sql`INSERT INTO cms_services (num, icon, cls, title, description, tagline, capabilities, sort_order)
                VALUES (${s.num}, ${s.icon}, ${s.cls}, ${s.title}, ${s.description}, ${s.tagline}, ${s.capabilities}, ${s.sort_order})`;
    }
  }

  // Journey
  const journeyRows = await sql`SELECT COUNT(*) as count FROM cms_journey`;
  if (parseInt(journeyRows[0].count) === 0) {
    const journeyData = [
      { year: "2012",    title: "Founding of CES",             description: "Established as Comeet Engineering Services (CES) in Pune, delivering specialized PLC programming and electrical control panels.", sort_order: 0 },
      { year: "2016",    title: "Turnkey SPM Manufacturing",   description: "Expanded into turnkey Special Purpose Machines (SPMs), rewinding lines, and automotive component testing rigs.", sort_order: 1 },
      { year: "2020",    title: "Incorporation as Pvt. Ltd.",  description: "Transitioned to Comeet Controls Pvt. Ltd., scaling manufacturing capacity, engineering team, and serving global clients.", sort_order: 2 },
      { year: "Present", title: "Industry 4.0 & NVH Systems", description: "Pioneering cloud SCADA integration, smart sensor arrays, and advanced NVH acoustic/vibration defect detection.", sort_order: 3 },
    ];
    for (const j of journeyData) {
      await sql`INSERT INTO cms_journey (year, title, description, sort_order)
                VALUES (${j.year}, ${j.title}, ${j.description}, ${j.sort_order})`;
    }
  }

  // Certifications
  const certRows = await sql`SELECT COUNT(*) as count FROM cms_certifications`;
  if (parseInt(certRows[0].count) === 0) {
    const certData = [
      { code: "IEC 60204-1",         title: "Safety of Machinery",   description: "Electrical equipment of industrial machines",            sort_order: 0 },
      { code: "ISO 13849-1",         title: "Functional Safety",      description: "Safety-related parts of machine control systems",        sort_order: 1 },
      { code: "IS 8623 / IEC 61439", title: "Switchgear Assemblies",  description: "Low-voltage electrical control panels",                  sort_order: 2 },
      { code: "IP55 / IP65",         title: "Ingress Protection",     description: "Dust-tight and water-spray resistant enclosures",        sort_order: 3 },
    ];
    for (const c of certData) {
      await sql`INSERT INTO cms_certifications (code, title, description, sort_order)
                VALUES (${c.code}, ${c.title}, ${c.description}, ${c.sort_order})`;
    }
  }
}

// ---------------------------------------------------------------------------
// Query helpers — Stats
// ---------------------------------------------------------------------------
export async function getStats() {
  return await sql`SELECT * FROM cms_stats ORDER BY sort_order ASC, id ASC`;
}
export async function createStat({ icon, value, suffix, label, sort_order }) {
  const rows = await sql`
    INSERT INTO cms_stats (icon, value, suffix, label, sort_order)
    VALUES (${icon}, ${value}, ${suffix}, ${label}, ${sort_order ?? 0})
    RETURNING *`;
  return rows[0];
}
export async function updateStat(id, { icon, value, suffix, label, sort_order }) {
  const rows = await sql`
    UPDATE cms_stats SET icon=${icon}, value=${value}, suffix=${suffix}, label=${label}, sort_order=${sort_order ?? 0}
    WHERE id=${id} RETURNING *`;
  return rows[0];
}
export async function deleteStat(id) {
  await sql`DELETE FROM cms_stats WHERE id=${id}`;
}

// ---------------------------------------------------------------------------
// Query helpers — Projects
// ---------------------------------------------------------------------------
export async function getProjects() {
  const rows = await sql`SELECT * FROM cms_projects ORDER BY sort_order ASC, id ASC`;
  return rows.map((r) => ({ ...r, specs: typeof r.specs === "string" ? JSON.parse(r.specs) : (r.specs ?? []) }));
}
export async function createProject({ tag, icon, bg, title, short_desc, full_desc, specs, sort_order }) {
  const specsJson = JSON.stringify(specs ?? []);
  const rows = await sql`
    INSERT INTO cms_projects (tag, icon, bg, title, short_desc, full_desc, specs, sort_order)
    VALUES (${tag}, ${icon}, ${bg}, ${title}, ${short_desc}, ${full_desc}, ${specsJson}, ${sort_order ?? 0})
    RETURNING *`;
  return rows[0];
}
export async function updateProject(id, { tag, icon, bg, title, short_desc, full_desc, specs, sort_order }) {
  const specsJson = JSON.stringify(specs ?? []);
  const rows = await sql`
    UPDATE cms_projects SET tag=${tag}, icon=${icon}, bg=${bg}, title=${title},
    short_desc=${short_desc}, full_desc=${full_desc}, specs=${specsJson}, sort_order=${sort_order ?? 0}
    WHERE id=${id} RETURNING *`;
  return rows[0];
}
export async function deleteProject(id) {
  await sql`DELETE FROM cms_projects WHERE id=${id}`;
}

// ---------------------------------------------------------------------------
// Query helpers — Services
// ---------------------------------------------------------------------------
export async function getServices() {
  const rows = await sql`SELECT * FROM cms_services ORDER BY sort_order ASC, id ASC`;
  return rows.map((r) => ({
    ...r,
    capabilities: typeof r.capabilities === "string" ? JSON.parse(r.capabilities) : (r.capabilities ?? []),
  }));
}
export async function createService({ num, icon, cls, title, description, sort_order, tagline, capabilities }) {
  const capsJson = JSON.stringify(capabilities ?? []);
  const rows = await sql`
    INSERT INTO cms_services (num, icon, cls, title, description, sort_order, tagline, capabilities)
    VALUES (${num}, ${icon}, ${cls}, ${title}, ${description}, ${sort_order ?? 0}, ${tagline ?? null}, ${capsJson})
    RETURNING *`;
  return rows[0];
}
export async function updateService(id, { num, icon, cls, title, description, sort_order, tagline, capabilities }) {
  const capsJson = JSON.stringify(capabilities ?? []);
  const rows = await sql`
    UPDATE cms_services SET num=${num}, icon=${icon}, cls=${cls}, title=${title},
    description=${description}, sort_order=${sort_order ?? 0}, tagline=${tagline ?? null}, capabilities=${capsJson}
    WHERE id=${id} RETURNING *`;
  return rows[0];
}
export async function deleteService(id) {
  await sql`DELETE FROM cms_services WHERE id=${id}`;
}

// ---------------------------------------------------------------------------
// Query helpers — Journey
// ---------------------------------------------------------------------------
export async function getJourney() {
  return await sql`SELECT * FROM cms_journey ORDER BY sort_order ASC, id ASC`;
}
export async function createJourneyItem({ year, title, description, sort_order }) {
  const rows = await sql`
    INSERT INTO cms_journey (year, title, description, sort_order)
    VALUES (${year}, ${title}, ${description}, ${sort_order ?? 0})
    RETURNING *`;
  return rows[0];
}
export async function updateJourneyItem(id, { year, title, description, sort_order }) {
  const rows = await sql`
    UPDATE cms_journey SET year=${year}, title=${title}, description=${description}, sort_order=${sort_order ?? 0}
    WHERE id=${id} RETURNING *`;
  return rows[0];
}
export async function deleteJourneyItem(id) {
  await sql`DELETE FROM cms_journey WHERE id=${id}`;
}

// ---------------------------------------------------------------------------
// Query helpers — Certifications
// ---------------------------------------------------------------------------
export async function getCertifications() {
  return await sql`SELECT * FROM cms_certifications ORDER BY sort_order ASC, id ASC`;
}
export async function createCertification({ code, title, description, sort_order }) {
  const rows = await sql`
    INSERT INTO cms_certifications (code, title, description, sort_order)
    VALUES (${code}, ${title}, ${description}, ${sort_order ?? 0})
    RETURNING *`;
  return rows[0];
}
export async function updateCertification(id, { code, title, description, sort_order }) {
  const rows = await sql`
    UPDATE cms_certifications SET code=${code}, title=${title}, description=${description}, sort_order=${sort_order ?? 0}
    WHERE id=${id} RETURNING *`;
  return rows[0];
}
export async function deleteCertification(id) {
  await sql`DELETE FROM cms_certifications WHERE id=${id}`;
}
