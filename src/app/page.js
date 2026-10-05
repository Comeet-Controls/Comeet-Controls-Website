import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";
import { getServices, getProjects, initDB } from "@/lib/db";

export const revalidate = false;

// Fallback data shown if DB is unreachable
const FALLBACK_SERVICES = [
  { id: 1, num: "01", icon: "fa-gears",     cls: "bg-accent2/15 text-accent2",    title: "Special Purpose Machines (SPMs)",  description: "Turnkey custom automation machinery — design, mechanical fabrication, sensor integration, PLC logic, and site commissioning." },
  { id: 2, num: "02", icon: "fa-microchip", cls: "bg-accent/15 text-accent",      title: "PLC & HMI Programming",            description: "Robust automation software across Siemens, Allen Bradley, Mitsubishi, and Delta platforms with intuitive operator interfaces." },
  { id: 3, num: "03", icon: "fa-display",   cls: "bg-[#00c8a0]/15 text-[#00c8a0]",title: "SCADA & Industrial IoT",           description: "Centralized telemetry, real-time plant data logging, predictive alarm handling, and Industry 4.0 cloud connectivity." },
  { id: 4, num: "04", icon: "fa-bolt",      cls: "bg-[#9650ff]/15 text-[#9650ff]",title: "Electrical Control Panels",        description: "Engineered PCC, MCC, and VFD panels designed to IP55/65 standards with certified wiring and thermal protection." },
];

const FALLBACK_PROJECTS = [
  { id: 1, tag: "Automotive Rig",  icon: "fa-gear",        title: "Transmission Test Rig",    short_desc: "High-precision automated rig testing torque, gear transitions, and vibration defects prior to vehicle assembly." },
  { id: 2, tag: "Packaging Line",  icon: "fa-rotate",      title: "High-Speed Rewinding Line", short_desc: "Automated multi-material rewinding system with closed-loop tension control for paper, foil, and steel coils." },
  { id: 3, tag: "Quality Control", icon: "fa-wave-square", title: "NVH System Integration",    short_desc: "Acoustic and vibration monitoring system that detects micro-defects using reference FFT frequency analysis." },
];

