import Link from "next/link";
import Stats from "@/components/Stats";

export const metadata = {
  title: "About Us | Comeet Controls Pvt. Ltd. - Industrial Automation Pune",
  description:
    "Learn about Comeet Controls Pvt. Ltd. (formerly Comeet Engineering Services - CES). 12+ years of precision industrial automation, SPMs, and panel engineering in Pune.",
};

const values = [
  {
    icon: "fa-bullseye",
    title: "Precision Engineering",
    desc: "Every control panel, machine structure, and line of PLC code is engineered to exact mechanical and electrical tolerances.",
  },
  {
    icon: "fa-shield-halved",
    title: "Zero-Downtime Reliability",
    desc: "Industrial production cannot afford unplanned outages. We select premium industrial-grade switchgear, sensors, and fail-safe logic.",
  },
  {
    icon: "fa-handshake",
    title: "Customer-Centric Partnership",
    desc: "We work as an extension of your engineering team — from initial concept and CAD drafting to FAT, site installation, and 24/7 AMC.",
  },
  {
    icon: "fa-microchip",
    title: "Technology Agnostic",
    desc: "Certified expertise across Siemens, Rockwell Allen Bradley, Mitsubishi, Schneider, Delta, and Omron automation ecosystems.",
  },
];

const timeline = [
  {
    year: "2012",
    title: "Founding of CES",
    desc: "Established as Comeet Engineering Services (CES) in Pune, delivering specialized PLC programming and electrical control panels.",
  },
  {
    year: "2016",
    title: "Turnkey SPM Manufacturing",
    desc: "Expanded into turnkey Special Purpose Machines (SPMs), rewinding lines, and automotive component testing rigs.",
  },
  {
    year: "2020",
    title: "Incorporation as Pvt. Ltd.",
    desc: "Transitioned to Comeet Controls Pvt. Ltd., scaling manufacturing capacity, engineering team, and serving global clients.",
  },
  {
    year: "Present",
    title: "Industry 4.0 & NVH Systems",
    desc: "Pioneering cloud SCADA integration, smart sensor arrays, and advanced NVH acoustic/vibration defect detection.",
  },
];

const techStack = [
  { category: "PLC & Controllers", items: ["Siemens S7-1200/1500", "Allen Bradley MicroLogix/ControlLogix", "Mitsubishi FX/iQ-R", "Delta DVP/AS", "Schneider M221/M241"] },
  { category: "HMI & SCADA", items: ["Siemens WinCC / Comfort Panels", "Ignition SCADA", "Rockwell FactoryTalk", "Pro-face", "Wonderware InTouch"] },
  { category: "Motion & Drives", items: ["VFDs (ABB, Siemens, Delta)", "Servo Motors & Drives (Yaskawa, Mitsubishi)", "Pneumatics (Festo, SMC)", "Precision Ball Screws"] },
  { category: "Design & CAD", items: ["EPLAN Electric P8", "SolidWorks 3D Modeling", "AutoCAD Electrical", "Thermal Calculation Tools"] },
];

