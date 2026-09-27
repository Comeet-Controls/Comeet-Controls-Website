"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../AdminShell";

const EMPTY = { num: "", icon: "fa-gears", cls: "bg-accent/15 text-accent", title: "", description: "", sort_order: 0 };

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

function ServiceForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-2xl p-6 border space-y-4" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.25)" }}>
      <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{initial ? "Edit Service" : "Add New Service"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Number (e.g. 01)" value={form.num} onChange={(v) => set("num", v)} placeholder="01" />
        <Field label="FontAwesome Icon" value={form.icon} onChange={(v) => set("icon", v)} placeholder="fa-gears" />
        <Field label="Title" value={form.title} onChange={(v) => set("title", v)} placeholder="Special Purpose Machines" required />
        <Field label="Sort Order" value={form.sort_order} onChange={(v) => set("sort_order", parseInt(v) || 0)} type="number" />
        <div className="sm:col-span-2">
          <Field label="Tailwind Color Classes (cls)" value={form.cls} onChange={(v) => set("cls", v)} placeholder="bg-accent/15 text-accent" />
          <p className="text-[10px] mt-1" style={{ color: "#6b8ca8" }}>e.g. bg-accent/15 text-accent  |  bg-[#9650ff]/15 text-[#9650ff]  |  bg-yellow-400/15 text-yellow-400</p>
        </div>
        <div className="sm:col-span-2">
          <Field label="Description" value={form.description} onChange={(v) => set("description", v)} placeholder="Service description…" multiline required />
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
