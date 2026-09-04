"use client";
import { useEffect, useRef } from "react";

const data = [
  { tag:"Test Equipment", icon:"fa-gear",        bg:"", title:"Transmission Test Rig",  desc:"Automated test rig identifying defects in transmission components before final assembly, reducing losses and ensuring quality." },
  { tag:"Manufacturing",  icon:"fa-rotate",      bg:"linear-gradient(135deg,#051a2e,#0a2a44)", title:"Rewinding Machine",    desc:"Precision rewinding lines with advanced tension control for paper, wire, steel sheets, aluminum foils, and irrigation pipe materials." },
  { tag:"Assembly",       icon:"fa-industry",    bg:"linear-gradient(135deg,#05192a,#082138)", title:"Complete Assembly Line", desc:"Full EOL assembly line with integrated data acquisition for traceability, quality tracking, and future performance analysis." },
  { tag:"Paper Industry", icon:"fa-file",        bg:"linear-gradient(135deg,#061c2f,#0b2840)", title:"Paper Sheeter Line",  desc:"Automated sheeter producing precise sheets from roll stock, minimizing human error and protecting personnel and machinery." },
  { tag:"Hydraulics",     icon:"fa-oil-can",     bg:"linear-gradient(135deg,#061422,#0a1e32)", title:"Oil Pump Test Rig",   desc:"Performance evaluation test rig for oil pumps before integration into assemblies — ensuring reliability and zero field failures." },
  { tag:"Quality Control",icon:"fa-wave-square", bg:"linear-gradient(135deg,#04131f,#081b2c)", title:"NVH System Integration", desc:"Noise, Vibration & Harshness detection systems that identify invisible defects with high precision using reference-based analysis." },
];

export default function Projects() {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="projects"
      className="py-24"
      ref={ref}
      style={{ background: "linear-gradient(180deg,#020c18 0%,#061525 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <div className="flex items-center gap-2.5 text-accent text-xs font-semibold uppercase tracking-[3px] mb-4">
            <div className="w-8 h-0.5 bg-accent rounded" /> Latest Work
          </div>
          <h2 className="font-head text-4xl font-bold mb-4">Featured <span className="gradient-text">Projects</span></h2>
          <p className="text-muted text-base max-w-lg">Successfully executed projects for national and international customers across multiple industries.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.map((p, i) => (
            <div
              key={p.title}
              className="reveal bg-surface border border-accent/15 rounded-2xl overflow-hidden card-hover-light group"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <div
                className="relative h-48 flex items-center justify-center overflow-hidden"
                style={{ background: p.bg || "linear-gradient(135deg,#061525,#0d2035)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent2/15 to-accent/8" />
                <i className={`fas ${p.icon} text-6xl text-accent/20 transition-all duration-300 group-hover:opacity-35 group-hover:scale-110`} />
                <span className="absolute top-4 left-4 bg-accent/15 border border-accent/30 text-accent text-[0.7rem] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                  {p.tag}
                </span>
              </div>
              <div className="p-7">
                <h3 className="font-head font-semibold text-lg mb-2.5">{p.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
