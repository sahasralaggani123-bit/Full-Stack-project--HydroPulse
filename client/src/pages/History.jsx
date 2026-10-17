import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { api } from '../api.js'
import { fmtDate, fmtTime } from '../utils/format.js'

const statusOptions = ['All', 'Normal', 'Warning', 'Critical']
const PAGE_SIZE = 12

export default function History() {
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ rows: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  // Every time the filter / page changes, fetch that slice from PostgreSQL.
  useEffect(() => {
    setLoading(true)
    setError('')
    api
      .get(`/telemetry/history?page=${page}&pageSize=${PAGE_SIZE}&status=${filter}`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [filter, page, refreshKey])

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE))

  return (
    <DashboardLayout title="History">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-stem">Past sensor readings stored in the database ({data.total} matching).</p>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setFilter(opt)
                setPage(1)
              }}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === opt
                  ? 'bg-moss-700 text-white'
                  : 'bg-white text-stem ring-1 ring-inset ring-moss-200 hover:bg-moss-50'
              }`}
            >
              {opt}
            </button>
          ))}
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-moss-800 ring-1 ring-inset ring-moss-200 hover:bg-moss-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <div className={`card overflow-x-auto ${loading ? 'opacity-60' : ''}`}>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-moss-100 text-xs uppercase tracking-wide text-stem/70">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">pH</th>
              <th className="px-5 py-3 font-medium">TDS (ppm)</th>
              <th className="px-5 py-3 font-medium">Temp (°C)</th>
              <th className="px-5 py-3 font-medium">Water Level</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-moss-100">
            {data.rows.map((r) => (
              <tr key={r.id} className="hover:bg-moss-50/60">
                <td className="px-5 py-3 text-ink">{fmtDate(r.recordedAt)}</td>
                <td className="px-5 py-3 text-stem">{fmtTime(r.recordedAt)}</td>
                <td className="px-5 py-3 text-ink">{r.ph}</td>
                <td className="px-5 py-3 text-ink">{r.tds}</td>
                <td className="px-5 py-3 text-ink">{r.temperature}</td>
                <td className="px-5 py-3 text-ink">{r.waterLevel}%</td>
                <td className="px-5 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
            {!loading && data.rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-stem">
                  No readings match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-stem">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full bg-white px-4 py-1.5 font-medium text-moss-800 ring-1 ring-inset ring-moss-200 hover:bg-moss-50 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full bg-white px-4 py-1.5 font-medium text-moss-800 ring-1 ring-inset ring-moss-200 hover:bg-moss-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
