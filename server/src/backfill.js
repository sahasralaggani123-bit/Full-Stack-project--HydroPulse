import { query } from './db.js'
import { recordReading } from './telemetryService.js'

const rand = (min, max) => min + Math.random() * (max - min)
const round = (n, d) => Number(n.toFixed(d))

// On the very first run the telemetry table is empty. This fills it with
// 24 hours of sample history (one reading every 30 minutes) so that the
// History and Monitoring pages have something to show straight away.
export async function ensureHistory(points = 48, stepMinutes = 30) {
  const { rows } = await query('SELECT COUNT(*)::int AS c FROM telemetry')
  if (rows[0].c > 0) return false

  const now = Date.now()
  for (let i = 0; i < points; i++) {
    const at = new Date(now - (points - i) * stepMinutes * 60000)
    const phase = i / 6
    const values = {
      ph: round(6.2 + 0.18 * Math.sin(phase) + rand(-0.05, 0.05), 2),
      tds: Math.round(720 + 35 * Math.sin(phase + 1) + rand(-10, 10)),
      temperature: round(24 + 1.2 * Math.sin(phase - 0.5) + rand(-0.2, 0.2), 1),
      waterLevel: Math.round(90 - i * 0.15),
    }
    // A few deliberate out-of-range moments so alerts/history show variety.
    if (i === 8) values.tds = 560
    if (i === 12) values.temperature = 28.4
    if (i === 19) values.temperature = 26.6
    if (i === 27) values.ph = 7.2
    if (i === 33) values.ph = 6.8
    await recordReading(values, { recordedAt: at })
  }

  await query(
    `INSERT INTO alerts (parameter, title, description, severity, created_at)
     VALUES ('system', 'Sensor Connection Established', 'HydroPulse started receiving readings from the reservoir sensors.', 'Normal', $1)`,
    [new Date(now - points * stepMinutes * 60000)],
  )
  return true
}
