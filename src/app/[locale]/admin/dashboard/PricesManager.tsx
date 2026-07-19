"use client"

import { useEffect, useState } from "react"
import { Plus, Save, Trash2, Eye, EyeOff, MoveUp, MoveDown } from "lucide-react"

type PriceRow = {
  id: string
  metal: string
  price: string
  condition: string
  unit?: string
  sort_order?: number
  is_active?: boolean
  status?: string
  updated_at?: string
}

const emptyDraft = {
  metal: "",
  price: "",
  condition: "",
  unit: "S$/kg",
  sort_order: 0,
  is_active: true,
  status: "active",
}

export default function PricesManager() {
  const [items, setItems] = useState<PriceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [message, setMessage] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/prices?admin=1", { cache: "no-store" })
      const payload = await response.json()
      setItems((payload as { prices?: PriceRow[] })?.prices ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const startCreate = () => {
    setEditingId(null)
    setDraft(emptyDraft)
    setMessage("")
  }

  const startEdit = (row: PriceRow) => {
    setEditingId(row.id)
    setDraft({
      metal: row.metal ?? "",
      price: row.price ?? "",
      condition: row.condition ?? "",
      unit: row.unit ?? "S$/kg",
      sort_order: row.sort_order ?? 0,
      is_active: row.is_active ?? true,
      status: row.status ?? "active",
    })
    setMessage("")
  }

  const updateField = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSave = async () => {
    if (!draft.metal || !draft.price) {
      setMessage("Metal and price are required.")
      return
    }

    setSaving(true)
    setMessage("")
    try {
      const method = editingId ? "PATCH" : "POST"
      const response = await fetch("/api/prices", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...draft } : draft),
      })

      const result = await response.json()
      if (!response.ok) {
        const msg = result.error || result.details || "Failed to save price."
        setMessage(typeof msg === "string" ? msg : "Failed to save price.")
        return
      }
      setMessage(editingId ? "Price updated." : "Price added.")
      startCreate()
      await load()
    } catch {
      setMessage("Failed to save price.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this price?")) return
    await fetch(`/api/prices?id=${id}`, { method: "DELETE" })
    await load()
  }

  const handleToggleVisible = async (row: PriceRow) => {
    await fetch("/api/prices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id, is_active: !(row.is_active ?? true), metal: row.metal, price: row.price, condition: row.condition, unit: row.unit, sort_order: row.sort_order ?? 0, status: row.status ?? "active" }),
    })
    await load()
  }

  const handleMove = async (row: PriceRow, delta: number) => {
    const nextOrder = Math.max(0, (row.sort_order ?? 0) + delta)
    await fetch("/api/prices", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id, sort_order: nextOrder, metal: row.metal, price: row.price, condition: row.condition, unit: row.unit, is_active: row.is_active ?? true, status: row.status ?? "active" }),
    })
    await load()
  }

  const filtered = items.filter((item) => item.metal.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Scrap Metal Prices</h2>
          <p className="mt-1 text-sm text-gray-400">Add, hide, reorder, and update public prices from here.</p>
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search metal..." className={inputClass} />
          <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white">
            <Plus className="h-4 w-4" /> New
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f172a] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">{editingId ? "Edit Price" : "Add Price"}</h3>
          <Field label="Metal"><input value={draft.metal} onChange={(event) => updateField("metal", event.target.value)} className={inputClass} /></Field>
          <Field label="Price"><input value={draft.price} onChange={(event) => updateField("price", event.target.value)} className={inputClass} /></Field>
          <Field label="Condition"><input value={draft.condition} onChange={(event) => updateField("condition", event.target.value)} className={inputClass} /></Field>
          <Field label="Unit"><input value={draft.unit} onChange={(event) => updateField("unit", event.target.value)} className={inputClass} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Order"><input type="number" value={draft.sort_order} onChange={(event) => updateField("sort_order", Number(event.target.value))} className={inputClass} /></Field>
            <label className="space-y-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
              <span>Status</span>
              <select value={draft.status} onChange={(event) => updateField("status", event.target.value)} className={inputClass}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
                <option value="draft">draft</option>
              </select>
            </label>
          </div>
          <label className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm text-gray-200">
            <span>Visible on website</span>
            <input type="checkbox" checked={draft.is_active} onChange={(event) => updateField("is_active", event.target.checked)} />
          </label>
          {message && <p className="text-sm text-gray-300">{message}</p>}
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : editingId ? "Update Price" : "Save Price"}
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10">
          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading prices...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-[#0f172a]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Metal</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Price</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Condition</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Order</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Visible</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#111827]">
                {filtered.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-white">{row.metal}</td>
                    <td className="px-4 py-3 text-gray-300">{row.price}</td>
                    <td className="px-4 py-3 text-gray-400">{row.condition}</td>
                    <td className="px-4 py-3 text-gray-400">{row.sort_order ?? 0}</td>
                    <td className="px-4 py-3">{row.is_active ?? true ? <span className="text-green-400">Yes</span> : <span className="text-gray-500">Hidden</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleMove(row, -1)} className="rounded-md border border-white/10 p-2 text-gray-300 transition-colors hover:border-white/20 hover:text-white"><MoveUp className="h-4 w-4" /></button>
                        <button onClick={() => handleMove(row, 1)} className="rounded-md border border-white/10 p-2 text-gray-300 transition-colors hover:border-white/20 hover:text-white"><MoveDown className="h-4 w-4" /></button>
                        <button onClick={() => handleToggleVisible(row)} className="rounded-md border border-white/10 p-2 text-gray-300 transition-colors hover:border-white/20 hover:text-white">{row.is_active ?? true ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                        <button onClick={() => startEdit(row)} className="rounded-md border border-blue-500/20 px-3 py-2 text-xs text-blue-300 transition-colors hover:bg-blue-500/10">Edit</button>
                        <button onClick={() => handleDelete(row.id)} className="rounded-md border border-red-500/20 px-3 py-2 text-xs text-red-300 transition-colors hover:bg-red-500/10">
                          <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Delete
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
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</span>
      {children}
    </label>
  )
}

const inputClass = "w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-red-500"
