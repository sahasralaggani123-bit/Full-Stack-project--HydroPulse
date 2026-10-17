// Larger dependency-free SVG line chart with axis labels, for the Monitoring page.
export default function LineChart({ data = [], labels = [], color = '#307143', unit = '', height = 220 }) {
  if (data.length < 2) return null
  const width = 560
  const padding = { top: 16, right: 16, bottom: 28, left: 40 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = innerW / (data.length - 1 || 1)

  const points = data.map((v, i) => {
    const x = padding.left + i * step
    const y = padding.top + innerH - ((v - min) / range) * innerH
    return { x, y }
  })

  const linePath = `M${points.map((p) => `${p.x},${p.y}`).join(' L')}`
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + innerH} L${padding.left},${padding.top + innerH} Z`

  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Sensor trend chart">
      <defs>
        <linearGradient id={`area-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridLines.map((g) => {
        const y = padding.top + innerH * g
        const value = (max - g * range).toFixed(1)
        return (
          <g key={g}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e6efe8" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#5b6b60">{value}{unit}</text>
          </g>
        )
      })}

      <path d={areaPath} fill={`url(#area-${color.replace('#', '')})`} stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fff" stroke={color} strokeWidth="2" />
      ))}

      {labels.map((l, i) => (i % Math.ceil(labels.length / 6) === 0 || i === labels.length - 1) && (
        <text key={l + i} x={padding.left + i * step} y={height - 8} textAnchor="middle" fontSize="10" fill="#5b6b60">{l}</text>
      ))}
    </svg>
  )
}
