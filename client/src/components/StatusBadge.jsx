const styles = {
  Normal: 'bg-moss-50 text-moss-700 ring-1 ring-inset ring-moss-200',
  Warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  Critical: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
}

const dotStyles = {
  Normal: 'bg-moss-500',
  Warning: 'bg-amber-500',
  Critical: 'bg-rose-500',
}

export default function StatusBadge({ status = 'Normal', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || styles.Normal} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status] || dotStyles.Normal}`} />
      {status}
    </span>
  )
}
