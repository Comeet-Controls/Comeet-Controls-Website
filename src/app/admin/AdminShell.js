"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { label: "Dashboard",       href: "/admin/dashboard",       icon: "fa-house" },
  { label: "Stats",           href: "/admin/stats",           icon: "fa-chart-bar" },
  { label: "Projects",        href: "/admin/projects",        icon: "fa-diagram-project" },
  { label: "Services",        href: "/admin/services",        icon: "fa-gears" },
  { label: "Journey",         href: "/admin/journey",         icon: "fa-timeline" },
  { label: "Certifications",  href: "/admin/certifications",  icon: "fa-certificate" },
];

export default function AdminShell({ children, title }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#020c18", color: "#e2eaf4" }}>
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 flex flex-col border-r transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: "rgba(0,180,255,0.15)" }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0046cc,#00b4ff)" }}
          >
            <i className="fas fa-microchip text-white text-xs" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Comeet Controls
            </div>
            <div className="text-[10px]" style={{ color: "#6b8ca8" }}>Admin CMS</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/admin/dashboard" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? "rgba(0,180,255,0.12)" : "transparent",
                  color: active ? "#00b4ff" : "#6b8ca8",
                  borderLeft: active ? "2px solid #00b4ff" : "2px solid transparent",
                }}
              >
                <i className={`fas ${n.icon} w-4 text-center`} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(0,180,255,0.15)" }}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            style={{ color: "#ff3c78", background: "rgba(255,60,120,0.08)" }}
          >
            <i className="fas fa-right-from-bracket w-4 text-center" />
            {loggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 border-b"
          style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)" }}
        >
          <button
            className="lg:hidden text-sm"
            style={{ color: "#6b8ca8" }}
            onClick={() => setSidebarOpen(true)}
          >
            <i className="fas fa-bars" />
          </button>
          <h1 className="font-semibold text-base flex-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h1>
          <Link
            href="/admin/dashboard"
            className="text-xs flex items-center gap-1.5 transition-colors"
            style={{ color: "#6b8ca8" }}
          >
            <i className="fas fa-arrow-left text-[10px]" /> Dashboard
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
