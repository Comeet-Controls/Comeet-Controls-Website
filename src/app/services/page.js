import Link from "next/link";
import { getServices, initDB } from "@/lib/db";

export const metadata = {
  title: "Services & Capabilities | Comeet Controls Pvt. Ltd. - Industrial Automation Pune",
  description:
    "Explore our complete industrial automation services: Special Purpose Machines (SPMs), PLC & HMI programming, SCADA development, electrical control panels, and troubleshooting.",
};

const processSteps = [
  { step: "01", title: "Requirement & Site Survey", desc: "Detailed discussion of part drawings, cycle time targets, electrical specs, and shop floor footprint." },
  { step: "02", title: "Engineering & CAD Design", desc: "Mechanical 3D CAD modeling in SolidWorks and electrical circuit design in EPLAN for client approval." },
  { step: "03", title: "Fabrication & Panel Wiring", desc: "Precision structural fabrication, panel assembly, component mounting, and systematic wiring ferruling." },
  { step: "04", title: "Factory Acceptance Testing (FAT)", desc: "Simulated dry-run testing, safety interlocking verification, and defect validation with client witnessing." },
  { step: "05", title: "Site Commissioning & Handover", desc: "On-site installation, production ramp-up support, operator training, and comprehensive documentation." },
];

export default async function ServicesPage() {
  let services = [];
  try {
    await initDB();
    const rows = await getServices();
    if (rows && rows.length > 0) services = rows;
  } catch {
    // DB not available — render empty (graceful degradation)
  }

  return (
    <div className="pt-8 pb-24">
      {/* Header Banner */}
      <section
        className="relative py-20 overflow-hidden border-b border-accent/10"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(0,102,255,0.15),transparent 70%),#020c18" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-4 bg-accent/10 border border-accent/25 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent dot-pulse" />
            Turnkey Engineering Solutions
          </div>
          <h1 className="font-head text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Industrial Automation <br />
            <span className="gradient-text">Services &amp; Capabilities</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            From single control panels to fully automated Special Purpose Machines and plant-wide SCADA installations,
            Comeet Controls delivers precision, safety, and turnkey dependability.
          </p>
        </div>
      </section>

      {/* Detailed Services Grid */}
      <section className="py-24 max-w-6xl mx-auto px-6 space-y-16">
        {services.map((s, idx) => (
          <div
            key={s.id ?? s.num}
            id={s.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-surface border border-accent/15 rounded-3xl p-8 md:p-12 card-hover"
          >
            <div className={`lg:col-span-7 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold font-head uppercase tracking-wider bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20">
                  {s.title}
                </span>
                <span className="text-xs text-muted font-mono">SERVICE #{s.num}</span>
              </div>
              <h2 className="font-head text-2xl md:text-3xl font-bold text-ctext mb-3">{s.title}</h2>
              {s.tagline && <p className="text-accent text-sm font-medium mb-4">{s.tagline}</p>}
              <p className="text-muted text-sm leading-relaxed mb-6">{s.description}</p>
              {s.capabilities && s.capabilities.length > 0 && (
                <>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ctext mb-3">Key Technical Scope:</h4>
                  <ul className="space-y-2.5 mb-8">
                    {s.capabilities.map((cap) => (
                      <li key={cap} className="text-xs text-muted flex items-start gap-2.5">
                        <i className="fas fa-check-circle text-accent text-sm mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-accent2 to-accent text-white text-xs font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-accent/20 transition-all"
              >
                Inquire About This Service <i className="fas fa-arrow-right text-[10px]" />
              </Link>
            </div>

            <div
              className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-1" : ""} flex flex-col items-center justify-center p-8 rounded-2xl bg-bg/60 border border-accent/10 text-center relative overflow-hidden`}
            >
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-inner ${s.cls || "bg-accent/10 text-accent"}`}>
                <i className={`fas ${s.icon}`} />
              </div>
              <span className="font-head font-extrabold text-6xl text-white/5 absolute -bottom-4 right-4 select-none">
                {s.num}
              </span>
              <div className="text-sm font-head font-semibold text-ctext mb-1">Comeet Controls Certified</div>
              <div className="text-xs text-muted">Field-Tested Industrial Standard</div>
            </div>
          </div>
        ))}
      </section>

      {/* Project Execution Lifecycle */}
      <section className="py-24 bg-bg2 border-t border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
              How We Work
            </div>
            <h2 className="font-head text-3xl md:text-4xl font-bold">
              Our 5-Stage <span className="gradient-text">Execution Lifecycle</span>
            </h2>
            <p className="text-muted text-sm mt-3">From initial requirement drafting to commissioning on your factory floor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processSteps.map((p) => (
              <div key={p.step} className="bg-surface border border-accent/15 rounded-2xl p-6 relative flex flex-col justify-between card-hover">
                <div>
                  <div className="font-head text-3xl font-extrabold text-accent mb-4">{p.step}</div>
                  <h3 className="font-head font-bold text-base text-ctext mb-2">{p.title}</h3>
                  <p className="text-muted text-xs leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center max-w-4xl mx-auto px-6">
        <h2 className="font-head text-3xl md:text-4xl font-bold mb-4">
          Need a Custom Solution for Your Plant?
        </h2>
        <p className="text-muted text-base max-w-xl mx-auto mb-8">
          Send us your machine specifications or electrical panel requirements, and our engineers will provide a comprehensive technical proposal.
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