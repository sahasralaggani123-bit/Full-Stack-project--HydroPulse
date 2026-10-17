import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { decorate, recordReading } from '../telemetryService.js'

const router = Router()

// POST /api/telemetry/ingest  -> lets real hardware (e.g. ESP32) send a reading.
// Protected by the x-api-key header instead of a user login.
router.post('/ingest', async (req, res, next) => {
  try {
    const key = process.env.SENSOR_API_KEY
    if (!key) return res.status(503).json({ error: 'Sensor ingest is disabled (SENSOR_API_KEY not set).' })
    if (req.headers['x-api-key'] !== key) return res.status(401).json({ error: 'Invalid API key.' })

    const { ph, tds, temperature, waterLevel } = req.body || {}
    const inRange = (v, min, max) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max
    if (!inRange(ph, 0, 14) || !inRange(tds, 0, 5000) || !inRange(temperature, -10, 80) || !inRange(waterLevel, 0, 100)) {
      return res.status(400).json({
        error: 'Body must be numbers: ph (0-14), tds (0-5000), temperature (-10-80), waterLevel (0-100).',
      })
    }

    const reading = await recordReading({
      ph: Number(ph.toFixed(2)),
      tds: Math.round(tds),
      temperature: Number(temperature.toFixed(1)),
      waterLevel: Math.round(waterLevel),
    })
    req.app.get('io').emit('telemetry', reading)
    res.status(201).json({ reading })
  } catch (err) {
    next(err)
  }
})

// Everything below needs a logged-in user.
router.use(requireAuth)

// GET /api/telemetry/latest
router.get('/latest', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM telemetry ORDER BY recorded_at DESC, id DESC LIMIT 1')
    res.json({ reading: rows[0] ? decorate(rows[0]) : null })
  } catch (err) {
    next(err)
  }
})

// GET /api/telemetry/series?limit=24  -> last N readings, oldest first (for charts)
router.get('/series', async (req, res, next) => {
  try {
    const limit = Math.min(200, Math.max(2, parseInt(req.query.limit, 10) || 24))
    const { rows } = await query(
      `SELECT * FROM (
         SELECT * FROM telemetry ORDER BY recorded_at DESC, id DESC LIMIT $1
       ) t ORDER BY recorded_at ASC, id ASC`,
      [limit],
    )
    res.json({ readings: rows.map(decorate) })
  } catch (err) {
    next(err)
  }
})

// GET /api/telemetry/history?page=1&pageSize=12&status=All|Normal|Warning|Critical
router.get('/history', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 12))
    const params = []
    let where = ''
    if (['Normal', 'Warning', 'Critical'].includes(req.query.status)) {
      params.push(req.query.status)
      where = 'WHERE status = $1'
    }

    const total = await query(`SELECT COUNT(*)::int AS count FROM telemetry ${where}`, params)
    const { rows } = await query(
      `SELECT * FROM telemetry ${where}
       ORDER BY recorded_at DESC, id DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, pageSize, (page - 1) * pageSize],
    )
    res.json({ rows: rows.map(decorate), total: total.rows[0].count, page, pageSize })
  } catch (err) {
    next(err)
  }
})

export default router
