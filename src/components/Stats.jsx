"use client";
import { useEffect, useRef, useState } from "react";

function Counter({ target, started }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let cur = 0;
    const step = target / (2000 / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [started, target]);
  return <span>{val}</span>;
}

function SkeletonCard() {
  return (
    <div className="text-center py-10 px-4 bg-[#061525] animate-pulse">
      <div className="w-6 h-6 rounded-full bg-accent/10 mx-auto mb-3" />
      <div className="h-8 w-16 rounded-lg bg-accent/10 mx-auto mb-2" />
      <div className="h-3 w-24 rounded bg-accent/5 mx-auto" />
    </div>
  );
}

// Fallback data — shown if DB/API is unreachable. Matches seed defaults in db.js.
const FALLBACK_STATS = [
  { id: 1, icon: "fa-face-smile",        value: 75,  suffix: "+",  label: "Happy Clients" },
  { id: 2, icon: "fa-diagram-project",   value: 50,  suffix: "+",  label: "Projects Done" },
  { id: 3, icon: "fa-users",             value: 10,  suffix: "+",  label: "Expert Engineers" },
  { id: 4, icon: "fa-calendar-check",    value: 12,  suffix: "+",  label: "Years Experience" },
  { id: 5, icon: "fa-boxes-stacked",     value: 50,  suffix: "+",  label: "Total Projects Delivered" },
  { id: 6, icon: "fa-clock-rotate-left", value: 98,  suffix: "%",  label: "On-Time Commissioning" },
  { id: 7, icon: "fa-circle-check",      value: 100, suffix: "%",  label: "FAT Clearance on 1st Run" },
  { id: 8, icon: "fa-headset",           value: 24,  suffix: "/7", label: "Post-Handover Support" },
];

export default function Stats({ statsData = FALLBACK_STATS }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const loading = !statsData || statsData.length === 0;

  // Counter animation trigger on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Reveal animation
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loading, statsData]);

  return (
    <div
      ref={ref}
      className="border-t border-b border-accent/15 py-20"
      style={{ background: "linear-gradient(135deg,#061525 0%,#0d2035 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-px bg-accent/10 rounded-2xl overflow-hidden">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : statsData.map((d, i) => (
              <div
                key={d.id ?? d.label}
                className="reveal text-center py-10 px-4 bg-[#061525] relative transition-all hover:bg-accent/[0.05] group"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gradient-to-r from-accent2 to-accent w-0 group-hover:w-3/5 transition-all duration-300" />
                <div className="text-2xl text-accent/60 mb-3">
                  <i className={`fas ${d.icon}`} />
                </div>
                <div
                  className="font-head text-3xl font-bold leading-none"
                  style={{ background: "linear-gradient(135deg,#fff,#00b4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  <Counter target={d.value} started={started} />{d.suffix}
                </div>
                <div className="text-muted text-xs mt-2 leading-snug">{d.label}</div>
              </div>
            ))}
      </div>
    </div>
  );
}
