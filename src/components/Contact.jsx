"use client";
import { useRef, useState, useEffect } from "react";

const info = [
  { icon:"fa-map-marker-alt", title:"Office Address",  body:"709, S. No. 33/2, Sukhwani Fairview, Near Aditya Birla Hospital, Thergaon, Chinchwad, Pune – 411033" },
  { icon:"fa-phone",          title:"Phone Number",    body:"+91 99601 94497", href:"tel:+919960194497" },
  { icon:"fa-envelope",       title:"Email Address",   body:"sales@comeetindia.com", href:"mailto:sales@comeetindia.com" },
  { icon:"fa-clock",          title:"Business Hours",  body:"Monday – Saturday: 9:00 AM – 6:00 PM IST" },
];

export default function Contact() {
  const ref = useRef(null);
  const [form, setForm]       = useState({ name:"", email:"", phone:"", service:"", message:"" });
  const [status, setStatus]   = useState("idle"); // idle | sending | success | error
  const [errMsg, setErrMsg]   = useState("");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal-left,.reveal-right").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const res  = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setForm({ name:"", email:"", phone:"", service:"", message:"" });
      } else {
        setStatus("error");
        setErrMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrMsg("Network error. Please try again.");
    }
  };

  const inputCls = "w-full bg-surface border border-accent/15 rounded-xl px-5 py-3.5 font-body text-sm text-ctext outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,180,255,0.12)] placeholder:text-muted/50";

  return (
    <section id="contact" className="py-24 bg-bg2" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Info */}
        <div className="reveal-left">
          <div className="flex items-center gap-2.5 text-accent text-xs font-semibold uppercase tracking-[3px] mb-4">
            <div className="w-8 h-0.5 bg-accent rounded" /> Get In Touch
          </div>
          <h2 className="font-head text-4xl font-bold mb-5">Let&apos;s Build Something <span className="gradient-text">Great</span></h2>
          <p className="text-muted text-base leading-relaxed mb-9">
            Ready to automate your processes? Our experts are here to consult, design, and deliver the perfect solution.
          </p>
          <div className="flex flex-col gap-5">
            {info.map((c) => (
              <div key={c.title} className="flex items-start gap-4 p-6 rounded-xl bg-surface border border-accent/15 contact-hover">
                <div className="flex-shrink-0 w-12 h-12 rounded-[14px] bg-gradient-to-br from-accent2 to-accent flex items-center justify-center text-white text-lg">
                  <i className={`fas ${c.icon}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{c.title}</h4>
                  {c.href ? (
                    <a href={c.href} className="text-accent text-sm hover:underline">{c.body}</a>
                  ) : (
                    <p className="text-muted text-sm">{c.body}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="reveal-right">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-12 bg-surface border border-[#00c864]/30 rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-[#00c864]/15 flex items-center justify-center text-3xl text-[#00c864] mb-6">
                <i className="fas fa-circle-check" />
              </div>
              <h3 className="font-head font-bold text-xl mb-3">Message Sent!</h3>
              <p className="text-muted text-sm">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
              <button onClick={() => setStatus("idle")} className="mt-8 text-accent text-sm font-semibold hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@company.com" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Phone Number</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className={inputCls} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-muted">Service Required</label>
                  <select name="service" value={form.service} onChange={handleChange} className={inputCls} style={{backgroundImage:"none"}}>
                    <option value="">Select a Service</option>
                    <option>PLC / HMI Programming</option>
                    <option>SCADA Development</option>
                    <option>Special Purpose Machines</option>
                    <option>Electrical Control Panels</option>
                    <option>Troubleshooting / AMC</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Tell us about your project requirements..." className={inputCls} style={{resize:"none"}} />
              </div>
              {status === "error" && (
                <p className="text-[#ff3c78] text-sm bg-[#ff3c78]/10 border border-[#ff3c78]/20 rounded-xl px-4 py-3">{errMsg}</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-accent2 to-accent text-white font-semibold text-base py-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,102,255,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <><i className="fas fa-spinner fa-spin" /> Sending...</>
                ) : (
                  <><i className="fas fa-paper-plane" /> Send Message</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
