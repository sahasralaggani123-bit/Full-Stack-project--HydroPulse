import Sparkline from './Sparkline.jsx'
import StatusBadge from './StatusBadge.jsx'

const accentColors = {
  Normal: '#307143',
  Warning: '#d97706',
  Critical: '#e11d48',
}

export default function SensorCard({ icon: Icon, label, value, unit, status, range, trend = [] }) {
  const color = accentColors[status] || accentColors.Normal

  return (
    <div className="card flex flex-col justify-between p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-stem">{label}</p>
            <p className="text-xs text-stem/70">{range}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <p className="text-3xl font-semibold text-ink">
          {value}
          <span className="ml-1 text-base font-normal text-stem">{unit}</span>
        </p>
      </div>

      <div className="mt-3 -mb-1">
        <Sparkline data={trend} color={color} />
      </div>
    </div>
  )
}
