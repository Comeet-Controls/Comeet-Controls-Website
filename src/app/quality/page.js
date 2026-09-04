"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

const pillars = [
  {
    icon: "fa-gauge-high",
    title: "Performance & Endurance Stress Testing",
    desc: "Before dispatch, every Special Purpose Machine undergoes continuous 24 to 72-hour dry-run and simulated load endurance cycles to verify thermal stability, mechanical alignment, and repeatable cycle times.",
  },
  {
    icon: "fa-bolt-lightning",
    title: "Electrical Safety & IP Ingress Audits",
    desc: "All control panels undergo high-voltage dielectric tests, insulation resistance (Megger) checks, earth continuity verification, and IP55/IP65 gasket pressure testing compliant with IEC 60204-1 standards.",
  },
  {
    icon: "fa-flask-vial",
    title: "Sensor Calibration & Linearity Validation",
    desc: "Load cells, linear encoders, torque transducers, and analog flow sensors are calibrated against certified secondary masters to ensure sub-millimeter positioning and accurate measurement data.",
  },
  {
    icon: "fa-shield-halved",
    title: "Fail-Safe Logic & Fault Injection Testing",
    desc: "Our software engineers deliberately simulate extreme shop-floor failure modes — emergency stop activation, power brownouts, sensor disconnections, and operator jams — to guarantee fail-safe recovery.",
  },
  {
    icon: "fa-temperature-high",
    title: "FLIR Thermal Imaging & Heat Analysis",
    desc: "Control panels with high-power VFDs and servo amplifiers are scanned using FLIR infrared thermal cameras under load to detect terminal loose connections and ensure airflow dissipation.",
  },
  {
    icon: "fa-file-shield",
    title: "Comprehensive FAT / SAT Documentation",
    desc: "Clients receive a complete engineering documentation package with every system: signed FAT test protocols, EPLAN electrical schematics, PLC/HMI source backups, BOMs, and maintenance SOPs.",
  },
];

const metrics = [
  { pct: 100, label: "Customer Satisfaction Rate", sub: "Based on post-installation client surveys" },
  { pct: 98,  label: "On-Time Project Delivery",     sub: "Rigorous milestone tracking and supply chain management" },
  { pct: 99,  label: "Zero-Defect Commissioning",    sub: "First-run clearance during customer acceptance testing" },
  { pct: 99.8, label: "Field Uptime Reliability",    sub: "Operational reliability across deployed machines" },
];

const standards = [
  { code: "IEC 60204-1", title: "Safety of Machinery", desc: "Electrical equipment of industrial machines" },
  { code: "ISO 13849-1", title: "Functional Safety", desc: "Safety-related parts of machine control systems" },
  { code: "IS 8623 / IEC 61439", title: "Switchgear Assemblies", desc: "Low-voltage electrical control panels" },
  { code: "IP55 / IP65", title: "Ingress Protection", desc: "Dust-tight and water-spray resistant enclosures" },
];

