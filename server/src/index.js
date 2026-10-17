import 'dotenv/config'
import http from 'http'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import cookie from 'cookie'
import { Server } from 'socket.io'

import { pool } from './db.js'
import { initDb } from './initDb.js'
import { ensureHistory } from './backfill.js'
import { startSimulator } from './simulator.js'
import { COOKIE_NAME, verifyToken } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import telemetryRoutes from './routes/telemetry.js'
import alertRoutes from './routes/alerts.js'
import settingsRoutes from './routes/settings.js'

const PORT = process.env.PORT || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.error('Missing JWT_SECRET or DATABASE_URL. Copy server/.env.example to server/.env and fill it in.')
  process.exit(1)
}

const app = express()
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/telemetry', telemetryRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/settings', settingsRoutes)

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: CLIENT_ORIGIN, credentials: true } })
app.set('io', io)

// Only logged-in users may receive the live telemetry stream.
io.use((socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || '')
  const payload = cookies[COOKIE_NAME] ? verifyToken(cookies[COOKIE_NAME]) : null
  if (!payload) return next(new Error('unauthorized'))
  next()
})

async function main() {
  try {
    await initDb()
    const seeded = await ensureHistory()
    if (seeded) console.log('Inserted 24 hours of sample history into PostgreSQL.')
  } catch (err) {
    console.error('Could not connect to PostgreSQL:', err.message)
    console.error('Check DATABASE_URL in server/.env and make sure the "hydropulse" database exists.')
    process.exit(1)
  }

  const interval = Number(process.env.SIMULATOR_INTERVAL_MS) || 5000
  await startSimulator((reading) => io.emit('telemetry', reading), interval)

  server.listen(PORT, () => {
    console.log(`HydroPulse API running on http://localhost:${PORT}`)
    console.log(`Simulated sensor reading saved every ${interval / 1000}s`)
  })
}

main()

process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})
