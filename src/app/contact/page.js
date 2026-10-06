"use client";
import { useState } from "react";

const infoCards = [
  {
    icon: "fa-location-dot",
    title: "Registered Office & Works",
    body: "Shop No. 34, Mahasainik Industrial Estate Rd, Opp. Philips Company, T Block, MIDC, Bhosari, Pimpri-Chinchwad, Maharashtra – 411026",
    actionText: "View on Google Maps",
    href: "https://maps.google.com/?q=Mahasainik+Industrial+Estate+T+Block+MIDC+Bhosari+Pune+411026",
  },
  {
    icon: "fa-phone",
    title: "Direct Phone & WhatsApp",
    body: "+91 99601 94497",
    actionText: "Call Sales / Engineering",
    href: "tel:+919960194497",
  },
  {
    icon: "fa-envelope",
    title: "Email Inquiries",
    body: "sales@comeetindia.com",
    actionText: "Send Email Directly",
    href: "mailto:sales@comeetindia.com",
  },
  {
    icon: "fa-clock",
    title: "Working Hours",
    body: "Monday – Saturday: 9:00 AM – 6:00 PM IST",
    subtext: "24/7 Emergency breakdown assistance available for AMC clients",
  },
];

const faqs = [
  {
    q: "What is your typical turnaround time for a custom SPM?",
    a: "Standard turnkey Special Purpose Machines typically take between 4 to 10 weeks depending on mechanical complexity, component lead times, and client FAT approval cycles.",
  },
  {
    q: "Do you provide on-site installation and commissioning outside Pune?",
    a: "Yes. We have commissioned machines and control panels across Maharashtra, Gujarat, Tamil Nadu, Karnataka, and northern industrial belts, as well as overseas installations.",
  },
  {
    q: "Can you retrofit and upgrade our existing legacy machines?",
    a: "Absolutely. We specialize in upgrading obsolete controllers (e.g., legacy Siemens S5 or older Omron PLCs) to modern Siemens S7-1500 or Rockwell CompactLogix with new touch HMIs and safety interlocks.",
  },
  {
    q: "Do you supply raw components or only complete turnkey systems?",
    a: "We provide both. We engineer full turnkey automation systems as well as supply certified industrial components (PLCs, VFDs, servos, power supplies, laser-cut panels) at competitive rates.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
    company_fax: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errMsg, setErrMsg] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
      } else {
        setStatus("error");
        setErrMsg(data.error || "Failed to send your message. Please call us directly.");
      }
    } catch {
      setStatus("error");
      setErrMsg("Network error. Please try again or call us at +91 99601 94497.");
    }
  };

  const inputCls =
    "w-full bg-surface border border-accent/20 rounded-xl px-4 py-3.5 font-body text-sm text-ctext outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,180,255,0.15)] placeholder:text-muted/50";

  return (
    <div className="pt-8 pb-24">
      {/* Header Banner */}
      <section className="relative py-20 overflow-hidden border-b border-accent/10" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%,rgba(0,102,255,0.15),transparent 70%),#020c18" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-4 bg-accent/10 border border-accent/25 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent dot-pulse" />
            Pune Headquarters · Maharashtra
          </div>
          <h1 className="font-head text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Get In Touch With <br />
            <span className="gradient-text">Our Engineering Team</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl leading-relaxed">
            Whether you have a specific machine requirement, need an electrical panel quote, or require emergency on-site
            automation support, our engineers in Chinchwad, Pune are ready to assist.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            {infoCards.map((c) => (
              <div
                key={c.title}
                className="bg-surface border border-accent/15 rounded-2xl p-6 card-hover flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-lg flex-shrink-0">
                    <i className={`fas ${c.icon}`} />
                  </div>
                  <div>
                    <h3 className="font-head font-bold text-base text-ctext mb-1">{c.title}</h3>
                    <p className="text-muted text-xs leading-relaxed mb-2">{c.body}</p>
                    {c.subtext && <p className="text-accent text-[11px] font-medium">{c.subtext}</p>}
                    {c.href && (
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : "_self"}
                        rel="noreferrer"
                        className="text-accent text-xs font-semibold inline-flex items-center gap-1.5 hover:underline mt-1"
                      >
                        {c.actionText} <i className="fas fa-arrow-up-right-from-square text-[10px]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="bg-surface border border-accent/15 rounded-2xl p-6 mt-8">
            <h3 className="font-head font-bold text-lg text-ctext mb-4 flex items-center gap-2">
              <i className="fas fa-circle-question text-accent" /> Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={faq.q} className="border-b border-accent/10 pb-3">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-3 text-xs font-semibold text-ctext py-2 hover:text-accent transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <i className={`fas fa-chevron-down text-[10px] transition-transform ${openFaq === idx ? "rotate-180 text-accent" : "text-muted"}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="text-muted text-xs leading-relaxed pt-1 pb-2">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-surface border border-accent/20 rounded-3xl p-8 md:p-10 shadow-2xl relative">
            <div className="mb-8">
              <h2 className="font-head text-2xl md:text-3xl font-bold text-ctext mb-2">
                Request a Proposal or Callback
              </h2>
              <p className="text-muted text-xs">
                Fill in the details below. Our technical sales team will review your requirements and respond within 24 hours.
              </p>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#00c864]/15 border border-[#00c864]/30 flex items-center justify-center text-3xl text-[#00c864] mb-6 animate-bounce">
                  <i className="fas fa-check" />
                </div>
                <h3 className="font-head font-bold text-2xl text-ctext mb-3">
                  Inquiry Received!
                </h3>
                <p className="text-muted text-sm max-w-md mb-8">
                  Thank you for contacting Comeet Controls Pvt. Ltd. Our senior engineer will review your project parameters and get in touch with you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="bg-accent/10 border border-accent/30 text-accent font-semibold text-xs px-6 py-3 rounded-full hover:bg-accent/20 transition-all cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot Bot Trap: Hidden from humans, filled by spam bots */}
                <div style={{ display: "none" }} aria-hidden="true">
                  <label htmlFor="company_fax">Leave this blank</label>
                  <input
                    id="company_fax"
                    type="text"
                    name="company_fax"
                    value={form.company_fax || ""}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2">
                      Full Name <span className="text-accent">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Rajesh Sharma"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2">
                      Work Email <span className="text-accent">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="rajesh@company.com"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2">
                      Phone / Mobile Number <span className="text-accent">*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-2">
                      Service of Interest
                    </label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      <option value="">Select a Category</option>
                      <option value="Special Purpose Machines (SPMs)">Special Purpose Machines (SPMs)</option>
                      <option value="PLC & HMI Programming">PLC &amp; HMI Programming</option>
                      <option value="SCADA & IIoT Development">SCADA &amp; IIoT Development</option>
                      <option value="Electrical Control Panels">Electrical Control Panels</option>
                      <option value="Troubleshooting & AMC">Troubleshooting &amp; AMC</option>
                      <option value="Laser Cutting & Components">Laser Cutting &amp; Components</option>
                      <option value="Other / General Consultation">Other / General Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-2">
                    Estimated Project Timeline / Urgency
                  </label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="">Select Timeline</option>
                    <option value="Immediate Emergency Breakdown">Immediate Emergency Breakdown (&lt; 24 hrs)</option>
                    <option value="Within 1 Month">Within 1 Month (Fast-Track)</option>
                    <option value="1 to 3 Months">1 to 3 Months (Standard Project)</option>
                    <option value="Budgetary / Future Planning">Budgetary / Future Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted mb-2">
                    Project Requirements / Machine Details <span className="text-accent">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Describe your part geometry, required cycle time, preferred PLC brand, or panel specifications..."
                    className={inputCls}
                    style={{ resize: "none" }}
                  />
                </div>

                {status === "error" && (
                  <div className="p-4 rounded-xl bg-[#ff3c78]/10 border border-[#ff3c78]/25 text-[#ff3c78] text-xs">
                    {errMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent2 to-accent text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-accent/25 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "sending" ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-sm" /> Sending Inquiry...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane text-sm" /> Submit Technical Inquiry
                    </>
                  )}
                </button>
                <p className="text-[11px] text-muted text-center">
                  We respect your confidentiality. NDA signed upon request prior to technical drawing review.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Google Maps Embed — Comeet Controls, Bhosari MIDC Pune */}
      <section className="pb-24 max-w-6xl mx-auto px-6">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-2">
            <span className="w-6 h-0.5 bg-accent rounded" /> Find Us
          </div>
          <h2 className="font-head text-2xl font-bold">
            Our Pune <span className="gradient-text">Facility</span>
          </h2>
          <p className="text-muted text-sm mt-1">
            Shop No. 34, Mahasainik Industrial Estate Rd, Opp. Philips Company, T Block, MIDC, Bhosari, Pimpri-Chinchwad – 411026
          </p>
        </div>
        <div className="relative rounded-3xl overflow-hidden border border-accent/15 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          {/* Dark overlay strip at bottom for brand cohesion */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg/80 to-transparent z-10 pointer-events-none" />
          <iframe
            title="Comeet Controls Pvt. Ltd. — Pune Location"
            src="https://maps.google.com/maps?q=Mahasainik%20Industrial%20Estate%20T%20Block%20MIDC%20Bhosari%20Pune&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[420px] border-0 block"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 justify-end">
          <a
            href="https://maps.google.com/?q=Mahasainik+Industrial+Estate+T+Block+MIDC+Bhosari+Pune+411026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent text-xs font-semibold border border-accent/25 bg-accent/5 hover:bg-accent/15 px-4 py-2 rounded-full transition-all"
          >
            <i className="fas fa-map-location-dot" /> Open in Google Maps
          </a>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Mahasainik+Industrial+Estate+T+Block+MIDC+Bhosari+Pune"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#25d366] text-xs font-semibold border border-[#25d366]/25 bg-[#25d366]/5 hover:bg-[#25d366]/15 px-4 py-2 rounded-full transition-all"
          >
            <i className="fas fa-diamond-turn-right" /> Get Directions
          </a>
        </div>
      </section>
    </div>
  );
}