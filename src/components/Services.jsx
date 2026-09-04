"use client";
import { useEffect, useRef } from "react";

const data = [
  { num:"01", icon:"fa-gears",           cls:"bg-accent2/15 text-accent2",  title:"Special Purpose Machines",    desc:"Custom-designed SPMs — full design, development, installation, and commissioning to meet your unique production requirements." },
  { num:"02", icon:"fa-microchip",       cls:"bg-accent/15 text-accent",    title:"PLC & HMI Programming",       desc:"Expert PLC, HMI, VFD, and servo-based programming for smooth machine operation and precise process automation." },
  { num:"03", icon:"fa-display",         cls:"bg-[#00c8a0]/15 text-[#00c8a0]", title:"SCADA Development",        desc:"Comprehensive SCADA design and development for real-time monitoring, control, and data acquisition across your plant." },
  { num:"04", icon:"fa-bolt",            cls:"bg-[#9650ff]/15 text-[#9650ff]", title:"Electrical Control Panels", desc:"Design and manufacturing of PLC control panels and power distribution panels to exacting industry standards." },
  { num:"05", icon:"fa-wrench",          cls:"bg-gold/15 text-gold",         title:"Troubleshooting & AMC",      desc:"Expert fault-finding team that minimizes downtime and keeps your production lines running at peak efficiency." },
  { num:"06", icon:"fa-layer-group",     cls:"bg-[#ff3c78]/15 text-[#ff3c78]", title:"Laser Cutting & Components", desc:"Precision acrylic and wood laser cutting, hardware engineering, and supply of automation and control components." },
];

export default function Services() {
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
    <section id="services" className="py-24 bg-bg" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2.5 text-accent text-xs font-semibold uppercase tracking-[3px] mb-4">
            What We Do
          </div>
          <h2 className="font-head text-4xl font-bold mb-5">Our Core <span className="gradient-text">Services</span></h2>
          <p className="text-muted text-base max-w-lg mx-auto">End-to-end industrial automation services — from design to deployment and beyond.</p>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((s, i) => (
            <div
              key={s.num}
              className="reveal relative overflow-hidden bg-surface border border-accent/15 rounded-2xl p-9 card-hover group"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent2/6 to-accent/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="absolute top-6 right-6 font-head text-[3rem] font-extrabold text-white/[0.03] leading-none select-none">{s.num}</div>
              <div className={`w-16 h-16 rounded-[18px] flex items-center justify-center text-2xl mb-6 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${s.cls}`}>
                <i className={`fas ${s.icon}`} />
              </div>
              <h3 className="font-head font-semibold text-lg mb-3 relative z-10">{s.title}</h3>
              <p className="text-muted text-sm leading-relaxed relative z-10">{s.desc}</p>
              <div className="flex items-center gap-1.5 text-accent text-xs font-semibold mt-5 relative z-10 transition-all duration-300 group-hover:gap-3">
                Learn More <i className="fas fa-arrow-right" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
