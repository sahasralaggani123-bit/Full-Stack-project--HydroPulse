import bcrypt from 'bcryptjs'
import { pool } from './db.js'
import { initDb } from './initDb.js'
import { ensureHistory } from './backfill.js'

// Creates a demo account (handy for showing the project to your guide).
//   email: demo@hydropulse.com    password: Demo@1234
async function seed() {
  await initDb()
  const hash = await bcrypt.hash('Demo@1234', 10)
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ('Demo Grower', 'demo@hydropulse.com', $1)
     ON CONFLICT (email) DO NOTHING RETURNING id`,
    [hash],
  )
  if (rows[0]) {
    await pool.query(
      `INSERT INTO user_settings (user_id, farm_name) VALUES ($1, 'Greenline Hydro Farm')`,
      [rows[0].id],
    )
    console.log('Demo user created: demo@hydropulse.com / Demo@1234')
  } else {
    console.log('Demo user already exists.')
  }
  if (await ensureHistory()) console.log('Sample telemetry history inserted.')
  await pool.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
