# HydroPulse — Project Notes (for PPT, Poster and Report)

Use this file so everyone describes the **same** project. Only claim what the software really does.

## Project title
HydroPulse – Hydroponic System Telemetry & Nutrient Monitor

## What it is
A full-stack web application that shows the condition of a hydroponic reservoir in one dashboard:
pH, TDS (nutrient concentration), water temperature and water level, with live trend charts,
stored history and automatic alerts.

## Abstract (points)
- HydroPulse is a web application for monitoring a hydroponic growing system.
- It tracks four parameters: pH, TDS, water temperature and water level.
- A React dashboard shows current values, live trend charts and system status.
- A Node.js and Express.js server exposes a REST API and streams live updates with Socket.IO.
- User accounts are stored in PostgreSQL; passwords are saved only as bcrypt hashes.
- Login is verified against the PostgreSQL users table and protected by JWT cookies.
- Every telemetry reading is stored in PostgreSQL with a timestamp and status.
- The server compares each reading with safe ranges and raises Warning or Critical alerts.
- History can be filtered by status and browsed page by page.
- Sensor values are currently simulated; a ready ingest endpoint allows real sensors later.

## Problem description
Growers must watch several water-quality values that change over time. Checking and recording
them separately makes it hard to see trends or notice a problem early. HydroPulse brings the
readings, history and alerts into one place.

## Technologies
| Layer | Technology |
|-------|-----------|
| Front-end | React 18, Vite, Tailwind CSS, React Router, Socket.IO client |
| Back-end / middleware | Node.js, Express.js, Socket.IO, JWT (jsonwebtoken), bcryptjs, cookie-parser, CORS |
| Database | PostgreSQL (driver: pg) |

## Architecture
```
 Simulator (every 5 s)  ──┐
 Real sensor (optional)  ─┴─► Express API ──► PostgreSQL
                               │   ▲            users · user_settings
        REST (fetch)  ◄────────┘   │            telemetry · alerts
        Socket.IO push ◄───────────┘
              │
        React dashboard (Dashboard · Monitoring · History · Alerts · Settings)
```

Data flow: generate reading → validate → compute status from thresholds → INSERT into
`telemetry` → create alert rows if out of range → push to browsers via Socket.IO → React updates.

Login flow: React form → `POST /api/auth/login` → SELECT user by email from `users` → bcrypt compare
→ signed JWT in an httpOnly cookie → protected routes accept requests that carry it.

## Database schema
See `server/src/schema.sql` (tables: users, user_settings, telemetry, alerts).

## Output screens to capture
1. Landing page · 2. Sign up · 3. Login (also a failed login) · 4. Dashboard with live values
5. Monitoring charts · 6. History table with filter · 7. Alerts page · 8. Settings page
9. pgAdmin showing the `users` table (password column is a hash) and the `telemetry` table

## Test cases (fill in Actual Result when you run them)
| # | Test | Expected |
|---|------|----------|
| 1 | Sign up with a new email | Row appears in `users`; redirected to dashboard |
| 2 | Sign up with the same email | Error: account already exists |
| 3 | Sign up with a password under 8 characters | Error shown, nothing saved |
| 4 | Log in with the wrong password | "Invalid email or password." |
| 5 | Log in with correct details | Dashboard opens |
| 6 | Open /dashboard while logged out | Redirected to login |
| 7 | Call `/api/telemetry/latest` without logging in | HTTP 401 |
| 8 | Watch the dashboard for 10 s | Values change; new rows in `telemetry` |
| 9 | Stop and restart the server | History is still there (stored in PostgreSQL) |
| 10 | POST an out-of-range reading to `/ingest` (pH 7.4) | Status Critical; alert created |
| 11 | Change a setting and Save, then log out and in | Setting is remembered |

## Honest limitations
- Sensor readings are simulated; no physical hardware is connected yet.
- The system monitors and alerts only; it does not control pumps or adjust pH/nutrients.
- Alert notifications are shown in the app; email/SMS sending is not implemented.
- Temperature-unit and refresh-interval settings are saved but do not yet change the display.
- Do not claim yield, water-saving or accuracy improvements without an experiment to support them.

## Future enhancements
Real sensor hardware (ESP32 + pH/TDS/temperature/level probes), email/SMS alerts, pump and dosing
control, multiple reservoirs per user, CSV export, role-based access, mobile app.
