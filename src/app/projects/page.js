"use client";
import { useState } from "react";
import Link from "next/link";

const categories = [
  "All Projects",
  "Testing Rigs",
  "Manufacturing & SPMs",
  "Assembly Lines",
  "Quality & Inspection",
];

const projectsData = [
  {
    id: "transmission-rig",
    category: "Testing Rigs",
    title: "Automotive Transmission Component Test Rig",
    industry: "Automotive OEM / Powertrain",
    hardware: "Siemens S7-1500 PLC, Kistler Torque Transducers, Servo Drive Actuation",
    challenge: "Detecting micro-backlash, gear transition resistance, and torque transmission anomalies on sub-assemblies before installation into full vehicle transmissions.",
    solution: "Custom test rig with high-precision servo drive, automated pneumatic clamping, and continuous torque curve acquisition at 1000 samples/sec.",
    result: "Eliminated transmission tear-downs down the line, saving over 40 hours of rework per week and ensuring 100% component compliance.",
    icon: "fa-gear",
    badge: "Testing Rig",
  },
  {
    id: "rewinding-machine",
    category: "Manufacturing & SPMs",
    title: "Precision Multi-Material Rewinding Machine",
    industry: "Converting, Foil & Irrigation Pipe Extrusion",
    hardware: "Mitsubishi iQ-R PLC, Closed-Loop Dancer Tension Arm, Dual Servo Spindles",
    challenge: "Handling thin aluminum foil, paper rolls, and flexible irrigation pipe extrusion without web tearing, tension spikes, or wrinkling during high-speed rewinding.",
    solution: "Designed an active closed-loop tension control system with ultra-sensitive load cells and synchronized electronic gearing across unwind and rewind axes.",
    result: "Achieved continuous line speeds of 250 m/min with zero web breaks and tight edge-alignment tolerances within ±0.5 mm.",
    icon: "fa-rotate",
    badge: "Rewinding Machine",
  },
  {
    id: "assembly-line",
    category: "Assembly Lines",
    title: "Complete End-of-Line (EOL) Assembly Line",
    industry: "Industrial Valves & Fluid Controls",
    hardware: "Allen Bradley CompactLogix, Cognex Vision Cameras, Barcode Handlers, SQL Server",
    challenge: "Assembling multi-part valves with multi-stage torque fastening, O-ring seal placement verification, and full component serial number traceability.",
    solution: "Engineered an 8-station semi-automatic rotary and linear transfer line equipped with vision inspection, digital torque wrenches, and automated barcode laser engraving.",
    result: "Increased assembly throughput by 140% while achieving complete digital traceability archived into the plant SQL database.",
    icon: "fa-industry",
    badge: "Assembly Line",
  },
  {
    id: "paper-sheeter",
    category: "Manufacturing & SPMs",
    title: "High-Speed Automated Paper Sheeter Line",
    industry: "Paper & Packaging Converting",
    hardware: "Schneider Electric PacDrive, Synchronized Rotary Cutter, Safety Light Curtains",
    challenge: "Converting massive raw paper roll stock into precise finished sheets with high accuracy, minimal edge fraying, and operator safety at high cycle rates.",
    solution: "Engineered a servo-synchronized rotary shear cutter featuring pneumatic deceleration nip rollers, static eliminators, and an automatic scissor-lift stacker.",
    result: "Sub-millimeter cutting accuracy (±0.25 mm) at speeds up to 180 cuts per minute with category-4 functional safety interlocking.",
    icon: "fa-file",
    badge: "Paper Converting",
  },
  {
    id: "oil-pump-rig",
    category: "Testing Rigs",
    title: "Hydraulic Oil Pump Performance Test Rig",
    industry: "Hydraulics & Heavy Equipment",
    hardware: "Siemens S7-1200 PLC, High-Pressure Flow Meters, Proportional Pressure Valves",
    challenge: "Validating flow rate vs. system pressure characteristics, volumetric efficiency, and shaft seal leakage across full operating temperature ranges.",
    solution: "Built a fully enclosed hydraulic test cell with automated oil temperature conditioning, automated valve throttling, and real-time P-Q curve generation.",
    result: "Automated the entire 12-minute test cycle down to 3 minutes, generating signed PDF inspection certificates for each serialized pump.",
    icon: "fa-oil-can",
    badge: "Hydraulics Rig",
  },
  {
    id: "nvh-system",
    category: "Quality & Inspection",
    title: "NVH Acoustic & Vibration System Integration",
    industry: "Precision Rotating Machinery & Motors",
    hardware: "National Instruments DAQ, Triaxial Piezoelectric Accelerometers, Custom FFT Analysis",
    challenge: "Identifying invisible bearing defects, shaft imbalance, and gear tooth imperfections that cannot be detected by conventional human hearing or visual checks.",
    solution: "Integrated industrial accelerometers and acoustic microphones connected to a high-speed DSP engine that compares frequency spectrums against golden master profiles.",
    result: "Achieved 99.4% defect detection accuracy for microscopic bearing spalls, preventing defective motors from entering commercial supply chains.",
    icon: "fa-wave-square",
    badge: "Inspection System",
  },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All Projects");

  const filteredProjects =
    activeCategory === "All Projects"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-8 pb-24">
      {/* Header Banner */}
      <section className="relative py-20 overflow-hidden border-b border-accent/10" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(0,102,255,0.15),transparent 70%),#020c18" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-4 bg-accent/10 border border-accent/25 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent dot-pulse" />
            Engineering Case Studies
          </div>
          <h1 className="font-head text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Featured <br />
            <span className="gradient-text">Projects &amp; Test Rigs</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            A showcase of custom Special Purpose Machines, automotive test benches, automated assembly cells,
            and inspection systems designed and deployed by Comeet Controls.
          </p>
        </div>
      </section>

      {/* Interactive Filter Bar */}
      <section className="py-12 max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-accent2 to-accent text-white shadow-[0_4px_20px_rgba(0,102,255,0.4)]"
                  : "bg-surface border border-accent/15 text-muted hover:text-ctext hover:border-accent/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-surface border border-accent/15 rounded-3xl p-8 card-hover flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle,rgba(0,180,255,0.06),transparent_70%)] pointer-events-none" />

              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent text-xl">
                      <i className={`fas ${p.icon}`} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{p.badge}</span>
                      <div className="text-[0.7rem] text-muted">{p.industry}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted bg-bg/50 px-3 py-1 rounded-full border border-accent/10">
                    {p.category}
                  </span>
                </div>

                <h3 className="font-head text-2xl font-bold text-ctext mb-4">{p.title}</h3>

                <div className="space-y-3.5 mb-6 text-xs">
                  <div className="p-3 rounded-xl bg-bg/60 border border-accent/10">
                    <strong className="text-accent block mb-1 uppercase tracking-wider text-[10px]">Architecture &amp; Hardware</strong>
                    <span className="text-muted">{p.hardware}</span>
                  </div>

                  <div>
                    <strong className="text-ctext block mb-1 font-head text-sm">Challenge:</strong>
                    <p className="text-muted leading-relaxed">{p.challenge}</p>
                  </div>

                  <div>
                    <strong className="text-ctext block mb-1 font-head text-sm">Engineering Solution:</strong>
                    <p className="text-muted leading-relaxed">{p.solution}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-accent2/10 border border-accent2/20">
                    <strong className="text-accent block mb-1 text-[10px] uppercase tracking-wider">Quantified Result</strong>
                    <span className="text-ctext font-medium">{p.result}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-accent/10 flex items-center justify-between">
                <span className="text-[11px] text-muted">Field-Tested in Production</span>
                <Link
                  href="/contact"
                  className="text-xs font-semibold text-accent hover:underline flex items-center gap-1.5"
                >
                  Discuss Similar Project <i className="fas fa-arrow-right text-[10px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Results Banner */}
      <section className="py-20 bg-bg2 border-t border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-head text-4xl font-bold text-accent mb-1">50+</div>
              <div className="text-xs text-muted uppercase tracking-wider">Total Projects Delivered</div>
            </div>
            <div>
              <div className="font-head text-4xl font-bold text-accent mb-1">98%</div>
              <div className="text-xs text-muted uppercase tracking-wider">On-Time Commissioning</div>
            </div>
            <div>
              <div className="font-head text-4xl font-bold text-accent mb-1">100%</div>
              <div className="text-xs text-muted uppercase tracking-wider">FAT Clearance on 1st Run</div>
            </div>
            <div>
              <div className="font-head text-4xl font-bold text-accent mb-1">24/7</div>
              <div className="text-xs text-muted uppercase tracking-wider">Post-Handover Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center max-w-4xl mx-auto px-6">
        <h2 className="font-head text-3xl md:text-4xl font-bold mb-4">
          Ready to Build Your Custom Machine or Rig?
        </h2>
        <p className="text-muted text-base max-w-xl mx-auto mb-8">
          Share your part drawings, cycle time targets, or plant specifications with our engineering team in Pune.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-accent2 to-accent text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-accent/25 transition-all"
        >
          Request Technical Consultation <i className="fas fa-arrow-right text-xs" />
        </Link>
      </section>
    </div>
  );
}