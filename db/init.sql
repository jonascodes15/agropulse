-- AgroPulse database schema.
-- Runs automatically on first Postgres container start (mounted into
-- /docker-entrypoint-initdb.d/ by docker-compose).

CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Raw-ish sensor readings, one row per metric per reading. This is what the
-- ETL consumer writes to and the API reads from.
CREATE TABLE IF NOT EXISTS field_readings (
    time     TIMESTAMPTZ NOT NULL,
    field_id TEXT NOT NULL,
    metric   TEXT NOT NULL,             -- soil_moisture | canopy_temp | nitrogen_index | irrigation_draw
    value    DOUBLE PRECISION NOT NULL,
    unit     TEXT NOT NULL,
    status   TEXT NOT NULL DEFAULT 'nominal'  -- nominal | watch | alert
);

-- Turns the table into a hypertable (Timescale's partitioned-by-time table),
-- which is what makes time-range queries on large sensor volumes fast.
SELECT create_hypertable('field_readings', 'time', if_not_exists => TRUE);

CREATE INDEX IF NOT EXISTS idx_field_readings_field_metric_time
    ON field_readings (field_id, metric, time DESC);

-- Output of the nightly Airflow batch job — one row per projected week.
CREATE TABLE IF NOT EXISTS yield_forecast (
    computed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    field_id     TEXT NOT NULL,
    week_label   TEXT NOT NULL,
    low_tons_ha  DOUBLE PRECISION NOT NULL,
    mid_tons_ha  DOUBLE PRECISION NOT NULL,
    high_tons_ha DOUBLE PRECISION NOT NULL,
    PRIMARY KEY (field_id, week_label)
);
