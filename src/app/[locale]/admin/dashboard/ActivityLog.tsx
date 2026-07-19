"use client"

import { useEffect, useState, useCallback } from "react"
import { Download, Filter, Activity, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, XCircle, ArrowUpCircle } from "lucide-react"
import * as XLSX from "xlsx"
import { formatDisplayDate, formatDisplayDateOnly } from "@/lib/siteContent"

interface ActivityLogEntry {
  id: string
  actor_user_id: string | null
  actor_email: string | null
  entity_type: string
  entity_id: string | null
  action: string
  before_json: Record<string, unknown> | null
  after_json: Record<string, unknown> | null
  created_at: string
}

type EntityFilter = "all" | "price" | "testimonial" | "settings" | "quote" | "quote_management" | "homepage"
type ActionFilter = "all" | "created" | "updated" | "deleted" | "submitted" | "approved" | "rejected" | "status_changed" | "feature" | "pin" | "create"

const ENTITY_BADGE: Record<string, { label: string; cls: string }> = {
  price: { label: "Prices", cls: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
  testimonial: { label: "Testimonials", cls: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
  settings: { label: "Settings", cls: "bg-purple-500/15 text-purple-400 border border-purple-500/20" },
  quote: { label: "Quotes", cls: "bg-green-500/15 text-green-400 border border-green-500/20" },
  quote_management: { label: "Quote Mgmt", cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  homepage: { label: "Homepage", cls: "bg-pink-500/15 text-pink-400 border border-pink-500/20" },
}

const ACTION_BADGE: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  created: { label: "Created", cls: "bg-green-500/15 text-green-400 border border-green-500/20", icon: CheckCircle2 },
  create: { label: "Created", cls: "bg-green-500/15 text-green-400 border border-green-500/20", icon: CheckCircle2 },
  updated: { label: "Updated", cls: "bg-blue-500/15 text-blue-400 border border-blue-500/20", icon: ArrowUpCircle },
  deleted: { label: "Deleted", cls: "bg-red-500/15 text-red-400 border border-red-500/20", icon: XCircle },
  submitted: { label: "Submitted", cls: "bg-gray-500/15 text-gray-400 border border-gray-500/20", icon: AlertTriangle },
  approved: { label: "Approved", cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", icon: CheckCircle2 },
  rejected: { label: "Rejected", cls: "bg-red-500/15 text-red-400 border border-red-500/20", icon: XCircle },
  status_changed: { label: "Status Changed", cls: "bg-amber-500/15 text-amber-400 border border-amber-500/20", icon: ArrowUpCircle },
  feature: { label: "Featured", cls: "bg-purple-500/15 text-purple-400 border border-purple-500/20", icon: CheckCircle2 },
  pin: { label: "Pinned", cls: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20", icon: CheckCircle2 },
}

function describeLogEntry(log: ActivityLogEntry): string {
  const actor = log.actor_email ?? "System"
  const after = (log.after_json ?? {}) as Record<string, unknown>
  const before = (log.before_json ?? {}) as Record<string, unknown>

  switch (log.entity_type) {
    case "price": {
      const metal = (after.metal ?? "a metal") as string
      const price = (after.price ?? "") as string
      const oldPrice = (before.price ?? "") as string
      if (log.action === "created") return `${actor} added "${metal}" at S$${price}.`
      if (log.action === "deleted") return `${actor} deleted "${metal}".`
      if ((log.action === "updated" || log.action === "create") && oldPrice && price && oldPrice !== price) return `${actor} updated "${metal}" from S$${oldPrice} to S$${price}.`
      if (log.action === "updated" || log.action === "create") return `${actor} updated "${metal}".`
      return `${actor} ${log.action.replace(/_/g, " ")} a price.`
    }
    case "testimonial": {
      const name = (after.name ?? before.name ?? "a customer") as string
      if (log.action === "submitted") return `${name} submitted a testimonial.`
      if (log.action === "approved") return `${actor} approved ${name}'s testimonial.`
      if (log.action === "rejected") return `${actor} rejected ${name}'s testimonial.`
      if (log.action === "deleted") return `${actor} deleted ${name}'s testimonial.`
      return `${actor} ${log.action.replace(/_/g, " ")} ${name}'s testimonial.`
    }
    case "settings": {
      const keys = Object.keys(after)
      if (keys.length > 0) return `${actor} updated settings: ${keys.slice(0, 3).join(", ")}${keys.length > 3 ? ` +${keys.length - 3} more` : ""}.`
      return `${actor} updated site settings.`
    }
    case "quote": {
      const qStatus = (after.quotation_status ?? "") as string
      if (log.action === "status_changed" && qStatus) return `${actor} changed quote status to ${qStatus}.`
      return `${actor} ${log.action.replace(/_/g, " ")} a quote.`
    }
    case "quote_management": {
      if (log.action === "created") return `${actor} created a management record.`
      return `${actor} ${log.action.replace(/_/g, " ")} a management record.`
    }
    case "homepage": {
      if (log.action === "updated" || log.action === "create") return `${actor} updated homepage content.`
      return `${actor} ${log.action.replace(/_/g, " ")} homepage content.`
    }
    default:
      return `${actor} ${log.action.replace(/_/g, " ")} a ${log.entity_type}.`
  }
}

export default function ActivityLogTab() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [entityFilter, setEntityFilter] = useState<EntityFilter>("all")
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all")
  const [page, setPage] = useState(0)
  const limit = 50

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(page * limit) })
      if (entityFilter !== "all") params.set("entity_type", entityFilter)
      if (actionFilter !== "all") params.set("action", actionFilter)
      const res = await fetch(`/api/admin/activity?${params}`)
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs ?? [])
        setTotal(data.total ?? 0)
      }
    } finally {
      setLoading(false)
    }
  }, [entityFilter, actionFilter, page])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const exportRows = logs.map((log) => ({
    Date: formatDisplayDateOnly(log.created_at),
    Time: new Date(log.created_at).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    Module: log.entity_type,
    Action: log.action,
    Admin: log.actor_email ?? "System",
    Details: describeLogEntry(log),
  }))

  const handleExportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(exportRows)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(exportRows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Activity Log")
    XLSX.writeFile(wb, `activity-log-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10">
            <Activity className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Activity Log</h2>
            <p className="mt-0.5 text-sm text-gray-500">Track all admin actions and changes across the dashboard</p>
          </div>
        </div>
        <div className="mt-5 h-px bg-white/[0.06]" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={entityFilter}
            onChange={(e) => { setEntityFilter(e.target.value as EntityFilter); setPage(0) }}
            className="bg-transparent text-sm text-gray-300 outline-none"
          >
            <option value="all">All Modules</option>
            <option value="price">Prices</option>
            <option value="testimonial">Testimonials</option>
            <option value="settings">Settings</option>
            <option value="quote">Quotes</option>
            <option value="homepage">Homepage</option>
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value as ActionFilter); setPage(0) }}
            className="bg-transparent text-sm text-gray-300 outline-none"
          >
            <option value="all">All Actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="submitted">Submitted</option>
            <option value="status_changed">Status Changed</option>
          </select>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-gray-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-gray-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <Download className="h-3.5 w-3.5" /> Excel
          </button>
        </div>
      </div>

      {/* Log Table */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading activity log...</div>
      ) : logs.length === 0 ? (
        <div className="py-20 text-center text-gray-400">No activity recorded yet.</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06] shadow-lg shadow-black/10">
            <table className="w-full text-sm">
              <thead className="border-b border-white/[0.06] bg-white/[0.03]">
                <tr>
                  {["Date & Time", "Admin", "Module", "Action", "Description"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {logs.map((log) => {
                  const actionBadge = ACTION_BADGE[log.action] ?? { label: log.action.replace(/_/g, " "), cls: "bg-gray-500/15 text-gray-400 border border-gray-500/20", icon: AlertTriangle }
                  const entityBadge = ENTITY_BADGE[log.entity_type] ?? { label: log.entity_type, cls: "bg-gray-500/15 text-gray-400 border border-gray-500/20" }
                  const ActionIcon = actionBadge.icon

                  return (
                    <tr key={log.id} className="bg-[#0c1222] transition-colors duration-200 hover:bg-white/[0.03]">
                      <td className="px-5 py-4">
                        <div className="text-sm text-white">{formatDisplayDateOnly(log.created_at)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">{log.actor_email ?? "System"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${entityBadge.cls}`}>
                          {entityBadge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${actionBadge.cls}`}>
                          <ActionIcon className="h-3 w-3" />
                          {actionBadge.label}
                        </span>
                      </td>
                      <td className="max-w-sm px-5 py-4 text-sm text-gray-300">
                        {describeLogEntry(log)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-gray-500">
                Showing {page * limit + 1}--{Math.min((page + 1) * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-3">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-400 transition-all duration-200 hover:border-white/[0.12] hover:text-white disabled:opacity-40 disabled:hover:border-white/[0.06] disabled:hover:text-gray-400"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </button>
                <span className="text-xs text-gray-500">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-400 transition-all duration-200 hover:border-white/[0.12] hover:text-white disabled:opacity-40 disabled:hover:border-white/[0.06] disabled:hover:text-gray-400"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