export default function AboutPage() {
  return (
    <div className="pt-8 pb-24">
      {/* Header Banner */}
      <section className="relative py-20 overflow-hidden border-b border-accent/10" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(0,102,255,0.15),transparent 70%),#020c18" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-4 bg-accent/10 border border-accent/25 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent dot-pulse" />
            Pune, Maharashtra, India
          </div>
          <h1 className="font-head text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Pioneering Industrial <br />
            <span className="gradient-text">Automation Excellence</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            From our headquarters in Pune, Comeet Controls Pvt. Ltd. (formerly Comeet Engineering Services / CES)
            engineers custom automation machinery, testing rigs, and control architectures that deliver tangible productivity gains.
          </p>
        </div>
      </section>

      {/* Heritage & Story */}
      <section className="py-24 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="w-6 h-0.5 bg-accent rounded" /> Our Heritage
          </div>
          <h2 className="font-head text-3xl md:text-4xl font-bold mb-6">
            From Engineering Consultancy to Turnkey Automation Partner
          </h2>
          <div className="space-y-4 text-muted text-base leading-relaxed">
            <p>
              Comeet Controls Pvt. Ltd. was founded with a clear focus: bridging the gap between mechanical design
              and intelligent industrial controls. What began as Comeet Engineering Services (CES) has grown into a
              full-spectrum automation house known across Pune&apos;s industrial belt for dependable execution.
            </p>
            <p>
              We bring together mechanical designers, electrical panel fabricators, and PLC/SCADA programmers under one
              roof. This integrated capability allows us to deliver turnkey Special Purpose Machines (SPMs),
              comprehensive testing rigs, and automated handling systems without relying on fragmented subcontractors.
            </p>
            <p>
              Today, we serve major manufacturing brands in automotive, hydraulics, paper converting, metal fabrication,
              and process industries, upholding our motto of &ldquo;Precision, Speed, and Zero Defects.&rdquo;
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent2 to-accent text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-accent/20 transition-all"
            >
              Contact Our Engineers <i className="fas fa-arrow-right text-xs" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-surface border border-accent/20 text-accent text-sm font-semibold px-6 py-3 rounded-xl hover:bg-accent/10 transition-all"
            >
              Explore Our Services
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="bg-surface border border-accent/15 rounded-2xl p-7">
            <div className="text-3xl text-accent font-head font-bold mb-2">50+</div>
            <div className="text-sm font-semibold text-ctext mb-1">Industrial Projects Delivered</div>
            <p className="text-xs text-muted">Covering transmission test rigs, rewinding systems, assembly cells, and PLC panels.</p>
          </div>
          <div className="bg-surface border border-accent/15 rounded-2xl p-7">
            <div className="text-3xl text-accent font-head font-bold mb-2">75+</div>
            <div className="text-sm font-semibold text-ctext mb-1">Satisfied Manufacturing Clients</div>
            <p className="text-xs text-muted">Across Maharashtra, national industrial corridors, and overseas manufacturing plants.</p>
          </div>
          <div className="bg-surface border border-accent/15 rounded-2xl p-7">
            <div className="text-3xl text-accent font-head font-bold mb-2">10+</div>
            <div className="text-sm font-semibold text-ctext mb-1">Senior Automation Engineers</div>
            <p className="text-xs text-muted">Dedicated to machine design, software programming, panel wiring, and field commissioning.</p>
          </div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <Stats />

      {/* Core Values */}
      <section className="py-24 bg-bg2 border-t border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
              Guiding Principles
            </div>
            <h2 className="font-head text-3xl md:text-4xl font-bold">
              What Sets <span className="gradient-text">Comeet Controls</span> Apart
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-surface border border-accent/15 rounded-2xl p-7 card-hover">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xl mb-6">
                  <i className={`fas ${v.icon}`} />
                </div>
                <h3 className="font-head font-bold text-lg mb-2 text-ctext">{v.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Brand Technical Stack */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
            Hardware &amp; Platforms
          </div>
          <h2 className="font-head text-3xl md:text-4xl font-bold">
            Industry Standard <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-muted text-sm mt-3">We architect systems using internationally recognized components to ensure lifetime serviceability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techStack.map((t) => (
            <div key={t.category} className="bg-surface border border-accent/15 rounded-2xl p-8">
              <h3 className="font-head font-bold text-lg text-accent mb-4 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" /> {t.category}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {t.items.map((it) => (
                  <li key={it} className="text-xs text-muted flex items-center gap-2 bg-bg/50 p-2.5 rounded-lg border border-accent/10">
                    <i className="fas fa-check text-accent text-[10px]" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-bg2 border-t border-accent/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
              Growth &amp; Milestones
            </div>
            <h2 className="font-head text-3xl md:text-4xl font-bold">
              Our Journey of <span className="gradient-text">Innovation</span>
            </h2>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 md:before:left-1/2 before:w-0.5 before:bg-accent/20">
            {timeline.map((item, idx) => (
              <div
                key={item.year}
                className={`relative flex flex-col md:flex-row items-start gap-8 ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="md:w-1/2 pl-12 md:pl-0">
                  <div className="bg-surface border border-accent/15 rounded-2xl p-6 card-hover">
                    <span className="text-xs font-bold font-head text-accent uppercase tracking-wider bg-accent/10 px-3 py-1 rounded-full border border-accent/25">
                      {item.year}
                    </span>
                    <h3 className="font-head font-bold text-lg text-ctext mt-3 mb-2">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <div className="absolute left-3.5 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-bg shadow-[0_0_12px_#00b4ff]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}