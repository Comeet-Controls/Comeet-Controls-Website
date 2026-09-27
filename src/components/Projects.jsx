"use client";
import { useEffect, useRef, useState } from "react";

function CaseStudyDrawer({ project, onClose }) {
  // Close on ESC key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const [open, setOpen] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOpen(true), 10); return () => clearTimeout(t); }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 380);
  };

  // Ensure specs is always an array
  const specs = Array.isArray(project.specs) ? project.specs : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`modal-backdrop ${open ? "open" : ""}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`modal-drawer ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Case Study: ${project.title}`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-accent/15 sticky top-0 bg-[#0b1e34] z-10">
          <span className="bg-accent/10 border border-accent/25 text-accent text-[0.7rem] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {project.tag}
          </span>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-surface border border-accent/20 flex items-center justify-center text-muted hover:text-ctext hover:border-accent/40 transition-all cursor-pointer"
            aria-label="Close case study"
          >
            <i className="fas fa-xmark text-sm" />
          </button>
        </div>

        {/* Hero icon panel */}
        <div
          className="relative h-52 flex items-center justify-center overflow-hidden"
          style={{ background: project.bg || "linear-gradient(135deg,#061525,#0d2035)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent2/15 to-accent/8" />
          <i className={`fas ${project.icon} text-8xl text-accent/15`} />
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-8">
          <div>
            <h2 className="font-head text-2xl font-bold text-ctext mb-3">{project.title}</h2>
            <p className="text-muted text-sm leading-relaxed">{project.full_desc || project.fullDesc}</p>
          </div>

          {/* Technical Specs Table */}
          {specs.length > 0 && (
            <div>
              <h3 className="font-head font-semibold text-sm text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="fas fa-microchip text-xs" /> Technical Specifications
              </h3>
              <div className="bg-bg border border-accent/10 rounded-2xl overflow-hidden">
                {specs.map((sp, i) => (
                  <div
                    key={sp.label + i}
                    className={`flex items-center gap-4 px-5 py-3.5 text-sm ${
                      i !== specs.length - 1 ? "border-b border-accent/10" : ""
                    }`}
                  >
                    <span className="text-muted w-36 flex-shrink-0 text-xs font-medium">{sp.label}</span>
                    <span className="text-ctext font-medium">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="border-t border-accent/10 pt-6">
            <p className="text-muted text-xs mb-4">
              Interested in a similar solution for your plant? Our engineering team will scope and quote within 24 hours.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent2 to-accent text-white text-sm font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,102,255,0.4)] transition-all"
              onClick={handleClose}
            >
              <i className="fas fa-paper-plane text-xs" /> Request a Similar Machine
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="bg-surface border border-accent/15 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-accent/5" />
      <div className="p-7 space-y-3">
        <div className="h-4 w-20 bg-accent/10 rounded" />
        <div className="h-5 w-40 bg-accent/10 rounded" />
        <div className="h-3 w-full bg-accent/5 rounded" />
        <div className="h-3 w-3/4 bg-accent/5 rounded" />
      </div>
    </div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const [activeProject, setActiveProject] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from public API
  useEffect(() => {
    fetch("/api/data/projects")
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
    <>
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
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
              : data.map((p, i) => (
                  <div
                    key={p.id ?? p.title}
                    className="reveal bg-surface border border-accent/15 rounded-2xl overflow-hidden card-hover-light group flex flex-col"
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
                    <div className="p-7 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-head font-semibold text-lg mb-2.5">{p.title}</h3>
                        <p className="text-muted text-sm leading-relaxed">{p.short_desc || p.desc}</p>
                      </div>
                      <button
                        onClick={() => setActiveProject(p)}
                        className="mt-6 inline-flex items-center gap-1.5 text-accent text-xs font-semibold hover:gap-3 transition-all cursor-pointer group/btn"
                      >
                        View Case Study <i className="fas fa-arrow-right text-[10px] transition-all group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Case Study Modal Drawer */}
      {activeProject && (
        <CaseStudyDrawer project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </>
  );
}
