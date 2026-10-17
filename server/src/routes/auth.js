import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool, query } from '../db.js'
import { requireAuth, COOKIE_NAME, cookieOptions } from '../middleware/auth.js'

const router = Router()
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function issueToken(res, userId) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.cookie(COOKIE_NAME, token, cookieOptions)
}

const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  darkMode: row.dark_mode ?? false,
})

// POST /api/auth/signup  -> inserts a new row in the users table
router.post('/signup', async (req, res, next) => {
  const { name, email, password } = req.body || {}

  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter your name (at least 2 characters).' })
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const passwordHash = await bcrypt.hash(password, 10) // never store the plain password
    const { rows } = await client.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name.trim(), email.trim().toLowerCase(), passwordHash],
    )
    await client.query('INSERT INTO user_settings (user_id) VALUES ($1)', [rows[0].id])
    await client.query('COMMIT')

    issueToken(res, rows[0].id)
    res.status(201).json({ user: publicUser(rows[0]) })
  } catch (err) {
    await client.query('ROLLBACK')
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }
    next(err)
  } finally {
    client.release()
  }
})

// POST /api/auth/login  -> checks email + password against the users table
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ error: 'Please enter your email and password.' })
    }

    const { rows } = await query(
      `SELECT u.id, u.name, u.email, u.password_hash, s.dark_mode
       FROM users u LEFT JOIN user_settings s ON s.user_id = u.id
       WHERE u.email = $1`,
      [email.trim().toLowerCase()],
    )

    const user = rows[0]
    const ok = user && (await bcrypt.compare(password, user.password_hash))
    if (!ok) return res.status(401).json({ error: 'Invalid email or password.' })

    issueToken(res, user.id)
    res.json({ user: publicUser(user) })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions
  res.clearCookie(COOKIE_NAME, clearOptions)
  res.json({ ok: true })
})

// GET /api/auth/me  -> who is logged in right now?
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT u.id, u.name, u.email, s.dark_mode
       FROM users u LEFT JOIN user_settings s ON s.user_id = u.id
       WHERE u.id = $1`,
      [req.userId],
    )
    if (!rows[0]) return res.status(401).json({ error: 'Account no longer exists.' })
    res.json({ user: publicUser(rows[0]) })
  } catch (err) {
    next(err)
  }
})

export default router
