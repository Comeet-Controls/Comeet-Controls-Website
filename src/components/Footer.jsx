"use client";
import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/",         label: "Home"              },
  { href: "/about",    label: "About Us"          },
  { href: "/services", label: "Our Services"      },
  { href: "/projects", label: "Featured Projects" },
  { href: "/quality",  label: "Quality Assurance" },
  { href: "/contact",  label: "Contact & Support" },
];

const servicesList = [
  "Special Purpose Machines (SPMs)",
  "PLC & HMI Programming",
  "SCADA & IIoT Development",
  "Electrical Control Panels",
  "Troubleshooting & Retrofit AMC",
  "Laser Cutting & Components",
];

export default function Footer() {
  return (
    <footer className="bg-[#010c18] border-t border-accent/15 pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Comeet Controls Logo"
                width={140}
                height={140}
                className="rounded-lg"
              />
              <span
                className="font-head text-2xl font-bold"
                style={{
                  background: "linear-gradient(90deg,#ffffff,#00b4ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Comeet Controls Pvt. Ltd.
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6 max-w-md">
              Your trusted partner for industrial automation — designing, manufacturing, programming, and commissioning
              turnkey automation systems, SPMs, and electrical panels for national and international clients.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: "fa-envelope", href: "mailto:sales@comeetindia.com", label: "Email" },
                { icon: "fa-phone",    href: "tel:+919960194497",           label: "Phone" },
                { icon: "fa-location-dot", href: "/contact",               label: "Location" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-10 h-10 rounded-xl bg-surface border border-accent/15 flex items-center justify-center text-muted text-sm transition-all duration-300 hover:bg-accent2 hover:text-white hover:border-accent2 hover:-translate-y-0.5"
                  title={s.label}
                >
                  <i className={`fas ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-head font-semibold text-sm uppercase tracking-widest text-ctext mb-5">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted text-sm hover:text-accent hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-head font-semibold text-sm uppercase tracking-widest text-ctext mb-5">
              Our Capabilities
            </h4>
            <ul className="flex flex-col gap-3">
              {servicesList.map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-muted text-sm hover:text-accent hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-accent/15 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} <strong className="text-ctext">Comeet Controls Pvt. Ltd.</strong> (formerly CES). All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted">
            <span>Shop No. 34, MIDC Bhosari, T Block, Pimpri-Chinchwad, Pune 411026</span>
            <span className="hidden md:inline-block">·</span>
            <span className="text-accent font-medium">Industry 4.0 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}