export default function QualityPage() {
  const barRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          barRefs.current.forEach((el) => {
            if (el) el.style.width = el.dataset.width + "%";
          });
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    const container = document.getElementById("metrics-section");
    if (container) obs.observe(container);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="pt-8 pb-24">
      {/* Header Banner */}
      <section className="relative py-20 overflow-hidden border-b border-accent/10" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(0,102,255,0.15),transparent 70%),#020c18" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-4 bg-accent/10 border border-accent/25 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent dot-pulse" />
            Zero-Defect Commitment
          </div>
          <h1 className="font-head text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Quality Assurance &amp; <br />
            <span className="gradient-text">Testing Standards</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            Every machine, electrical panel, and automation architecture leaving Comeet Controls undergoes exhaustive
            multi-point quality screening to guarantee absolute dependability in high-volume industrial environments.
          </p>
        </div>
      </section>

      {/* Quality Philosophy Statement */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="bg-surface border border-accent/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.1),transparent_70%)]" />
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-accent rounded" /> Quality Philosophy
            </div>
            <h2 className="font-head text-2xl md:text-3xl font-bold text-ctext mb-4">
              &ldquo;Quality is not inspected in; it is engineered in from day one.&rdquo;
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-4">
              At Comeet Controls Pvt. Ltd., we understand the catastrophic cost of production line downtime.
              Our quality assurance system begins at the component selection stage — using only top-tier switchgear,
              sensors, and controllers — and culminates in extensive factory acceptance testing witnessed by our customers.
            </p>
            <p className="text-muted text-sm leading-relaxed">
              We adhere strictly to Indian and International electrotechnical standards (IEC/IS), ensuring that every
              control panel and machine we deliver provides years of maintenance-free service.
            </p>
          </div>
        </div>
      </section>

      {/* 6 Testing Pillars */}
      <section className="py-16 bg-bg2 border-t border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
              Testing Protocols
            </div>
            <h2 className="font-head text-3xl md:text-4xl font-bold">
              Our 6 Quality <span className="gradient-text">Testing Pillars</span>
            </h2>
            <p className="text-muted text-sm mt-3">Exhaustive verification protocols conducted prior to customer delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {pillars.map((p) => (
              <div key={p.title} className="bg-surface border border-accent/15 rounded-2xl p-7 card-hover flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xl mb-5">
                    <i className={`fas ${p.icon}`} />
                  </div>
                  <h3 className="font-head font-bold text-lg text-ctext mb-3">{p.title}</h3>
                  <p className="text-muted text-xs leading-relaxed">{p.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-accent/10 flex items-center gap-2 text-[11px] text-accent">
                  <i className="fas fa-check" /> Verified by QA Team
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Metrics Section */}
      <section id="metrics-section" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
            Track Record
          </div>
          <h2 className="font-head text-3xl md:text-4xl font-bold">
            Quantifiable <span className="gradient-text">Reliability Metrics</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {metrics.map((m, idx) => (
            <div key={m.label} className="bg-surface border border-accent/15 rounded-2xl p-8 relative overflow-hidden card-hover">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-head font-extrabold text-4xl text-accent">{m.pct}%</span>
                <span className="text-xs text-muted uppercase tracking-wider">Benchmark Standard</span>
              </div>
              <h3 className="font-head font-bold text-lg text-ctext mb-1">{m.label}</h3>
              <p className="text-muted text-xs mb-5">{m.sub}</p>
              <div className="h-2 rounded-full bg-accent/10 overflow-hidden">
                <div
                  ref={(el) => (barRefs.current[idx] = el)}
                  data-width={m.pct}
                  className="h-full rounded-full bg-gradient-to-r from-accent2 to-accent bar-fill"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance & Standards */}
      <section className="py-20 bg-bg2 border-t border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
              Certifications &amp; Standards
            </div>
            <h2 className="font-head text-3xl md:text-4xl font-bold">
              Engineered to <span className="gradient-text">Global Specifications</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((s) => (
              <div key={s.code} className="bg-surface border border-accent/15 rounded-2xl p-6 text-center card-hover">
                <span className="font-mono text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full uppercase">
                  {s.code}
                </span>
                <h3 className="font-head font-bold text-base text-ctext mt-4 mb-1">{s.title}</h3>
                <p className="text-muted text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center max-w-4xl mx-auto px-6">
        <h2 className="font-head text-3xl md:text-4xl font-bold mb-4">
          Looking for a Quality-Certified Automation Partner?
        </h2>
        <p className="text-muted text-base max-w-xl mx-auto mb-8">
          Our engineering facility in Pune is open for client inspection and technical discussions.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-accent2 to-accent text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-accent/25 transition-all"
        >
          Schedule a Quality Review <i className="fas fa-arrow-right text-xs" />
        </Link>
      </section>
    </div>
  );
}