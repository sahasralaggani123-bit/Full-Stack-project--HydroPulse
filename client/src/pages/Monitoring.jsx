import DashboardLayout from '../components/DashboardLayout.jsx'
import LineChart from '../components/LineChart.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import useTelemetry from '../hooks/useTelemetry.js'
import { SENSORS } from '../data/sensorMeta.js'
import { fmtShortTime } from '../utils/format.js'

export default function Monitoring() {
  const { series, latest, loading, error, connected } = useTelemetry(24)
  const labels = series.map((r) => fmtShortTime(r.recordedAt))

  return (
    <DashboardLayout title="Monitoring">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-stem">Trend of the last {series.length || 24} readings for each sensor, updating live.</p>
        <span className="inline-flex items-center gap-2 text-sm text-stem">
          <span className={`h-2 w-2 rounded-full ${connected ? 'bg-moss-500' : 'bg-amber-500'}`} />
          {connected ? 'Live' : 'Reconnecting…'}
        </span>
      </div>

      {error && <p className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {loading && <p className="text-stem">Loading readings…</p>}

      <div className="grid gap-6 xl:grid-cols-2">
        {SENSORS.map(({ field, icon: Icon, color, unit, label, range }) => (
          <div key={field} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{label}</p>
                  <p className="text-xs text-stem/70">Safe range: {range}</p>
                </div>
              </div>
              {latest && (
                <div className="text-right">
                  <p className="text-2xl font-semibold text-ink">
                    {latest[field]}
                    <span className="ml-1 text-sm font-normal text-stem">{unit}</span>
                  </p>
                  <StatusBadge status={latest.statuses[field]} className="mt-1" />
                </div>
              )}
            </div>

            <div className="mt-4">
              <LineChart data={series.map((r) => r[field])} labels={labels} color={color} />
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
