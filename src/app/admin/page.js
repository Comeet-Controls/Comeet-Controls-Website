"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid password. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,102,255,0.12), transparent 70%), #020c18" }}
    >
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: "linear-gradient(135deg, #0046cc, #00b4ff)", boxShadow: "0 0 40px rgba(0,180,255,0.25)" }}
          >
            <i className="fas fa-microchip text-white text-2xl" />
          </div>
          <h1
            className="font-head text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Comeet Controls
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6b8ca8" }}>
            Admin Panel — Authorised Access Only
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)" }}
        >
          <h2
            className="text-lg font-semibold mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#6b8ca8" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#020c18",
                    border: "1px solid rgba(0,180,255,0.2)",
                    color: "#e2eaf4",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#00b4ff")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,180,255,0.2)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#6b8ca8" }}
                  tabIndex={-1}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ background: "rgba(255,60,120,0.1)", border: "1px solid rgba(255,60,120,0.25)", color: "#ff3c78" }}
              >
                <i className="fas fa-triangle-exclamation text-xs" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading ? "#1a3a5c" : "linear-gradient(to right, #0046cc, #00b4ff)",
                boxShadow: loading ? "none" : "0 8px 24px rgba(0,102,255,0.3)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-circle-notch fa-spin text-xs" /> Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-lock-open text-xs" /> Sign In
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#2d4a62" }}>
          This panel is restricted to authorised personnel only.
        </p>
      </div>
    </div>
  );
}
