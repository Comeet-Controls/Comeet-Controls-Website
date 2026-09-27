"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../AdminShell";

const EMPTY = { year: "", title: "", description: "", sort_order: 0 };

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

function JourneyForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-2xl p-6 border space-y-4" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.25)" }}>
      <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{initial ? "Edit Milestone" : "Add New Milestone"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Year (e.g. 2012 or Present)" value={form.year} onChange={(v) => set("year", v)} placeholder="2012" required />
        <Field label="Sort Order" value={form.sort_order} onChange={(v) => set("sort_order", parseInt(v) || 0)} type="number" />
        <div className="sm:col-span-2">
          <Field label="Title" value={form.title} onChange={(v) => set("title", v)} placeholder="Founding of CES" required />
        </div>
        <div className="sm:col-span-2">
          <Field label="Description" value={form.description} onChange={(v) => set("description", v)} placeholder="Brief description of this milestone…" multiline />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: "linear-gradient(to right,#0046cc,#00b4ff)" }}>
          {saving ? <i className="fas fa-circle-notch fa-spin" /> : (initial ? "Save Changes" : "Add Milestone")}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(107,140,168,0.1)", color: "#6b8ca8" }}>Cancel</button>}
      </div>
    </form>
  );
}

export default function JourneyManagerPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/journey");
    if (res.status === 401) { router.replace("/admin"); return; }
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 3000); }

  async function handleAdd(form) {
    setSaving(true);
    await fetch("/api/admin/journey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setShowAdd(false); flash("Milestone added!"); load();
  }
  async function handleEdit(form) {
    setSaving(true);
    await fetch("/api/admin/journey", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
    setSaving(false); setEditing(null); flash("Milestone updated!"); load();
  }
  async function handleDelete(id) {
    if (!confirm("Delete this milestone?")) return;
    setDeleting(id);
    await fetch(`/api/admin/journey?id=${id}`, { method: "DELETE" });
    setDeleting(null); flash("Milestone deleted."); load();
  }

  return (
    <AdminShell title="Journey Manager">
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "#6b8ca8" }}>Manage the company timeline milestones shown on the About page.</p>
          {!showAdd && (
            <button onClick={() => { setShowAdd(true); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(to right,#0046cc,#00b4ff)" }}>
              <i className="fas fa-plus text-xs mr-2" /> Add Milestone
            </button>
          )}
        </div>

        {msg && <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.2)" }}><i className="fas fa-check-circle mr-2" />{msg}</div>}
        {showAdd && <JourneyForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />}
        {editing && <JourneyForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} saving={saving} />}

        {loading ? (
          <div className="p-12 text-center text-sm rounded-2xl border" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)", color: "#6b8ca8" }}>
            <i className="fas fa-circle-notch fa-spin mr-2" /> Loading…
          </div>
        ) : (
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="p-12 text-center text-sm rounded-2xl border" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)", color: "#6b8ca8" }}>
                No milestones yet. Add one above.
              </div>
            )}
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border p-5 flex items-start gap-4" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)" }}>
                <div className="flex-shrink-0">
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.25)" }}>
                    {item.year}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b8ca8" }}>{item.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(item); setShowAdd(false); }} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.2)" }}>
                    <i className="fas fa-pen text-[10px] mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} disabled={deleting === item.id} className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: "rgba(255,60,120,0.1)", color: "#ff3c78", border: "1px solid rgba(255,60,120,0.2)" }}>
                    {deleting === item.id ? <i className="fas fa-circle-notch fa-spin text-[10px]" /> : <><i className="fas fa-trash text-[10px] mr-1" /> Delete</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
