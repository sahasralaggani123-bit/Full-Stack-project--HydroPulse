import { Router } from 'express'
import { pool, query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

const shape = (r) => ({
  name: r.name,
  email: r.email,
  farmName: r.farm_name,
  notifyCritical: r.notify_critical,
  notifyWarning: r.notify_warning,
  dailySummary: r.daily_summary,
  tempUnit: r.temp_unit,
  refreshInterval: r.refresh_interval,
  darkMode: r.dark_mode,
})

const SELECT = `
  SELECT u.name, u.email, s.farm_name, s.notify_critical, s.notify_warning,
         s.daily_summary, s.temp_unit, s.refresh_interval, s.dark_mode
  FROM users u JOIN user_settings s ON s.user_id = u.id
  WHERE u.id = $1`

// GET /api/settings
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(SELECT, [req.userId])
    if (!rows[0]) return res.status(404).json({ error: 'Settings not found.' })
    res.json({ settings: shape(rows[0]) })
  } catch (err) {
    next(err)
  }
})

// PUT /api/settings
router.put('/', async (req, res, next) => {
  const b = req.body || {}
  if (typeof b.name !== 'string' || b.name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters.' })
  }
  if (typeof b.farmName !== 'string' || !b.farmName.trim()) {
    return res.status(400).json({ error: 'Farm name cannot be empty.' })
  }
  if (!['Celsius', 'Fahrenheit'].includes(b.tempUnit)) {
    return res.status(400).json({ error: 'Invalid temperature unit.' })
  }
  if (!['1 minute', '5 minutes', '15 minutes'].includes(b.refreshInterval)) {
    return res.status(400).json({ error: 'Invalid refresh interval.' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('UPDATE users SET name = $1 WHERE id = $2', [b.name.trim(), req.userId])
    await client.query(
      `INSERT INTO user_settings
         (user_id, farm_name, notify_critical, notify_warning, daily_summary, temp_unit, refresh_interval, dark_mode)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id) DO UPDATE SET
         farm_name = EXCLUDED.farm_name,
         notify_critical = EXCLUDED.notify_critical,
         notify_warning = EXCLUDED.notify_warning,
         daily_summary = EXCLUDED.daily_summary,
         temp_unit = EXCLUDED.temp_unit,
         refresh_interval = EXCLUDED.refresh_interval,
         dark_mode = EXCLUDED.dark_mode`,
      [
        req.userId,
        b.farmName.trim(),
        !!b.notifyCritical,
        !!b.notifyWarning,
        !!b.dailySummary,
        b.tempUnit,
        b.refreshInterval,
        !!b.darkMode,
      ],
    )
    await client.query('COMMIT')

    const { rows } = await client.query(SELECT, [req.userId])
    res.json({ settings: shape(rows[0]) })
  } catch (err) {
    await client.query('ROLLBACK')
    next(err)
  } finally {
    client.release()
  }
})

export default router
