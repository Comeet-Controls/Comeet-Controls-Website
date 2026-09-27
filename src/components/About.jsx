"use client";
import { useEffect, useRef } from "react";

const pills = ["PLC / HMI","SCADA","Control Panels","SPMs","VFD / Servo","Laser Cutting","DCS","Commissioning"];
const features = [
  { icon: "fa-shield-halved", title: "Quality-First Approach", desc: "Every solution is tested, calibrated, and delivered to meet the highest industrial standards." },
  { icon: "fa-clock",         title: "On-Time Delivery",       desc: "We respect your production timelines — minimum downtime is our promise." },
  { icon: "fa-globe",         title: "National & Global Reach", desc: "Serving clients across India and internationally with localized expertise." },
];

export default function About() {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal-left,.reveal-right").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 bg-bg" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Visual Card */}
        <div className="relative reveal-left">
          <div className="relative overflow-hidden bg-surface border border-accent/15 rounded-3xl p-12">
            <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[radial-gradient(circle,rgba(0,102,255,0.2),transparent_70%)]" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(0,180,255,0.12),transparent_70%)]" />
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-0.5 rounded bg-gradient-to-r from-accent2 to-accent" />
              <span className="font-head text-sm font-semibold text-accent uppercase tracking-widest">Comeet Controls Pvt. Ltd.</span>
            </div>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Formerly known as <strong className="text-ctext">Comeet Engineering Services (CES)</strong>, we are a Pune-based
              industrial automation company serving clients nationally and globally. Our portfolio spans automation solutions,
              SPMs, control panels, and cutting-edge software integrations.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {pills.map((p) => (
                <span key={p} className="bg-accent/8 border border-accent/20 text-accent text-xs font-medium px-3.5 py-1.5 rounded-full hover:bg-accent/18 hover:-translate-y-0.5 transition-all cursor-default">
                  {p}
                </span>
              ))}
            </div>
            <div className="absolute bottom-6 right-5 font-head text-[3.5rem] font-extrabold text-ctext/[0.04] leading-none select-none pointer-events-none">CES</div>
          </div>
          {/* Badge */}
          <div className="absolute -top-6 -right-6 w-22 h-22 rounded-full bg-gradient-to-br from-accent2 to-accent flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,102,255,0.4)]" style={{width:88,height:88}}>
            <span className="font-head text-3xl font-bold leading-none text-white">12+</span>
            <span className="text-white/85 text-[0.6rem] uppercase tracking-wider">Years</span>
          </div>
        </div>

        {/* Text */}
        <div className="reveal-right">
          <div className="flex items-center gap-2.5 text-accent text-xs font-semibold uppercase tracking-[3px] mb-4">
            <div className="w-8 h-0.5 bg-accent rounded" />Who We Are
          </div>
          <h2 className="font-head text-4xl font-bold leading-tight mb-5">
            Built on <span className="gradient-text">Precision</span>,<br />Powered by Innovation
          </h2>
          <p className="text-muted text-base leading-relaxed mb-10">
            We design, develop, install, and commission cutting-edge automation systems tailored to your industry&apos;s exact
            needs — combining hardware expertise with intelligent software solutions.
          </p>
          <div className="flex flex-col gap-5">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent transition-all group-hover:bg-accent/20 group-hover:scale-105">
                  <i className={`fas ${f.icon} text-lg`} />
                </div>
                <div>
                  <h4 className="font-head font-semibold text-sm mb-1">{f.title}</h4>
                  <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Brochure Download — enabled once PDF is placed at public/brochure.pdf */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/brochure.pdf"
              download="Comeet-Controls-Company-Brochure.pdf"
              className="brochure-tooltip inline-flex items-center gap-2 bg-surface border border-accent/25 text-accent text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-accent/10 transition-all"
              data-tip="PDF will be available soon"
              onClick={(e) => e.preventDefault()}
              aria-disabled="true"
            >
              <i className="fas fa-file-pdf text-[#ff3c78]" /> Download Company Brochure
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

