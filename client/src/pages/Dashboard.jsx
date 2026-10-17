import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout.jsx'
import SensorCard from '../components/SensorCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import useTelemetry from '../hooks/useTelemetry.js'
import { api } from '../api.js'
import { SENSORS } from '../data/sensorMeta.js'
import { fmtDateTime, fmtTime } from '../utils/format.js'
import { IconChevronRight } from '../components/icons.jsx'

export default function Dashboard() {
  const { series, latest, loading, error, connected } = useTelemetry(12)
  const [recentAlerts, setRecentAlerts] = useState([])

  // Recent alerts come from PostgreSQL; refresh them every 10 seconds.
  useEffect(() => {
    const load = () =>
      api.get('/alerts?limit=3').then((d) => setRecentAlerts(d.alerts)).catch(() => {})
    load()
    const timer = setInterval(load, 10000)
    return () => clearInterval(timer)
  }, [])

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">Welcome back!</h2>
        <p className="mt-1 text-stem">Here's the current status of your hydroponic system.</p>
      </div>

      {error && <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      {/* System status card */}
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-moss-50">
            <span className={`h-3 w-3 rounded-full ${connected ? 'bg-moss-500' : 'bg-amber-500'}`} />
          </span>
          <div>
            <p className="font-semibold text-ink">{connected ? 'System Online' : 'Reconnecting…'}</p>
            <p className="text-sm text-stem/80">
              {latest ? `Last updated ${fmtTime(latest.recordedAt)}` : loading ? 'Loading readings…' : 'No readings yet'}
            </p>
          </div>
        </div>

        {latest && (
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-stem/70">Nutrient status</p>
              <p className="mt-0.5 font-medium text-ink">
                {latest.statuses.tds === 'Normal' ? 'Balanced' : 'Needs attention'}
              </p>
            </div>
            <div>
              <p className="mb-0.5 text-stem/70">Overall status</p>
              <StatusBadge status={latest.status} />
            </div>
          </div>
        )}
      </div>

      {/* Sensor cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {SENSORS.map((s) => (
          <SensorCard
            key={s.field}
            icon={s.icon}
            label={s.label}
            unit={s.unit}
            range={s.range}
            value={latest ? latest[s.field] : '—'}
            status={latest ? latest.statuses[s.field] : 'Normal'}
            trend={series.map((r) => r[s.field])}
          />
        ))}
      </div>

      {/* Recent alerts preview */}
      <div className="card mt-6 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-ink">Recent alerts</h3>
          <Link to="/alerts" className="flex items-center gap-1 text-sm font-medium text-moss-700 hover:text-moss-900">
            View all
            <IconChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-4 divide-y divide-moss-100">
          {recentAlerts.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-ink">{a.title}</p>
                <p className="text-xs text-stem/80">{fmtDateTime(a.createdAt)}</p>
              </div>
              <StatusBadge status={a.severity} />
            </li>
          ))}
          {recentAlerts.length === 0 && <li className="py-3 text-sm text-stem">No alerts yet.</li>}
        </ul>
      </div>
    </DashboardLayout>
  )
}
