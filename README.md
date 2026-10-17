# HydroPulse — Hydroponic System Telemetry & Nutrient Monitor

Full-stack PBL project: **React + Node.js + Express.js + PostgreSQL**.

```
hydropulse-fullstack/
├── client/   React + Vite + Tailwind CSS (the website)
├── server/   Node.js + Express API, Socket.IO, PostgreSQL access
└── docs/     Project notes for the PPT / poster / report
```

Sensor readings are **simulated** by the server (no physical hardware). Every reading,
every user account and every alert is stored in PostgreSQL.

---

## 1. One-time setup

You need **Node.js 18+** and **PostgreSQL** installed.

### Create the database

Open **pgAdmin** → right-click *Databases* → *Create* → *Database…* → name it `hydropulse`.
Or in a terminal:

```bash
psql -U postgres -c "CREATE DATABASE hydropulse;"
```

### Configure the server

```bash
cd server
cp .env.example .env        # on Windows: copy .env.example .env
```

Open `server/.env` and set:

- `DATABASE_URL` → `postgresql://postgres:YOUR_PASSWORD@localhost:5432/hydropulse`
- `JWT_SECRET` → any long random text

### Install packages

```bash
cd server && npm install
cd ../client && npm install
```

## 2. Run it (two terminals)

```bash
# Terminal 1 — API on http://localhost:5000
cd server
npm run dev

# Terminal 2 — website on http://localhost:5173
cd client
npm run dev
```

On the first start the server creates all tables automatically and inserts 24 hours of
sample history. Open http://localhost:5173, click **Sign Up**, and you are in.

Optional demo account (for showing your guide): `cd server && npm run seed`
→ `demo@hydropulse.com` / `Demo@1234`

## 3. What is stored in PostgreSQL

| Table | Purpose |
|-------|---------|
| `users` | id, name, email (unique), **password_hash** (bcrypt), created_at |
| `user_settings` | per-user farm name, notification toggles, units, dark mode |
| `telemetry` | pH, TDS, temperature, water level, status, timestamp (one row per reading) |
| `alerts` | alerts raised when a reading leaves its safe range |

Login works by looking the email up in `users` and comparing the password with the stored
hash. Passwords are never saved in plain text.

## 4. API summary

| Method | Endpoint | Login needed | Description |
|--------|----------|:---:|-------------|
| POST | `/api/auth/signup` | – | Create account (inserts into `users`) |
| POST | `/api/auth/login` | – | Check credentials against `users` |
| POST | `/api/auth/logout` | – | Clear login cookie |
| GET | `/api/auth/me` | ✔ | Current user |
| GET | `/api/telemetry/latest` | ✔ | Newest reading |
| GET | `/api/telemetry/series?limit=24` | ✔ | Last N readings (charts) |
| GET | `/api/telemetry/history?page=&pageSize=&status=` | ✔ | Paged history |
| GET | `/api/alerts?severity=&limit=` | ✔ | Alerts + counts |
| GET / PUT | `/api/settings` | ✔ | Profile & preferences |
| POST | `/api/telemetry/ingest` | API key | For a real sensor (see below) |

Live updates: the server pushes each new reading over **Socket.IO** (`telemetry` event) to
logged-in browsers only.

## 5. Safe ranges (server/src/thresholds.js)

| Sensor | Normal | Warning outside | Critical outside |
|--------|--------|-----------------|------------------|
| pH | 5.5 – 6.5 | 5.5 – 6.5 | 5.0 – 7.0 |
| TDS (ppm) | 600 – 900 | 600 – 900 | 450 – 1100 |
| Water temp (°C) | 20 – 26 | 20 – 26 | 18 – 28 |
| Water level (%) | ≥ 40 | < 40 | < 25 |

## 6. Connecting a real sensor later (optional)

Set `SENSOR_API_KEY` in `server/.env`, then an ESP32/Arduino can send:

```
POST http://<server>:5000/api/telemetry/ingest
x-api-key: <your key>
{"ph": 6.3, "tds": 710, "temperature": 24.5, "waterLevel": 80}
```

The reading is validated, saved, checked for alerts and pushed live to the dashboard.
Turn off the simulator by deleting the `startSimulator(...)` line in `server/src/index.js`.

## 7. Troubleshooting

- **"Could not connect to PostgreSQL"** → check `DATABASE_URL`, the password, and that the `hydropulse` database exists.
- **Login page says "Request failed"** → the server (Terminal 1) is not running.
- **Port already in use** → change `PORT` in `server/.env` and the proxy target in `client/vite.config.js`.