export default async function Home() {
  // Fetch live data from Neon DB — falls back gracefully if DB is unavailable
  let featuredServices = FALLBACK_SERVICES;
  let featuredProjects = FALLBACK_PROJECTS;

  try {
    await initDB();
    const [allServices, allProjects] = await Promise.all([
      getServices(),
      getProjects(),
    ]);
    if (allServices.length > 0) featuredServices = allServices.slice(0, 4);
    if (allProjects.length > 0) featuredProjects = allProjects.slice(0, 3);
  } catch (e) {
    console.error("Homepage DB fetch failed, using fallback:", e.message);
  }

  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Scrolling Tech Marquee */}
      <Marquee />

      {/* 3. About Company Teaser */}
      <section className="py-24 bg-bg border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative overflow-hidden bg-surface border border-accent/15 rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-0.5 rounded bg-gradient-to-r from-accent2 to-accent" />
                <span className="font-head text-xs font-semibold text-accent uppercase tracking-widest">
                  Comeet Controls Pvt. Ltd.
                </span>
              </div>
              <h3 className="font-head text-2xl font-bold mb-4 text-ctext">
                Engineering Tomorrow&apos;s Industrial Automation
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Established with a heritage in precision engineering (formerly Comeet Engineering Services - CES),
                we build reliable automation systems and SPMs that power modern factories across India and abroad.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/15">
                  <div className="font-head font-bold text-accent text-lg">Pune, MH</div>
                  <div className="text-xs text-muted">Headquarters &amp; Works</div>
                </div>
                <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/15">
                  <div className="font-head font-bold text-accent text-lg">ISO Aligned</div>
                  <div className="text-xs text-muted">Industrial Standards</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 bg-gradient-to-br from-accent2 to-accent text-white p-5 rounded-2xl shadow-xl flex flex-col items-center">
              <span className="font-head text-3xl font-bold leading-none">12+</span>
              <span className="text-[0.65rem] uppercase tracking-wider mt-1">Years</span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
              <span className="w-6 h-0.5 bg-accent rounded" /> Company Overview
            </div>
            <h2 className="font-head text-3xl md:text-4xl font-bold leading-tight mb-5">
              Built on Precision, <span className="gradient-text">Proven in Performance</span>
            </h2>
            <p className="text-muted text-base leading-relaxed mb-8">
              We specialize in custom industrial automation architectures. Whether you require a single high-cycle
              assembly station, an entire test rig, or a plant-wide SCADA network, our engineers build with zero-downtime reliability.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold bg-surface border border-accent/30 text-accent hover:bg-accent/10 px-6 py-3 rounded-xl transition-all"
              >
                Read Full Story <i className="fas fa-arrow-right text-xs" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ctext px-4 py-3 transition-colors"
              >
                Browse Capabilities &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Animated Stats Bar */}
      <Stats />

      {/* 5. Services Overview — live from CMS */}
      <section className="py-24 bg-bg2 border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
                <span className="w-6 h-0.5 bg-accent rounded" /> Capabilities
              </div>
              <h2 className="font-head text-3xl md:text-4xl font-bold">
                Core Engineering <span className="gradient-text">Services</span>
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:gap-3 transition-all"
            >
              View All Services &amp; Tech Specs <i className="fas fa-arrow-right text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {featuredServices.map((s) => (
              <div
                key={s.id ?? s.num}
                className="relative overflow-hidden bg-surface border border-accent/15 rounded-2xl p-8 card-hover group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${s.cls}`}>
                    <i className={`fas ${s.icon}`} />
                  </div>
                  <span className="font-head text-3xl font-bold text-white/5">{s.num}</span>
                </div>
                <h3 className="font-head font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-6">{s.description || s.desc}</p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-accent text-xs font-semibold hover:underline"
                >
                  Learn more <i className="fas fa-arrow-right text-[10px]" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Featured Projects Showcase — live from CMS */}
      <section className="py-24 bg-bg border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
                <span className="w-6 h-0.5 bg-accent rounded" /> Track Record
              </div>
              <h2 className="font-head text-3xl md:text-4xl font-bold">
                Featured <span className="gradient-text">Projects</span>
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:gap-3 transition-all"
            >
              Explore All Case Studies <i className="fas fa-arrow-right text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((p) => (
              <div
                key={p.id ?? p.title}
                className="bg-surface border border-accent/15 rounded-2xl p-7 card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-accent/10 border border-accent/25 text-accent text-[0.7rem] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {p.tag}
                    </span>
                    <i className={`fas ${p.icon} text-muted/40 text-xl`} />
                  </div>
                  <h3 className="font-head font-bold text-lg mb-3">{p.title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-6">{p.short_desc || p.desc}</p>
                </div>
                <Link
                  href="/projects"
                  className="text-accent text-xs font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
                >
                  View Case Study <i className="fas fa-arrow-right text-[10px]" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#061525 0%,#0d2035 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-4 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full">
            Ready to Upgrade Your Plant?
          </div>
          <h2 className="font-head text-3xl md:text-5xl font-bold mb-6">
            Let&apos;s Design Your Custom Automation Solution
          </h2>
          <p className="text-muted text-base max-w-xl mx-auto mb-10">
            Consult directly with our engineering team in Pune. We deliver complete mechanical design,
            electrical engineering, control panels, software, and commissioning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-accent2 to-accent text-white font-semibold px-8 py-3.5 rounded-full shadow-[0_10px_35px_rgba(0,102,255,0.4)] hover:-translate-y-0.5 transition-all"
            >
              Request Free Consultation
            </Link>
            <Link
              href="/quality"
              className="bg-surface border border-accent/30 text-accent font-semibold px-8 py-3.5 rounded-full hover:bg-accent/10 transition-all"
            >
              Our Quality Standards
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}