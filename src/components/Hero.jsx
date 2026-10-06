"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FALLBACK_STATS = [
  { val: "75+",  label: "Happy Clients"      },
  { val: "50+",  label: "Projects Delivered" },
  { val: "100%", label: "FAT Clearance"      },
];

export default function Hero() {
  const canvasRef = useRef(null);
  const [showTop, setShowTop] = useState(false);
  const [heroStats, setHeroStats] = useState(FALLBACK_STATS);

  useEffect(() => {
    fetch("/api/data/stats")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.length >= 1) {
          setHeroStats(
            d.slice(0, 3).map((s) => ({ val: `${s.value}${s.suffix}`, label: s.label }))
          );
        }
      })
      .catch(() => {}); // keep fallback on error
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], animId;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class P {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.a  = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,180,255,${this.a})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < 120; i++) particles.push(new P());

    const connect = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,102,255,${0.08 * (1 - d / 100)})`;
            ctx.lineWidth   = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      connect();
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, []);

  const stats = [
    { val: "75+",  label: "Happy Clients"      },
    { val: "50+",  label: "Projects Delivered" },
    { val: "100%", label: "FAT Clearance"      },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,102,255,0.18) 0%,transparent 65%),#020c18" }}
    >
      <div className="hero-grid" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full flex items-center justify-between gap-12">
        <div className="flex-1 max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 bg-accent/10 border border-accent/25 rounded-full px-4 py-1.5 text-accent text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-accent dot-pulse" />
            Industrial Automation Partner · Pune, India
          </div>

          {/* Title */}
          <h1 className="font-head font-bold leading-[1.08] tracking-tight mb-7" style={{ fontSize: "clamp(2.6rem,5.5vw,4.8rem)" }}>
            Precision Automation<br />
            <span className="gradient-text-hero">Engineered for Industry</span>
          </h1>

          <p className="text-muted text-lg leading-relaxed max-w-xl mb-11">
            Comeet Controls Pvt. Ltd. delivers world-class automation solutions — from Special Purpose Machines (SPMs)
            and PLC Control Panels to SCADA and turnkey software integrations.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-accent2 to-accent text-white font-semibold text-base px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,102,255,0.45)]"
            >
              Explore Services <i className="fas fa-arrow-right text-sm" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-transparent text-accent font-semibold text-base px-8 py-3.5 rounded-full border border-accent/70 transition-all duration-300 hover:bg-accent/10 hover:-translate-y-0.5"
            >
              Get In Touch
            </Link>
          </div>
        </div>

        {/* Stat cards — hidden on mobile */}
        <div className="hidden lg:flex flex-col gap-4 flex-shrink-0 w-64">
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden bg-surface/85 border border-accent/15 rounded-xl px-7 py-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent2 to-accent" />
              <div className="font-head text-2xl font-bold text-accent leading-none">{s.val}</div>
              <div className="text-muted text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-accent2 to-accent text-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,102,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up" />
      </button>
    </section>
  );
}