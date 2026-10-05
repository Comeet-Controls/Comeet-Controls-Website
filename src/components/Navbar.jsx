"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/",         label: "Home"     },
  { href: "/about",    label: "About"    },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/quality",  label: "Quality"  },
  { href: "/contact",  label: "Contact"  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg/95 backdrop-blur-xl py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-b border-accent/15"
            : "bg-bg/60 backdrop-blur-md py-5 border-b border-accent/10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Comeet Controls Logo"
              width={44}
              height={44}
              className="rounded-lg transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="flex flex-col">
              <span
                className="font-head font-bold text-xl tracking-tight transition-transform duration-300 group-hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(90deg,#ffffff,#00b4ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Comeet Controls
              </span>
              <span className="text-[0.65rem] text-muted uppercase tracking-widest mt-0.5">
                Industrial Automation · Pvt. Ltd.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-7">
            {links.map((l) => {
              const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`relative text-sm font-medium py-1 px-2.5 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-accent bg-accent/10 font-semibold shadow-[0_0_12px_rgba(0,180,255,0.15)] border border-accent/20"
                        : "text-muted hover:text-ctext hover:bg-surface/50"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href="tel:+919960194497"
                className="flex items-center gap-2 bg-gradient-to-r from-accent2 to-accent text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,102,255,0.45)]"
              >
                <i className="fas fa-phone text-xs" /> Call Now
              </a>
            </li>
          </ul>

          {/* Mobile Hamburger Toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border border-accent/20 rounded-lg cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-ctext rounded transition-all duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-ctext rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-ctext rounded transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-bg/98 backdrop-blur-2xl transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {links.map((l) => {
          const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => {
                setMenuOpen(false);
                document.body.style.overflow = "";
              }}
              className={`font-head font-bold text-3xl transition-all ${
                isActive ? "text-accent scale-105" : "text-ctext hover:text-accent"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
        <div className="mt-4 flex flex-col items-center gap-3">
          <a
            href="tel:+919960194497"
            className="flex items-center gap-2 bg-gradient-to-r from-accent2 to-accent text-white text-base font-semibold px-7 py-3 rounded-full shadow-[0_8px_30px_rgba(0,102,255,0.4)]"
          >
            <i className="fas fa-phone text-sm" /> +91 99601 94497
          </a>
          <span className="text-muted text-xs">Mon – Sat · 9:00 AM – 6:00 PM IST</span>
        </div>
      </div>
    </>
  );
}