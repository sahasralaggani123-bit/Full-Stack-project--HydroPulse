-- HydroPulse database schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id          INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  farm_name        VARCHAR(120) NOT NULL DEFAULT 'My Hydroponic Farm',
  notify_critical  BOOLEAN      NOT NULL DEFAULT TRUE,
  notify_warning   BOOLEAN      NOT NULL DEFAULT TRUE,
  daily_summary    BOOLEAN      NOT NULL DEFAULT FALSE,
  temp_unit        VARCHAR(12)  NOT NULL DEFAULT 'Celsius',
  refresh_interval VARCHAR(20)  NOT NULL DEFAULT '5 minutes',
  dark_mode        BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS telemetry (
  id          BIGSERIAL PRIMARY KEY,
  ph          NUMERIC(4,2) NOT NULL,
  tds         INTEGER      NOT NULL,
  temperature NUMERIC(4,1) NOT NULL,
  water_level INTEGER      NOT NULL,
  status      VARCHAR(10)  NOT NULL CHECK (status IN ('Normal', 'Warning', 'Critical')),
  recorded_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_telemetry_recorded_at ON telemetry (recorded_at DESC);

CREATE TABLE IF NOT EXISTS alerts (
  id           SERIAL PRIMARY KEY,
  parameter    VARCHAR(20)  NOT NULL,
  title        VARCHAR(120) NOT NULL,
  description  TEXT         NOT NULL,
  severity     VARCHAR(10)  NOT NULL CHECK (severity IN ('Normal', 'Warning', 'Critical')),
  telemetry_id BIGINT REFERENCES telemetry(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts (created_at DESC);
