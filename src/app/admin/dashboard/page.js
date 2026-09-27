"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SECTIONS = [
  { key: "stats",          label: "Stats",          icon: "fa-chart-bar",          href: "/admin/stats",          desc: "Counter numbers shown on the website" },
  { key: "projects",       label: "Projects",       icon: "fa-diagram-project",    href: "/admin/projects",       desc: "Featured projects & case studies" },
  { key: "services",       label: "Services",       icon: "fa-gears",              href: "/admin/services",       desc: "Services offered by the company" },
  { key: "journey",        label: "Journey",        icon: "fa-timeline",           href: "/admin/journey",        desc: "Company milestones & history" },
  { key: "certifications", label: "Certifications", icon: "fa-certificate",        href: "/admin/certifications", desc: "Standards & certifications on Quality page" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [counts, setCounts] = useState({});
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Fetch counts for each section
    SECTIONS.forEach(async ({ key }) => {
      try {
        const res = await fetch(`/api/admin/${key}`);
        if (res.status === 401) {
          router.replace("/admin");
          return;
        }
        const data = await res.json();
        setCounts((prev) => ({ ...prev, [key]: Array.isArray(data) ? data.length : 0 }));
      } catch {
        setCounts((prev) => ({ ...prev, [key]: "—" }));
      }
    });
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
  }

  return (
    <div className="min-h-screen" style={{ background: "#020c18" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#0046cc,#00b4ff)" }}
          >
            <i className="fas fa-microchip text-white text-xs" />
          </div>
          <span className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Comeet Controls <span style={{ color: "#6b8ca8" }}>/ Admin</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          style={{ background: "rgba(255,60,120,0.1)", border: "1px solid rgba(255,60,120,0.25)", color: "#ff3c78" }}
        >
          <i className="fas fa-right-from-bracket text-xs" />
          {loggingOut ? "Logging out…" : "Logout"}
        </button>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#00b4ff" }}>
            Dashboard
          </div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Welcome back, <span style={{ color: "#00b4ff" }}>Comeet Controls</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: "#6b8ca8" }}>
            Manage all website content from here. Changes go live within 60 seconds.
          </p>
        </div>

        {/* Section cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTIONS.map((s) => (
            <Link
              key={s.key}
              href={s.href}
              className="group block rounded-2xl p-6 border transition-all hover:scale-[1.02]"
              style={{
                background: "#0b1e34",
                borderColor: "rgba(0,180,255,0.15)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,180,255,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,180,255,0.15)")}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff" }}
                >
                  <i className={`fas ${s.icon}`} />
                </div>
                <span
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#00b4ff" }}
                >
                  {counts[s.key] ?? <i className="fas fa-circle-notch fa-spin text-base" />}
                </span>
              </div>
              <h2 className="font-semibold text-base mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {s.label}
              </h2>
              <p className="text-xs mb-4" style={{ color: "#6b8ca8" }}>
                {s.desc}
              </p>
              <div
                className="text-xs font-semibold flex items-center gap-1.5 transition-all group-hover:gap-2.5"
                style={{ color: "#00b4ff" }}
              >
                Manage <i className="fas fa-arrow-right text-[10px]" />
              </div>
            </Link>
          ))}
        </div>

        {/* Info strip */}
        <div
          className="mt-10 rounded-2xl px-6 py-4 flex items-center gap-4 text-sm border"
          style={{ background: "rgba(0,180,255,0.05)", borderColor: "rgba(0,180,255,0.15)", color: "#6b8ca8" }}
        >
          <i className="fas fa-circle-info text-[#00b4ff]" />
          <span>
            All changes update the live website within <strong style={{ color: "#e2eaf4" }}>60 seconds</strong> via Vercel&apos;s incremental static regeneration.
          </span>
        </div>
      </main>
    </div>
  );
}
