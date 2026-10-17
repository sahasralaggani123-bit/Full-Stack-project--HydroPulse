import { query } from './db.js'
import { decorate, recordReading } from './telemetryService.js'

// The "ideal" values the simulated reservoir drifts around.
const TARGET = { ph: 6.2, tds: 720, temperature: 24, waterLevel: 82 }

const rand = (min, max) => min + Math.random() * (max - min)
const round = (n, d) => Number(n.toFixed(d))

// Moves the simulated values a small step. Now and then it pushes one
// sensor out of range so that alerts can be demonstrated.
function step(prev) {
  const next = { ...prev }
  next.ph = prev.ph + (TARGET.ph - prev.ph) * 0.15 + rand(-0.07, 0.07)
  next.tds = prev.tds + (TARGET.tds - prev.tds) * 0.15 + rand(-10, 10)
  next.temperature = prev.temperature + (TARGET.temperature - prev.temperature) * 0.15 + rand(-0.25, 0.25)
  next.waterLevel = prev.waterLevel - 0.05
  if (next.waterLevel < 35) next.waterLevel = 90 // simulated refill

  if (Math.random() < 0.04) {
    const key = ['ph', 'tds', 'temperature'][Math.floor(Math.random() * 3)]
    const jump = { ph: 0.7, tds: 220, temperature: 3.2 }[key]
    next[key] += (Math.random() < 0.5 ? -1 : 1) * jump
  }
  return next
}

const toReading = (s) => ({
  ph: round(s.ph, 2),
  tds: Math.round(s.tds),
  temperature: round(s.temperature, 1),
  waterLevel: Math.round(s.waterLevel),
})

// Starts generating a reading every intervalMs, saving each one to PostgreSQL
// and passing it to onReading (used to push it to the browser via Socket.IO).
export async function startSimulator(onReading, intervalMs = 5000) {
  let state = { ...TARGET }

  const last = await query('SELECT * FROM telemetry ORDER BY recorded_at DESC, id DESC LIMIT 1')
  if (last.rowCount > 0) {
    const r = decorate(last.rows[0])
    state = { ph: r.ph, tds: r.tds, temperature: r.temperature, waterLevel: r.waterLevel }
  }

  const timer = setInterval(async () => {
    try {
      state = step(state)
      const reading = await recordReading(toReading(state))
      onReading(reading)
    } catch (err) {
      console.error('Simulator error:', err.message)
    }
  }, intervalMs)

  return () => clearInterval(timer)
}
