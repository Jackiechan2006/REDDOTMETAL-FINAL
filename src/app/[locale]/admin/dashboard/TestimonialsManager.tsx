"use client"

import { useEffect, useState } from "react"
import { Check, Pin, PinOff, Plus, Save, Trash2, Star, X, Flag } from "lucide-react"

type TestimonialRow = {
  id: string
  name: string
  company?: string
  text: string
  rating: number
  status?: string
  approved?: boolean
  is_active?: boolean
  featured?: boolean
  pinned?: boolean
  sort_order?: number
  updated_at?: string
}

const emptyDraft = {
  name: "",
  company: "",
  text: "",
  rating: 5,
  sort_order: 0,
  featured: false,
  pinned: false,
  is_active: true,
  status: "pending",
}

export default function TestimonialsManager() {
  const [items, setItems] = useState<TestimonialRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [message, setMessage] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/testimonials?admin=1", { cache: "no-store" })
      const payload = await response.json()
      setItems((payload as { testimonials?: TestimonialRow[] })?.testimonials ?? [])
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

  const startEdit = (row: TestimonialRow) => {
    setEditingId(row.id)
    const metadata = (row as TestimonialRow & { featured?: boolean; pinned?: boolean })
    setDraft({
      name: row.name ?? "",
      company: row.company ?? "",
      text: row.text ?? "",
      rating: row.rating ?? 5,
      sort_order: row.sort_order ?? 0,
      featured: Boolean(metadata.featured),
      pinned: Boolean(metadata.pinned),
      is_active: row.is_active ?? true,
      status: row.status ?? "pending",
    })
    setMessage("")
  }

  const updateField = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSave = async () => {
    if (!draft.name || !draft.text) {
      setMessage("Name and feedback are required.")
      return
    }

    setSaving(true)
    setMessage("")
    try {
      const method = editingId ? "PATCH" : "POST"
      const response = await fetch("/api/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...draft, action: "update" } : draft),
      })
      if (!response.ok) throw new Error("Failed")
      setMessage(editingId ? "Testimonial updated." : "Testimonial added.")
      startCreate()
      await load()
    } catch {
      setMessage("Failed to save testimonial.")
    } finally {
      setSaving(false)
    }
  }

  const mutate = async (id: string, action: string, extra: Record<string, unknown> = {}) => {
    await fetch("/api/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, ...extra }),
    })
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return
    await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" })
    await load()
  }

  const filtered = items.filter((item) =>
    `${item.name} ${item.company ?? ""} ${item.text}`.toLowerCase().includes(search.toLowerCase())
  )

  const pendingCount = items.filter((item) => (item.status ?? "pending") === "pending").length
  const approvedCount = items.filter((item) => item.approved).length
  const rejectedCount = items.filter((item) => (item.status ?? "") === "rejected").length
  const averageRating = items.length ? Math.round((items.reduce((sum, item) => sum + (item.rating ?? 0), 0) / items.length) * 10) / 10 : 0

  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Testimonials</h2>
          <p className="mt-1 text-sm text-gray-400">Approve, reject, feature, and pin customer feedback.</p>
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search testimonials..." className={inputClass} />
          <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/20 hover:text-white">
            <Plus className="h-4 w-4" /> New
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Average Rating" value={averageRating.toFixed(1)} />
        <Stat label="Pending" value={pendingCount} />
        <Stat label="Approved" value={approvedCount} />
        <Stat label="Rejected" value={rejectedCount} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4 rounded-xl border border-white/10 bg-[#0f172a] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h3>
          <Field label="Name"><input value={draft.name} onChange={(event) => updateField("name", event.target.value)} className={inputClass} /></Field>
          <Field label="Company"><input value={draft.company} onChange={(event) => updateField("company", event.target.value)} className={inputClass} /></Field>
          <Field label="Feedback"><textarea rows={5} value={draft.text} onChange={(event) => updateField("text", event.target.value)} className={`${inputClass} resize-none`} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rating"><input type="number" min={1} max={5} value={draft.rating} onChange={(event) => updateField("rating", Number(event.target.value))} className={inputClass} /></Field>
            <Field label="Order"><input type="number" value={draft.sort_order} onChange={(event) => updateField("sort_order", Number(event.target.value))} className={inputClass} /></Field>
          </div>
          <label className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm text-gray-200">
            <span>Featured</span>
            <input type="checkbox" checked={draft.featured} onChange={(event) => updateField("featured", event.target.checked)} />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm text-gray-200">
            <span>Pinned</span>
            <input type="checkbox" checked={draft.pinned} onChange={(event) => updateField("pinned", event.target.checked)} />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-sm text-gray-200">
            <span>Visible on website</span>
            <input type="checkbox" checked={draft.is_active} onChange={(event) => updateField("is_active", event.target.checked)} />
          </label>
          {message && <p className="text-sm text-gray-300">{message}</p>}
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : editingId ? "Update Testimonial" : "Save Testimonial"}
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10">
          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading testimonials...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-[#0f172a]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Company</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Rating</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Flags</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#111827]">
                {filtered.map((row) => {
                  const featured = Boolean((row as TestimonialRow & { featured?: boolean }).featured)
                  const pinned = Boolean((row as TestimonialRow & { pinned?: boolean }).pinned)
                  return (
                    <tr key={row.id} className="transition-colors hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                      <td className="px-4 py-3 text-gray-300">{row.company ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-300">{Array.from({ length: row.rating ?? 0 }).map((_, index) => <Star key={index} className="inline h-4 w-4 fill-red-500 text-red-400" />)}</td>
                      <td className="px-4 py-3 text-gray-300">{row.status ?? (row.approved ? "approved" : "pending")}</td>
                      <td className="px-4 py-3 text-gray-400">
                        <div className="flex gap-2">
                          {featured && <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-300">Featured</span>}
                          {pinned && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-200">Pinned</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => mutate(row.id, "approve")} className="rounded-md border border-green-500/20 px-3 py-2 text-xs text-green-300 transition-colors hover:bg-green-500/10"><Check className="mr-1 inline h-3.5 w-3.5" /> Approve</button>
                          <button onClick={() => mutate(row.id, "reject")} className="rounded-md border border-yellow-500/20 px-3 py-2 text-xs text-yellow-300 transition-colors hover:bg-yellow-500/10"><X className="mr-1 inline h-3.5 w-3.5" /> Reject</button>
                          <button onClick={() => mutate(row.id, "feature", { featured: !featured })} className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-white/5"><Flag className="mr-1 inline h-3.5 w-3.5" /> {featured ? "Unfeature" : "Feature"}</button>
                          <button onClick={() => mutate(row.id, "pin", { pinned: !pinned })} className="rounded-md border border-white/10 px-3 py-2 text-xs text-gray-200 transition-colors hover:bg-white/5">{pinned ? <><PinOff className="mr-1 inline h-3.5 w-3.5" /> Unpin</> : <><Pin className="mr-1 inline h-3.5 w-3.5" /> Pin</>}</button>
                          <button onClick={() => startEdit(row)} className="rounded-md border border-blue-500/20 px-3 py-2 text-xs text-blue-300 transition-colors hover:bg-blue-500/10">Edit</button>
                          <button onClick={() => handleDelete(row.id)} className="rounded-md border border-red-500/20 px-3 py-2 text-xs text-red-300 transition-colors hover:bg-red-500/10">
                            <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0f172a] p-4">
      <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
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
