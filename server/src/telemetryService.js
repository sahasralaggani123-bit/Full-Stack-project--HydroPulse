import { query } from './db.js'
import { evaluate, describeViolation } from './thresholds.js'

// Convert a database row into the JSON shape the frontend uses.
export function decorate(row) {
  const values = {
    ph: Number(row.ph),
    tds: Number(row.tds),
    temperature: Number(row.temperature),
    waterLevel: Number(row.water_level),
  }
  const { statuses } = evaluate(values)
  return {
    id: Number(row.id),
    ...values,
    status: row.status,
    statuses,
    recordedAt: new Date(row.recorded_at).toISOString(),
  }
}

// Validate -> evaluate -> INSERT into PostgreSQL -> raise alerts. Returns the saved reading.
export async function recordReading(values, { recordedAt = new Date() } = {}) {
  const { overall, statuses } = evaluate(values)

  const { rows } = await query(
    `INSERT INTO telemetry (ph, tds, temperature, water_level, status, recorded_at)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [values.ph, values.tds, values.temperature, values.waterLevel, overall, recordedAt],
  )
  const row = rows[0]
  await raiseAlerts(row.id, values, statuses, recordedAt)
  return decorate(row)
}

// One alert per out-of-range sensor; the same alert is not repeated within 10 minutes.
async function raiseAlerts(telemetryId, values, statuses, at) {
  for (const [key, severity] of Object.entries(statuses)) {
    if (severity === 'Normal') continue
    const { title, description } = describeViolation(key, values[key])

    const duplicate = await query(
      `SELECT 1 FROM alerts
       WHERE title = $1 AND severity = $2
         AND created_at BETWEEN $3::timestamptz - INTERVAL '10 minutes' AND $3::timestamptz
       LIMIT 1`,
      [title, severity, at],
    )
    if (duplicate.rowCount > 0) continue

    await query(
      `INSERT INTO alerts (parameter, title, description, severity, telemetry_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [key, title, description, severity, telemetryId, at],
    )
  }
}
