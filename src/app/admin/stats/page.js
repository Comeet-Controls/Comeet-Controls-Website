"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../AdminShell";

const EMPTY = { icon: "", value: "", suffix: "+", label: "", sort_order: 0 };

function StatRow({ stat, onEdit, onDelete, deleting }) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(0,180,255,0.08)" }}>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff" }}
          >
            <i className={`fas ${stat.icon} text-xs`} />
          </div>
          <span className="text-xs font-mono" style={{ color: "#6b8ca8" }}>{stat.icon}</span>
        </div>
      </td>
      <td className="py-3 px-4 font-semibold" style={{ color: "#00b4ff" }}>
        {stat.value}{stat.suffix}
      </td>
      <td className="py-3 px-4 text-sm">{stat.label}</td>
      <td className="py-3 px-4 text-xs" style={{ color: "#6b8ca8" }}>{stat.sort_order}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(stat)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.2)" }}
          >
            <i className="fas fa-pen text-[10px] mr-1" /> Edit
          </button>
          <button
            onClick={() => onDelete(stat.id)}
            disabled={deleting === stat.id}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
            style={{ background: "rgba(255,60,120,0.1)", color: "#ff3c78", border: "1px solid rgba(255,60,120,0.2)" }}
          >
            {deleting === stat.id ? <i className="fas fa-circle-notch fa-spin text-[10px]" /> : <><i className="fas fa-trash text-[10px] mr-1" /> Delete</>}
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="rounded-2xl p-6 border space-y-4"
      style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.25)" }}
    >
      <h3 className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {initial ? "Edit Stat" : "Add New Stat"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="FontAwesome Icon class (e.g. fa-users)" value={form.icon} onChange={(v) => set("icon", v)} placeholder="fa-users" required />
        <Field label="Value (number)" value={form.value} onChange={(v) => set("value", v)} placeholder="75" type="number" required />
        <Field label="Suffix (e.g. +, %, /7)" value={form.suffix} onChange={(v) => set("suffix", v)} placeholder="+" required />
        <Field label="Label" value={form.label} onChange={(v) => set("label", v)} placeholder="Happy Clients" required />
        <Field label="Sort Order" value={form.sort_order} onChange={(v) => set("sort_order", parseInt(v) || 0)} placeholder="0" type="number" />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: "linear-gradient(to right,#0046cc,#00b4ff)" }}
        >
          {saving ? <i className="fas fa-circle-notch fa-spin" /> : (initial ? "Save Changes" : "Add Stat")}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: "rgba(107,140,168,0.1)", color: "#6b8ca8" }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6b8ca8" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
        style={{ background: "#020c18", border: "1px solid rgba(0,180,255,0.15)", color: "#e2eaf4" }}
        onFocus={(e) => (e.target.style.borderColor = "#00b4ff")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(0,180,255,0.15)")}
      />
    </div>
  );
}

export default function StatsManagerPage() {
  const router = useRouter();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/stats");
    if (res.status === 401) { router.replace("/admin"); return; }
    const data = await res.json();
    setStats(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 3000); }

  async function handleAdd(form) {
    setSaving(true);
    await fetch("/api/admin/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setShowAddForm(false);
    flash("Stat added!");
    load();
  }

  async function handleEdit(form) {
    setSaving(true);
    await fetch("/api/admin/stats", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingStat.id, ...form }) });
    setSaving(false);
    setEditingStat(null);
    flash("Stat updated!");
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this stat?")) return;
    setDeleting(id);
    await fetch(`/api/admin/stats?id=${id}`, { method: "DELETE" });
    setDeleting(null);
    flash("Stat deleted.");
    load();
  }

  return (
    <AdminShell title="Stats Manager">
      <div className="max-w-5xl space-y-6">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "#6b8ca8" }}>Manage the 8 counter stats shown on the homepage and about page.</p>
          {!showAddForm && (
            <button
              onClick={() => { setShowAddForm(true); setEditingStat(null); }}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(to right,#0046cc,#00b4ff)" }}
            >
              <i className="fas fa-plus text-xs mr-2" /> Add Stat
            </button>
          )}
        </div>

        {/* Flash message */}
        {msg && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "rgba(0,180,255,0.1)", color: "#00b4ff", border: "1px solid rgba(0,180,255,0.2)" }}>
            <i className="fas fa-check-circle mr-2" />{msg}
          </div>
        )}

        {/* Add form */}
        {showAddForm && <StatForm onSave={handleAdd} onCancel={() => setShowAddForm(false)} saving={saving} />}

        {/* Edit form */}
        {editingStat && <StatForm initial={editingStat} onSave={handleEdit} onCancel={() => setEditingStat(null)} saving={saving} />}

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: "#0b1e34", borderColor: "rgba(0,180,255,0.15)" }}>
          {loading ? (
            <div className="p-12 text-center text-sm" style={{ color: "#6b8ca8" }}>
              <i className="fas fa-circle-notch fa-spin mr-2" /> Loading stats…
            </div>
          ) : stats.length === 0 ? (
            <div className="p-12 text-center text-sm" style={{ color: "#6b8ca8" }}>No stats yet. Add one above.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(0,180,255,0.05)", borderBottom: "1px solid rgba(0,180,255,0.12)" }}>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b8ca8" }}>Icon</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b8ca8" }}>Value</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b8ca8" }}>Label</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b8ca8" }}>Order</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b8ca8" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <StatRow key={s.id} stat={s} onEdit={(st) => { setEditingStat(st); setShowAddForm(false); }} onDelete={handleDelete} deleting={deleting} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
