"use client";
import { useEffect, useRef, useState } from "react";

function ServiceSkeleton() {
  return (
    <div className="bg-surface border border-accent/15 rounded-2xl p-9 animate-pulse">
      <div className="w-16 h-16 rounded-[18px] bg-accent/5 mb-6" />
      <div className="h-5 w-40 bg-accent/10 rounded mb-3" />
      <div className="h-3 w-full bg-accent/5 rounded mb-2" />
      <div className="h-3 w-3/4 bg-accent/5 rounded" />
    </div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from public API
  useEffect(() => {
    fetch("/api/data/services")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Reveal animation
  useEffect(() => {
    if (loading || data.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loading, data]);

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
          {/* Brochure Download */}
          <div className="mt-6 flex justify-center">
            <a
              href="/brochure.pdf"
              download="Comeet-Controls-Company-Brochure.pdf"
              className="brochure-tooltip inline-flex items-center gap-2 bg-surface border border-accent/25 text-accent text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-accent/10 transition-all"
              data-tip="PDF will be available soon"
              onClick={(e) => e.preventDefault()}
              aria-disabled="true"
            >
              <i className="fas fa-file-pdf text-[#ff3c78]" /> Download Full Services Brochure
            </a>
          </div>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceSkeleton key={i} />)
            : data.map((s, i) => (
                <div
                  key={s.id ?? s.num}
                  className="reveal relative overflow-hidden bg-surface border border-accent/15 rounded-2xl p-9 card-hover group"
                  style={{ transitionDelay: `${i * 0.05}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent2/6 to-accent/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <div className="absolute top-6 right-6 font-head text-[3rem] font-extrabold text-white/[0.03] leading-none select-none">{s.num}</div>
                  <div className={`w-16 h-16 rounded-[18px] flex items-center justify-center text-2xl mb-6 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${s.cls}`}>
                    <i className={`fas ${s.icon}`} />
                  </div>
                  <h3 className="font-head font-semibold text-lg mb-3 relative z-10">{s.title}</h3>
                  <p className="text-muted text-sm leading-relaxed relative z-10">{s.description || s.desc}</p>
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
