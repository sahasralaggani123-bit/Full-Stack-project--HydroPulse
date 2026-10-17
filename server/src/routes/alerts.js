import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

// GET /api/alerts?severity=All|Critical|Warning|Normal&limit=50
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50))
    const params = []
    let where = ''
    if (['Normal', 'Warning', 'Critical'].includes(req.query.severity)) {
      params.push(req.query.severity)
      where = 'WHERE severity = $1'
    }

    const { rows } = await query(
      `SELECT id, parameter, title, description, severity, created_at
       FROM alerts ${where} ORDER BY created_at DESC, id DESC LIMIT $${params.length + 1}`,
      [...params, limit],
    )
    const countRows = await query('SELECT severity, COUNT(*)::int AS count FROM alerts GROUP BY severity')
    const counts = { Critical: 0, Warning: 0, Normal: 0 }
    countRows.rows.forEach((r) => (counts[r.severity] = r.count))

    res.json({
      alerts: rows.map((r) => ({
        id: r.id,
        parameter: r.parameter,
        title: r.title,
        description: r.description,
        severity: r.severity,
        createdAt: new Date(r.created_at).toISOString(),
      })),
      counts,
    })
  } catch (err) {
    next(err)
  }
})

export default router
