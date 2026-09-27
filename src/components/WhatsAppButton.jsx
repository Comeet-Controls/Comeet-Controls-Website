"use client";
import { useState, useEffect } from "react";

const WA_NUMBER = "919960194497"; // WhatsApp Business number (country code + number, no +)
const WA_MESSAGE = encodeURIComponent(
  "Hello Comeet Controls,\n\nI'm interested in your industrial automation services. Could you please provide more details?"
);

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Show tooltip briefly on first appearance
    const t1 = setTimeout(() => {
      if (window.scrollY > 300) setShowTooltip(true);
    }, 500);
    const t2 = setTimeout(() => setShowTooltip(false), 4000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Show tooltip when button first becomes visible
  useEffect(() => {
    if (visible) {
      setShowTooltip(true);
      const t = setTimeout(() => setShowTooltip(false), 4000);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div
      className={`fixed bottom-8 left-6 z-50 flex items-center gap-3 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      aria-label="Chat on WhatsApp"
    >
      {/* Tooltip */}
      <div
        className={`bg-surface border border-[#25d366]/30 text-ctext text-xs font-medium px-4 py-2.5 rounded-2xl shadow-xl max-w-[180px] leading-snug transition-all duration-300 ${
          showTooltip ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
        }`}
      >
        <span className="text-[#25d366] font-semibold">Chat with us</span>
        <br />
        <span className="text-muted text-[10px]">Mon–Sat · 9 AM – 6 PM IST</span>
      </div>

      {/* Button */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Comeet Controls"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_8px_32px_rgba(37,211,102,0.45)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(37,211,102,0.6)] transition-all duration-300"
        style={{ background: "linear-gradient(135deg,#25d366,#128c7e)" }}
      >
        {/* Pulse ring */}
        <span
          className="wa-ping absolute inset-0 rounded-full"
          style={{ background: "rgba(37,211,102,0.35)" }}
        />
        <i className="fab fa-whatsapp text-white text-3xl relative z-10" />
      </a>
    </div>
  );
}
