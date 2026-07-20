"""
The serving layer. Read-only API over what the ETL consumer and the
Airflow batch job have written to Postgres — this is what the frontend
will eventually call instead of importing mockData.ts.
"""
import os
from datetime import datetime, timedelta, timezone

import psycopg2
import psycopg2.extras
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

PG_DSN = os.getenv("DATABASE_URL", "postgresql://agropulse:agropulse@postgres:5432/agropulse")

app = FastAPI(title="AgroPulse API")

# Wide open for local/demo use. Lock this down to your actual frontend
# origin before this ever sees a real deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_conn():
    return psycopg2.connect(PG_DSN, cursor_factory=psycopg2.extras.RealDictCursor)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/fields/{field_id}/readings/latest")
def latest_readings(field_id: str):
    conn = get_conn()
    with conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT DISTINCT ON (metric) metric, value, unit, status, time
            FROM field_readings
            WHERE field_id = %s
            ORDER BY metric, time DESC
            """,
            (field_id,),
        )
        rows = cur.fetchall()
    conn.close()
    if not rows:
        raise HTTPException(status_code=404, detail="No readings found for this field yet")
    return rows


@app.get("/fields/{field_id}/readings/history")
def history(field_id: str, metric: str, minutes: int = 60):
    since = datetime.now(timezone.utc) - timedelta(minutes=minutes)
    conn = get_conn()
    with conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT time, value
            FROM field_readings
            WHERE field_id = %s AND metric = %s AND time >= %s
            ORDER BY time ASC
            """,
            (field_id, metric, since),
        )
        rows = cur.fetchall()
    conn.close()
    return rows


@app.get("/fields/{field_id}/yield-forecast")
def yield_forecast(field_id: str):
    conn = get_conn()
    with conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT week_label, low_tons_ha, mid_tons_ha, high_tons_ha
            FROM yield_forecast
            WHERE field_id = %s
            ORDER BY computed_at ASC
            """,
            (field_id,),
        )
        rows = cur.fetchall()
    conn.close()
    return rows
