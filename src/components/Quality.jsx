"use client";
import { useEffect, useRef } from "react";

const items = [
  { icon:"fa-gauge-high",        label:"Performance & Reliability Testing"  },
  { icon:"fa-hammer",            label:"Durability & Strength Validation"   },
  { icon:"fa-leaf",              label:"Energy Efficiency Optimization"     },
  { icon:"fa-flask",             label:"Calibration & Functional Testing"   },
  { icon:"fa-truck-fast",        label:"On-Time Delivery & After-Sales Support" },
  { icon:"fa-screwdriver-wrench",label:"Installation & Commissioning Services"  },
];
const bars = [
  { pct: 100, label: "Customer Satisfaction Rate"  },
  { pct: 98,  label: "On-Time Project Delivery"    },
  { pct: 99,  label: "Zero-Defect Commissioning"   },
];

export default function Quality() {
  const ref     = useRef(null);
  const barRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal-left,.reveal-right").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          barRefs.current.forEach((el) => { if (el) el.style.width = el.dataset.width + "%"; });
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="quality" className="py-24 bg-bg" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left */}
        <div className="reveal-left">
          <div className="flex items-center gap-2.5 text-accent text-xs font-semibold uppercase tracking-[3px] mb-4">
            <div className="w-8 h-0.5 bg-accent rounded" /> Our Promise
          </div>
          <h2 className="font-head text-4xl font-bold mb-5">Quality <span className="gradient-text">Assurance</span></h2>
          <p className="text-muted text-base leading-relaxed mb-8">
            Quality is the cornerstone of everything we do. We examine every product and service against customer
            requirements and rigorous internal parameters.
          </p>
          <div className="flex flex-col gap-4">
            {items.map((it) => (
              <div
                key={it.label}
                className="flex items-center gap-4 px-6 py-4 rounded-xl bg-surface border border-accent/15 transition-all hover:border-accent/30 hover:translate-x-2"
              >
                <div className="w-9 h-9 rounded-[10px] flex-shrink-0 bg-gradient-to-br from-accent2 to-accent flex items-center justify-center text-white text-sm">
                  <i className={`fas ${it.icon}`} />
                </div>
                <span className="text-sm font-medium">{it.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Right */}
        <div className="reveal-right flex flex-col gap-6">
          {bars.map((b, i) => (
            <div key={b.label} className="relative overflow-hidden bg-surface border border-accent/15 rounded-2xl p-9">
              <div className="absolute inset-0 bg-gradient-to-br from-accent2/5 to-accent/3 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-head text-3xl font-bold text-accent mb-2">{b.pct}%</h3>
                <p className="text-muted text-sm">{b.label}</p>
                <div className="h-1 rounded-full bg-accent/15 mt-5 overflow-hidden">
                  <div
                    ref={(el) => (barRefs.current[i] = el)}
                    data-width={b.pct}
                    className="h-full rounded-full bg-gradient-to-r from-accent2 to-accent bar-fill"
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
