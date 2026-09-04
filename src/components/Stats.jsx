"use client";
import { useEffect, useRef, useState } from "react";

const data = [
  { icon: "fa-users",           target: 10, label: "Expert Engineers"   },
  { icon: "fa-diagram-project", target: 50, label: "Projects Completed" },
  { icon: "fa-face-smile",      target: 75, label: "Happy Clients"      },
  { icon: "fa-calendar-check",  target: 12, label: "Years Experience"   },
];

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

export default function Stats() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [revealed, setRevealed] = useState([false,false,false,false]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="border-t border-b border-accent/15 py-20"
      style={{ background: "linear-gradient(135deg,#061525 0%,#0d2035 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4">
        {data.map((d, i) => (
          <div
            key={d.label}
            className={`reveal text-center py-12 px-6 relative transition-all hover:bg-accent/[0.04] group ${i < 3 ? "border-r-0 lg:border-r border-accent/15" : ""}`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-gradient-to-r from-accent2 to-accent w-0 group-hover:w-3/5 transition-all duration-300" />
            <div className="text-3xl text-accent/70 mb-4"><i className={`fas ${d.icon}`} /></div>
            <div className="font-head text-[3.5rem] font-bold leading-none" style={{ background:"linear-gradient(135deg,#fff,#00b4ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              <Counter target={d.target} started={started} />+
            </div>
            <div className="text-muted text-sm mt-2">{d.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
