"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../AdminShell";

const EMPTY_PROJECT = { tag: "", icon: "fa-gear", bg: "", title: "", short_desc: "", full_desc: "", specs: [], sort_order: 0 };

function Field({ label, value, onChange, placeholder, type = "text", required, multiline }) {
  const baseStyle = { background: "#020c18", border: "1px solid rgba(0,180,255,0.15)", color: "#e2eaf4" };
  const focusStyle = { borderColor: "#00b4ff" };
  const blurStyle = { borderColor: "rgba(0,180,255,0.15)" };
  const cls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";

  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6b8ca8" }}>{label}{required && " *"}</label>
      {multiline ? (
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} required={required} rows={3}
          className={cls} style={{ ...baseStyle, resize: "vertical" }}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => Object.assign(e.target.style, blurStyle)}
        />
      ) : (
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} required={required}
          className={cls} style={baseStyle}
          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
          onBlur={(e) => Object.assign(e.target.style, blurStyle)}
        />
      )}
    </div>
  );
}

function SpecsEditor({ specs, onChange }) {
  function addSpec() { onChange([...specs, { label: "", value: "" }]); }
  function removeSpec(i) { onChange(specs.filter((_, idx) => idx !== i)); }
  function updateSpec(i, k, v) { onChange(specs.map((s, idx) => idx === i ? { ...s, [k]: v } : s)); }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b8ca8" }}>Tech Specs</label>
        <button type="button" onClick={addSpec} className="text-xs px-3 py-1 rounded-lg transition-all" style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff" }}>
          <i className="fas fa-plus text-[10px] mr-1" /> Add Row
        </button>
      </div>
      <div className="space-y-2">
        {specs.map((sp, i) => (
          <div key={i} className="flex gap-2">
            <input value={sp.label} onChange={(e) => updateSpec(i, "label", e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "#020c18", border: "1px solid rgba(0,180,255,0.15)", color: "#e2eaf4" }} />
            <input value={sp.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={{ background: "#020c18", border: "1px solid rgba(0,180,255,0.15)", color: "#e2eaf4" }} />
            <button type="button" onClick={() => removeSpec(i)} className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-xs" style={{ background: "rgba(255,60,120,0.1)", color: "#ff3c78" }}>
              <i className="fas fa-xmark" />
            </button>
          </div>
        ))}
        {specs.length === 0 && <p className="text-xs py-2" style={{ color: "#6b8ca8" }}>No specs yet. Click "Add Row" to add technical specifications.</p>}
      </div>
    </div>
  );
}

function ProjectForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial ? { ...initial, specs: Array.isArray(initial.specs) ? initial.specs : [] } : EMPTY_PROJECT);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-2xl p-6 border space-y-5"
      style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.25)" }}
    >
      <h3 className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{initial ? "Edit Project" : "Add New Project"}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Tag" value={form.tag} onChange={(v) => set("tag", v)} placeholder="Test Equipment" />
        <Field label="FontAwesome Icon" value={form.icon} onChange={(v) => set("icon", v)} placeholder="fa-gear" />
        <Field label="Title" value={form.title} onChange={(v) => set("title", v)} placeholder="Transmission Test Rig" required />
        <Field label="Sort Order" value={form.sort_order} onChange={(v) => set("sort_order", parseInt(v) || 0)} type="number" />
        <div className="sm:col-span-2">
          <Field label="Background CSS (optional)" value={form.bg} onChange={(v) => set("bg", v)} placeholder="linear-gradient(135deg,#051a2e,#0a2a44)" />
        </div>
        <div className="sm:col-span-2">
          <Field label="Short Description (card preview)" value={form.short_desc} onChange={(v) => set("short_desc", v)} placeholder="Brief one-liner for the card" multiline required />
        </div>
        <div className="sm:col-span-2">
          <Field label="Full Description (case study)" value={form.full_desc} onChange={(v) => set("full_desc", v)} placeholder="Detailed description for the drawer modal" multiline />
        </div>
        <div className="sm:col-span-2">
          <SpecsEditor specs={form.specs} onChange={(v) => set("specs", v)} />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50" style={{ background: "linear-gradient(to right,#0046cc,#00b4ff)" }}>
          {saving ? <i className="fas fa-circle-notch fa-spin" /> : (initial ? "Save Changes" : "Add Project")}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(107,140,168,0.1)", color: "#6b8ca8" }}>Cancel</button>}
      </div>
    </form>
  );
}

export default function ProjectsManagerPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    if (res.status === 401) { router.replace("/admin"); return; }
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 3000); }

  async function handleAdd(form) {
    setSaving(true);
    await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setShowAdd(false); flash("Project added!"); load();
  }
  async function handleEdit(form) {
    setSaving(true);
    await fetch("/api/admin/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) });
    setSaving(false); setEditing(null); flash("Project updated!"); load();
  }
  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    setDeleting(id);
    await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    setDeleting(null); flash("Project deleted."); load();
  }

  return (
    <AdminShell title="Projects Manager">
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "#6b8ca8" }}>Manage featured projects and case studies shown on the website.</p>
          {!showAdd && (
            <button onClick={() => { setShowAdd(true); setEditing(null); }} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(to right,#0046cc,#00b4ff)" }}>
              <i className="fas fa-plus text-xs mr-2" /> Add Project
            </button>
          )}
        </div>

        {msg && <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.2)" }}><i className="fas fa-check-circle mr-2" />{msg}</div>}
        {showAdd && <ProjectForm onSave={handleAdd} onCancel={() => setShowAdd(false)} saving={saving} />}
        {editing && <ProjectForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} saving={saving} />}

        {loading ? (
          <div className="p-12 text-center text-sm rounded-2xl border" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)", color: "#6b8ca8" }}>
            <i className="fas fa-circle-notch fa-spin mr-2" /> Loading projects…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="rounded-2xl border overflow-hidden" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)" }}>
                <div className="h-24 flex items-center justify-center" style={{ background: p.bg || "linear-gradient(135deg,#061525,#0d2035)" }}>
                  <i className={`fas ${p.icon || "fa-gear"} text-4xl`} style={{ color: "rgba(0,180,255,0.3)" }} />
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#00b4ff" }}>{p.tag}</div>
                  <h3 className="font-semibold text-sm mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{p.title}</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "#6b8ca8" }}>{p.short_desc}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(p); setShowAdd(false); }} className="flex-1 py-1.5 rounded-xl text-xs font-medium" style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.2)" }}>
                      <i className="fas fa-pen text-[10px] mr-1" /> Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} className="flex-1 py-1.5 rounded-xl text-xs font-medium disabled:opacity-50" style={{ background: "rgba(255,60,120,0.1)", color: "#ff3c78", border: "1px solid rgba(255,60,120,0.2)" }}>
                      {deleting === p.id ? <i className="fas fa-circle-notch fa-spin text-[10px]" /> : <><i className="fas fa-trash text-[10px] mr-1" /> Delete</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-3 p-12 text-center text-sm rounded-2xl border" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)", color: "#6b8ca8" }}>
                No projects yet. Add one above.
              </div>
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
