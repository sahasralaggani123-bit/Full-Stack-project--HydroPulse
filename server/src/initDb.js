import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Creates all tables if they do not exist yet. Safe to run many times.
export async function initDb() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(sql)
}

// Allows:  npm run db:init
if (process.argv[1] && process.argv[1].endsWith('initDb.js')) {
  initDb()
    .then(() => {
      console.log('Database tables are ready.')
      return pool.end()
    })
    .catch((err) => {
      console.error('Could not initialise database:', err.message)
      process.exit(1)
    })
}
