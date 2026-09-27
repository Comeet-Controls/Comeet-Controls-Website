"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../AdminShell";

const EMPTY = {
  num: "",
  icon: "fa-gears",
  cls: "bg-accent/15 text-accent",
  title: "",
  description: "",
  sort_order: 0,
  tagline: "",
  capabilities: [],
};

// ---------------------------------------------------------------------------
// Icon Picker
// ---------------------------------------------------------------------------
const ICON_LIST = [
  "fa-gears","fa-microchip","fa-display","fa-bolt","fa-wrench","fa-layer-group",
  "fa-gear","fa-rotate","fa-industry","fa-file","fa-oil-can","fa-wave-square",
  "fa-chart-bar","fa-diagram-project","fa-users","fa-calendar-check",
  "fa-boxes-stacked","fa-clock-rotate-left","fa-circle-check","fa-headset",
  "fa-face-smile","fa-certificate","fa-shield-halved","fa-robot","fa-server",
  "fa-database","fa-network-wired","fa-plug","fa-power-off","fa-sliders",
  "fa-gauge","fa-stopwatch","fa-tools","fa-screwdriver-wrench","fa-hammer",
  "fa-sitemap","fa-check-circle","fa-exclamation-triangle","fa-info-circle",
  "fa-star","fa-award","fa-medal","fa-trophy","fa-fire","fa-building",
  "fa-factory","fa-cog","fa-chart-line","fa-flask","fa-microscope","fa-vials",
  "fa-radiation","fa-atom",
];

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = search
    ? ICON_LIST.filter((ic) => ic.includes(search.toLowerCase()))
    : ICON_LIST;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6b8ca8" }}>
        FontAwesome Icon
      </label>
      {/* Preview / trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all text-left"
        style={{
          background: "#020c18",
          border: open ? "1px solid #00b4ff" : "1px solid rgba(0,180,255,0.15)",
          color: "#e2eaf4",
        }}
      >
        <i className={`fas ${value} text-base`} style={{ color: "#00b4ff", width: 20, textAlign: "center" }} />
        <span className="font-mono text-xs" style={{ color: "#6b8ca8" }}>{value}</span>
        <i className={`fas fa-chevron-${open ? "up" : "down"} ml-auto text-xs`} style={{ color: "#6b8ca8" }} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 200,
            background: "#0b1e34",
            border: "1px solid rgba(0,180,255,0.25)",
            borderRadius: 14,
            padding: 12,
            boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search icons…"
            autoFocus
            className="w-full px-3 py-2 rounded-lg text-xs outline-none mb-3"
            style={{
              background: "#020c18",
              border: "1px solid rgba(0,180,255,0.2)",
              color: "#e2eaf4",
            }}
          />
          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 6,
              maxHeight: 224,
              overflowY: "auto",
            }}
          >
            {filtered.map((ic) => (
              <button
                key={ic}
                type="button"
                title={ic}
                onClick={() => { onChange(ic); setOpen(false); setSearch(""); }}
                style={{
                  background: ic === value ? "rgba(0,180,255,0.2)" : "rgba(0,180,255,0.05)",
                  border: ic === value ? "1px solid rgba(0,180,255,0.5)" : "1px solid rgba(0,180,255,0.1)",
                  borderRadius: 8,
                  padding: "8px 4px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,180,255,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ic === value ? "rgba(0,180,255,0.2)" : "rgba(0,180,255,0.05)"; }}
              >
                <i className={`fas ${ic}`} style={{ color: "#00b4ff", fontSize: 16 }} />
                <span style={{ color: "#6b8ca8", fontSize: 8, wordBreak: "break-all", textAlign: "center", lineHeight: 1.2 }}>
                  {ic.replace("fa-", "")}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#6b8ca8", fontSize: 12, padding: "12px 0" }}>
                No icons found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Generic field helper
// ---------------------------------------------------------------------------
function Field({ label, value, onChange, placeholder, type = "text", required, multiline }) {
  const base = { background: "#020c18", border: "1px solid rgba(0,180,255,0.15)", color: "#e2eaf4" };
  const cls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6b8ca8" }}>{label}{required && " *"}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} rows={3}
          className={cls} style={{ ...base, resize: "vertical" }}
          onFocus={(e) => (e.target.style.borderColor = "#00b4ff")} onBlur={(e) => (e.target.style.borderColor = "rgba(0,180,255,0.15)")} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
          className={cls} style={base}
          onFocus={(e) => (e.target.style.borderColor = "#00b4ff")} onBlur={(e) => (e.target.style.borderColor = "rgba(0,180,255,0.15)")} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Service Form
// ---------------------------------------------------------------------------
function ServiceForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function addCapability() { set("capabilities", [...(form.capabilities || []), ""]); }
  function updateCapability(i, v) {
    const arr = [...(form.capabilities || [])];
    arr[i] = v;
    set("capabilities", arr);
  }
  function removeCapability(i) {
    const arr = [...(form.capabilities || [])];
    arr.splice(i, 1);
    set("capabilities", arr);
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-2xl p-6 border space-y-4" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.25)" }}>
      <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{initial ? "Edit Service" : "Add New Service"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Number (e.g. 01)" value={form.num} onChange={(v) => set("num", v)} placeholder="01" />
        <IconPicker value={form.icon} onChange={(v) => set("icon", v)} />
        <Field label="Title" value={form.title} onChange={(v) => set("title", v)} placeholder="Special Purpose Machines" required />
        <Field label="Sort Order" value={form.sort_order} onChange={(v) => set("sort_order", parseInt(v) || 0)} type="number" />
        <div className="sm:col-span-2">
          <Field label="Tailwind Color Classes (cls)" value={form.cls} onChange={(v) => set("cls", v)} placeholder="bg-accent/15 text-accent" />
          <p className="text-[10px] mt-1" style={{ color: "#6b8ca8" }}>e.g. bg-accent/15 text-accent  |  bg-[#9650ff]/15 text-[#9650ff]  |  bg-yellow-400/15 text-yellow-400</p>
        </div>
        <div className="sm:col-span-2">
          <Field label="Description" value={form.description} onChange={(v) => set("description", v)} placeholder="Service description…" multiline required />
        </div>
        <div className="sm:col-span-2">
          <Field label="Blue Tagline (accent line shown on /services page)" value={form.tagline} onChange={(v) => set("tagline", v)} placeholder="Short punchy tagline…" />
        </div>
        {/* Capabilities dynamic list */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#6b8ca8" }}>
            Key Technical Scope (bullet points)
          </label>
          <div className="space-y-2">
            {(form.capabilities || []).map((cap, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={cap}
                  onChange={(e) => updateCapability(i, e.target.value)}
                  placeholder={`Capability ${i + 1}…`}
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: "#020c18", border: "1px solid rgba(0,180,255,0.15)", color: "#e2eaf4" }}
                  onFocus={(e) => (e.target.style.borderColor = "#00b4ff")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,180,255,0.15)")}
                />
                <button
                  type="button"
                  onClick={() => removeCapability(i)}
                  className="px-3 py-2 rounded-xl text-xs font-medium flex-shrink-0"
                  style={{ background: "rgba(255,60,120,0.1)", color: "#ff3c78", border: "1px solid rgba(255,60,120,0.2)" }}
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addCapability}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-medium"
            style={{ background: "rgba(0,180,255,0.08)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.2)" }}
          >
            <i className="fas fa-plus text-[10px] mr-1.5" />Add Capability
          </button>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: "linear-gradient(to right,#0046cc,#00b4ff)" }}>
          {saving ? <i className="fas fa-circle-notch fa-spin" /> : (initial ? "Save Changes" : "Add Service")}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(107,140,168,0.1)", color: "#6b8ca8" }}>Cancel</button>}
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ServicesManagerPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    if (res.status === 401) { router.replace("/admin"); return; }
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 3000); }

  async function handleAdd(form) {
    setSaving(true);
    await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setShowAdd(false); flash("Service added!"); load();
  }
  async function handleEdit(form) {
    setSaving(true);
    await fetch("/api/admin/services", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
    setSaving(false); setEditing(null); flash("Service updated!"); load();
  }
  async function handleDelete(id) {
    if (!confirm("Delete this service?")) return;
    setDeleting(id);
    await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    setDeleting(null); flash("Service deleted."); load();
  }

  return (
    <AdminShell title="Services Manager">
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "#6b8ca8" }}>Manage the 6 core services shown on the homepage services section.</p>
          {!showAdd && (
            <button onClick={() => { setShowAdd(true); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(to right,#0046cc,#00b4ff)" }}>
              <i className="fas fa-plus text-xs mr-2" /> Add Service
            </button>
          )}
        </div>

        {msg && <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.2)" }}><i className="fas fa-check-circle mr-2" />{msg}</div>}
        {showAdd && <ServiceForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />}
        {editing && <ServiceForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} saving={saving} />}

        <div className="rounded-2xl border overflow-hidden" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)" }}>
          {loading ? (
            <div className="p-12 text-center text-sm" style={{ color: "#6b8ca8" }}><i className="fas fa-circle-notch fa-spin mr-2" /> Loading…</div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center text-sm" style={{ color: "#6b8ca8" }}>No services yet. Add one above.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(0,180,255,0.05)", borderBottom: "1px solid rgba(0,180,255,0.12)" }}>
                  {["#", "Icon", "Title", "Order", "Actions"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b8ca8" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid rgba(0,180,255,0.08)" }}>
                    <td className="py-3 px-4 font-mono text-xs" style={{ color: "#00b4ff" }}>{s.num}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <i className={`fas ${s.icon} text-sm`} style={{ color: "#00b4ff" }} />
                        <span className="text-xs font-mono" style={{ color: "#6b8ca8" }}>{s.icon}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{s.title}</td>
                    <td className="py-3 px-4 text-xs" style={{ color: "#6b8ca8" }}>{s.sort_order}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditing(s); setShowAdd(false); }} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.2)" }}>
                          <i className="fas fa-pen text-[10px] mr-1" /> Edit
                        </button>
                        <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id} className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: "rgba(255,60,120,0.1)", color: "#ff3c78", border: "1px solid rgba(255,60,120,0.2)" }}>
                          {deleting === s.id ? <i className="fas fa-circle-notch fa-spin text-[10px]" /> : <><i className="fas fa-trash text-[10px] mr-1" /> Delete</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
