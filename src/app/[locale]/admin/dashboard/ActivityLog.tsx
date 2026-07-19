"use client"

import { useEffect, useState, useCallback } from "react"
import { Download, Filter } from "lucide-react"
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

type EntityFilter = "all" | "price" | "testimonial" | "settings" | "quote" | "quote_management"
type ActionFilter = "all" | "created" | "updated" | "deleted" | "submitted" | "approved" | "rejected" | "status_changed" | "feature" | "pin"

const ENTITY_COLORS: Record<string, string> = {
  price: "bg-blue-500/20 text-blue-400",
  testimonial: "bg-amber-500/20 text-amber-400",
  settings: "bg-purple-500/20 text-purple-400",
  quote: "bg-green-500/20 text-green-400",
  quote_management: "bg-emerald-500/20 text-emerald-400",
}

const ACTION_COLORS: Record<string, string> = {
  created: "bg-green-500/20 text-green-400",
  updated: "bg-blue-500/20 text-blue-400",
  deleted: "bg-red-500/20 text-red-400",
  submitted: "bg-gray-500/20 text-gray-400",
  approved: "bg-emerald-500/20 text-emerald-400",
  rejected: "bg-red-500/20 text-red-400",
  status_changed: "bg-amber-500/20 text-amber-400",
  feature: "bg-purple-500/20 text-purple-400",
  pin: "bg-indigo-500/20 text-indigo-400",
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
    "Entity ID": log.entity_id ?? "—",
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1e293b] px-3 py-2">
          <Filter className="h-4 w-4 text-gray-400" />
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
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#1e293b] px-3 py-2">
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
            <option value="status_changed">Status Changed</option>
          </select>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={handleExportCSV} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-xs text-gray-300 transition-colors hover:border-red-500/40 hover:text-white">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button onClick={handleExportExcel} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-xs text-gray-300 transition-colors hover:border-red-500/40 hover:text-white">
            <Download className="h-3.5 w-3.5" /> Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading activity log…</div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center text-gray-400">No activity recorded yet.</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-[#1e293b]">
                <tr>
                  {["Date", "Time", "Module", "Action", "Admin", "Details"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="bg-[#0f172a] transition-colors hover:bg-[#1e293b]">
                    <td className="px-4 py-3 text-gray-400">{formatDisplayDateOnly(log.created_at)}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(log.created_at).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ENTITY_COLORS[log.entity_type] ?? "bg-gray-500/20 text-gray-400"}`}>
                        {log.entity_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ACTION_COLORS[log.action] ?? "bg-gray-500/20 text-gray-400"}`}>
                        {log.action.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{log.actor_email ?? "System"}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-gray-400">
                      {log.after_json ? JSON.stringify(log.after_json).slice(0, 80) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-500">
                Showing {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded border border-white/10 px-3 py-1 text-xs text-gray-400 transition-colors hover:text-white disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border border-white/10 px-3 py-1 text-xs text-gray-400 transition-colors hover:text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
