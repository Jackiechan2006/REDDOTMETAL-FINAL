"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CheckCircle, Clock, ChevronDown, Eye, FileText, FileSpreadsheet, Mail, Printer } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import ActivityLogTab from "./ActivityLog"
import PricesManager from "./PricesManager"
import type {
  QuoteRequestWithManagement,
  ContactRequest,
  AdminQuoteManagement,
  QuoteStatus,
  PaymentStatus,
  CustomerPriority,
} from "@/types/database"
import { formatDisplayDate, formatDisplayDateOnly } from "@/lib/siteContent"

type Tab = "quotes" | "contacts" | "prices" | "activity"
type FilterStatus = "all" | QuoteStatus
type SortOrder = "newest" | "oldest" | "pending" | "completed"

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("quotes")
  const [quotes, setQuotes] = useState<QuoteRequestWithManagement[]>([])
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequestWithManagement | null>(null)
  const [mgmtRecord, setMgmtRecord] = useState<Partial<AdminQuoteManagement>>({})
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")
  const [isExportOpen, setIsExportOpen] = useState(false)

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/quotes", { method: "GET" })
    if (res.status === 401) {
      router.push("/en/admin")
      return false
    }
    return true
  }, [router])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [qRes, cRes] = await Promise.all([
      fetch("/api/admin/quotes"),
      fetch("/api/admin/contacts"),
    ])
    if (qRes.status === 401) { router.push("/en/admin"); return }
    const qData = await qRes.json()
    const cData = await cRes.json()
    setQuotes(qData.quotes ?? [])
    setContacts(cData.contacts ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => {
    checkAuth().then((ok) => {
      if (ok) {
        setAuthChecked(true)
        fetchData()
      }
    })
  }, [checkAuth, fetchData])

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/en/admin")
  }

  const openQuote = async (quote: QuoteRequestWithManagement) => {
    setSelectedQuote(quote)
    setSaveMsg("")
    // Load existing management record if any
    const res = await fetch(`/api/admin/management?quote_request_id=${quote.id}`)
    const data = await res.json()
    setMgmtRecord(data.record ?? {
      quotation_currency: "SGD",
      quotation_status: "Pending",
      payment_status: "Unpaid",
      customer_priority: "Normal",
    })
  }

  const handleSaveMgmt = async () => {
    if (!selectedQuote) return
    setSaving(true)
    setSaveMsg("")
    try {
      const isUpdate = !!(mgmtRecord as AdminQuoteManagement).id
      const method = isUpdate ? "PATCH" : "POST"
      const body = isUpdate
        ? { ...mgmtRecord, id: (mgmtRecord as AdminQuoteManagement).id }
        : { ...mgmtRecord, quote_request_id: selectedQuote.id }

      const res = await fetch("/api/admin/management", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        setMgmtRecord(data.record)
        setSaveMsg("Saved successfully.")
        fetchData()
      } else {
        setSaveMsg("Failed to save. Please try again.")
      }
    } finally {
      setSaving(false)
    }
  }

  const filteredQuotes = quotes
    .filter((q) => {
      const matchSearch =
        search === "" ||
        q.company_name.toLowerCase().includes(search.toLowerCase()) ||
        q.contact_person.toLowerCase().includes(search.toLowerCase()) ||
        q.email.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === "all" || q.status === filterStatus
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortOrder === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortOrder === "pending") return a.status === "Pending" ? -1 : 1
      if (sortOrder === "completed") return a.status === "Completed" ? -1 : 1
      return 0
    })

  const statusColor: Record<string, string> = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Reviewing: "bg-blue-500/20 text-blue-400",
    Quoted: "bg-amber-500/20 text-amber-400",
    Accepted: "bg-green-500/20 text-green-400",
    Rejected: "bg-red-500/20 text-red-400",
    Completed: "bg-emerald-500/20 text-emerald-400",
    Cancelled: "bg-gray-500/20 text-gray-400",
  }

  const exportRows = filteredQuotes.map((quote) => {
    const management = quote.admin_quote_management?.[0]

    return {
      "Company Name": quote.company_name,
      "Contact Person": quote.contact_person,
      Email: quote.email,
      "Phone Number": quote.phone_number,
      "Metal Types": quote.metal_type.join(", "),
      "Estimated Weight": quote.estimated_weight,
      "Pickup Address": quote.pickup_address,
      "Preferred Pickup Date": quote.preferred_pickup_date,
      Status: quote.status,
      "Assigned Staff": management?.assigned_staff ?? "",
      "Quotation Amount": management?.quotation_amount ?? "",
      "Payment Status": management?.payment_status ?? "",
      "Customer Priority": management?.customer_priority ?? "",
      "Created Date": formatDisplayDate(quote.created_at),
    }
  })

  const getExportFilename = (extension: string) =>
    `red-dot-metals-quotes-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")}.${extension}`

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quotes")
    XLSX.writeFile(workbook, getExportFilename("xlsx"))
    setIsExportOpen(false)
  }

  const handleExportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportRows)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = getExportFilename("csv")
    link.click()
    URL.revokeObjectURL(url)
    setIsExportOpen(false)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
    doc.setFontSize(16)
    doc.text("Red Dot Metals Quote Export", 14, 16)

    autoTable(doc, {
      startY: 24,
      head: [[
        "Company Name",
        "Contact Person",
        "Email",
        "Phone Number",
        "Metal Types",
        "Estimated Weight",
        "Pickup Address",
        "Preferred Pickup Date",
        "Status",
        "Assigned Staff",
        "Quotation Amount",
        "Payment Status",
        "Customer Priority",
        "Created Date",
      ]],
      body: exportRows.map((row) => [
        row["Company Name"],
        row["Contact Person"],
        row.Email,
        row["Phone Number"],
        row["Metal Types"],
        row["Estimated Weight"],
        row["Pickup Address"],
        row["Preferred Pickup Date"],
        row.Status,
        row["Assigned Staff"],
        row["Quotation Amount"],
        row["Payment Status"],
        row["Customer Priority"],
        row["Created Date"],
      ]),
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: "linebreak",
        textColor: [226, 232, 240],
        fillColor: [30, 41, 59],
        lineColor: [51, 65, 85],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [15, 23, 42],
      },
      theme: "grid",
    })

    doc.save(getExportFilename("pdf"))
    setIsExportOpen(false)
  }

  if (!authChecked) return null

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#1e293b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="Red Dot Metals" width={100} height={36} className="h-9 w-auto object-contain" />
            <span className="text-sm font-medium text-gray-400">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsExportOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0f172a] px-4 py-2 text-sm text-gray-300 transition-all duration-200 hover:border-blue-500/40 hover:text-white hover:shadow-lg hover:shadow-black/20"
              >
                <Printer className="h-4 w-4" />
                Export
                <ChevronDown className="h-4 w-4" />
              </button>
              {isExportOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#0f172a] shadow-2xl shadow-black/40">
                  <button
                    onClick={handleExportPDF}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-200 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <FileText className="h-4 w-4 text-red-400" />
                    Export as PDF
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-200 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-green-400" />
                    Export as Excel (.xlsx)
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-200 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Mail className="h-4 w-4 text-yellow-400" />
                    Export as CSV
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-red-500/50 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              label: "Total Quotes",
              value: quotes.length,
              icon: FileText,
              tone: "from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-300",
              iconTone: "bg-blue-500/15 text-blue-300",
            },
            {
              label: "Pending Quotes",
              value: quotes.filter((q) => q.status === "Pending").length,
              icon: Clock,
              tone: "from-amber-500/20 to-yellow-600/10 border-amber-500/20 text-amber-300",
              iconTone: "bg-amber-500/15 text-amber-300",
            },
            {
              label: "Reviewing Quotes",
              value: quotes.filter((q) => q.status === "Reviewing").length,
              icon: Eye,
              tone: "from-amber-500/20 to-orange-600/10 border-amber-500/20 text-amber-300",
              iconTone: "bg-amber-500/15 text-amber-300",
            },
            {
              label: "Completed Quotes",
              value: quotes.filter((q) => q.status === "Completed").length,
              icon: CheckCircle,
              tone: "from-emerald-500/20 to-green-600/10 border-emerald-500/20 text-emerald-300",
              iconTone: "bg-emerald-500/15 text-emerald-300",
            },
            {
              label: "Contact Requests",
              value: contacts.length,
              icon: Mail,
              tone: "from-red-500/20 to-rose-600/10 border-red-500/20 text-red-300",
              iconTone: "bg-red-500/15 text-red-300",
            },
          ].map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className={`group rounded-2xl border bg-gradient-to-br p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 ${stat.tone} bg-[#1e293b]`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.iconTone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {(["quotes", "contacts", "prices", "activity"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-red-600 text-white" : "border border-white/10 text-gray-300 hover:text-white"
              }`}
            >
              {t === "quotes" ? "Quote Requests" : t === "contacts" ? "Contact Requests" : t === "prices" ? "Price Manager" : "Activity Log"}
            </button>
          ))}
        </div>

        {/* Quotes Tab */}
        {tab === "quotes" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="Search company, contact, email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[200px] rounded-lg border border-white/10 bg-[#1e293b] px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="rounded-lg border border-white/10 bg-[#1e293b] px-3 py-2 text-sm text-gray-300 outline-none focus:border-red-500"
              >
                <option value="all">All Statuses</option>
                {["Pending","Reviewing","Quoted","Accepted","Rejected","Completed","Cancelled"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="rounded-lg border border-white/10 bg-[#1e293b] px-3 py-2 text-sm text-gray-300 outline-none focus:border-red-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="pending">Pending First</option>
                <option value="completed">Completed First</option>
              </select>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-400">Loading…</div>
            ) : filteredQuotes.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No quote requests found.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10 bg-[#1e293b]">
                    <tr>
                      {["Company","Contact","Email","Metals","Date","Status","Action"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredQuotes.map((q) => (
                      <tr key={q.id} className="bg-[#0f172a] transition-colors hover:bg-[#1e293b]">
                        <td className="px-4 py-3 font-medium text-white">{q.company_name}</td>
                        <td className="px-4 py-3 text-gray-300">{q.contact_person}</td>
                        <td className="px-4 py-3 text-gray-400">{q.email}</td>
                        <td className="px-4 py-3 text-gray-400">{q.metal_type.join(", ")}</td>
                        <td className="px-4 py-3 text-gray-400">{formatDisplayDateOnly(q.created_at)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[q.status] ?? "bg-gray-500/20 text-gray-400"}`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openQuote(q)}
                            className="rounded border border-red-500/30 px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {tab === "contacts" && (
          <div>
            {loading ? (
              <div className="py-12 text-center text-gray-400">Loading…</div>
            ) : contacts.length === 0 ? (
              <div className="py-12 text-center text-gray-400">No contact requests yet.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10 bg-[#1e293b]">
                    <tr>
                      {["Name","Company","Phone","Email","Metal Type","Message","Date"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {contacts.map((c) => (
                      <tr key={c.id} className="bg-[#0f172a] transition-colors hover:bg-[#1e293b]">
                        <td className="px-4 py-3 font-medium text-white">{c.customer_name}</td>
                        <td className="px-4 py-3 text-gray-300">{c.company_name ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-400">{c.phone_number}</td>
                        <td className="px-4 py-3 text-gray-400">{c.email ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-400">{c.metal_type}</td>
                        <td className="max-w-xs truncate px-4 py-3 text-gray-400">{c.message}</td>
                        <td className="px-4 py-3 text-gray-400">{formatDisplayDateOnly(c.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Activity Log Tab */}
        {tab === "activity" && <ActivityLogTab />}

        {/* Prices Tab */}
        {tab === "prices" && <PricesManager />}
      </div>

      {/* Quote Management Drawer */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm" onClick={() => setSelectedQuote(null)}>
          <div
            className="h-full w-full max-w-xl overflow-y-auto bg-[#1e293b] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Manage Quote</h2>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
            </div>

            {/* Customer Info (read-only) */}
            <div className="mb-6 rounded-xl border border-white/10 bg-[#0f172a] p-4 space-y-2 text-sm">
              <h3 className="font-semibold text-red-400 mb-3">Customer Details</h3>
              <InfoRow label="Company" value={selectedQuote.company_name} />
              <InfoRow label="Contact" value={selectedQuote.contact_person} />
              <InfoRow label="Email" value={selectedQuote.email} />
              <InfoRow label="Phone" value={selectedQuote.phone_number} />
              <InfoRow label="Metals" value={selectedQuote.metal_type.join(", ")} />
              <InfoRow label="Weight" value={`${selectedQuote.estimated_weight} kg`} />
              <InfoRow label="Address" value={selectedQuote.pickup_address} />
              <InfoRow label="Preferred Date" value={selectedQuote.preferred_pickup_date} />
              {selectedQuote.additional_notes && <InfoRow label="Notes" value={selectedQuote.additional_notes} />}
              <InfoRow label="Submitted" value={formatDisplayDate(selectedQuote.created_at)} />
            </div>

            {/* Admin Management Fields */}
            <div className="space-y-4">
              <h3 className="font-semibold text-red-400">Internal Management</h3>

              <Field label="Quotation Status">
                <select value={mgmtRecord.quotation_status ?? "Pending"} onChange={(e) => setMgmtRecord((p) => ({ ...p, quotation_status: e.target.value as QuoteStatus }))} className={selectCls}>
                  {["Pending","Reviewing","Quoted","Accepted","Rejected","Completed","Cancelled"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="Payment Status">
                <select value={mgmtRecord.payment_status ?? "Unpaid"} onChange={(e) => setMgmtRecord((p) => ({ ...p, payment_status: e.target.value as PaymentStatus }))} className={selectCls}>
                  {["Unpaid","Partial","Paid","Refunded"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="Customer Priority">
                <select value={mgmtRecord.customer_priority ?? "Normal"} onChange={(e) => setMgmtRecord((p) => ({ ...p, customer_priority: e.target.value as CustomerPriority }))} className={selectCls}>
                  {["Low","Normal","High","Urgent"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Quotation Amount (SGD)">
                  <input type="number" value={mgmtRecord.quotation_amount ?? ""} onChange={(e) => setMgmtRecord((p) => ({ ...p, quotation_amount: parseFloat(e.target.value) }))} className={inputCls} placeholder="0.00" />
                </Field>
                <Field label="Currency">
                  <input type="text" value={mgmtRecord.quotation_currency ?? "SGD"} onChange={(e) => setMgmtRecord((p) => ({ ...p, quotation_currency: e.target.value }))} className={inputCls} />
                </Field>
              </div>

              <Field label="Assigned Staff">
                <input type="text" value={mgmtRecord.assigned_staff ?? ""} onChange={(e) => setMgmtRecord((p) => ({ ...p, assigned_staff: e.target.value }))} className={inputCls} placeholder="Staff name" />
              </Field>

              <Field label="Pickup Vehicle">
                <input type="text" value={mgmtRecord.pickup_vehicle ?? ""} onChange={(e) => setMgmtRecord((p) => ({ ...p, pickup_vehicle: e.target.value }))} className={inputCls} placeholder="Vehicle plate / type" />
              </Field>

              <Field label="Pickup Schedule">
                <input type="datetime-local" value={mgmtRecord.pickup_schedule?.slice(0,16) ?? ""} onChange={(e) => setMgmtRecord((p) => ({ ...p, pickup_schedule: e.target.value }))} className={inputCls} />
              </Field>

              <Field label="Follow-up Date">
                <input type="date" value={mgmtRecord.follow_up_date ?? ""} onChange={(e) => setMgmtRecord((p) => ({ ...p, follow_up_date: e.target.value }))} className={inputCls} />
              </Field>

              <Field label="Completed Date">
                <input type="date" value={mgmtRecord.completed_date ?? ""} onChange={(e) => setMgmtRecord((p) => ({ ...p, completed_date: e.target.value }))} className={inputCls} />
              </Field>

              <Field label="Internal Notes">
                <textarea rows={4} value={mgmtRecord.internal_notes ?? ""} onChange={(e) => setMgmtRecord((p) => ({ ...p, internal_notes: e.target.value }))} className={`${inputCls} resize-none`} placeholder="Internal notes visible only to admin…" />
              </Field>

              {saveMsg && (
                <p className={`text-sm ${saveMsg.includes("success") ? "text-green-400" : "text-red-400"}`}>{saveMsg}</p>
              )}

              <button
                onClick={handleSaveMgmt}
                disabled={saving}
                className="w-full rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-28 shrink-0 text-gray-400">{label}:</span>
      <span className="text-white break-all">{value}</span>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-400">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
const selectCls = "w-full rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-sm text-white outline-none focus:border-red-500 transition-colors"
