import { IconAlertTriangle, IconCheckCircle } from './icons.jsx'

const severityStyles = {
  Critical: {
    ring: 'ring-rose-200',
    iconBg: 'bg-rose-50 text-rose-600',
    badge: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
  },
  Warning: {
    ring: 'ring-amber-200',
    iconBg: 'bg-amber-50 text-amber-600',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  },
  Normal: {
    ring: 'ring-moss-200',
    iconBg: 'bg-moss-50 text-moss-700',
    badge: 'bg-moss-50 text-moss-700 ring-1 ring-inset ring-moss-200',
  },
}

export default function AlertCard({ title, description, severity, time }) {
  const styles = severityStyles[severity] || severityStyles.Normal
  const Icon = severity === 'Normal' ? IconCheckCircle : IconAlertTriangle

  return (
    <div className={`card flex items-start gap-4 p-5 ring-1 ${styles.ring}`}>
      <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${styles.iconBg}`}>
        <Icon className="h-5 w-5" />
      </span>

      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-ink">{title}</p>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}>{severity}</span>
        </div>
        <p className="mt-1 text-sm text-stem">{description}</p>
        <p className="mt-2 text-xs text-stem/70">{time}</p>
      </div>
    </div>
  )
}
