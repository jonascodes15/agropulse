"""
Nightly batch job: recompute the projected yield curve from the day's
accumulated sensor readings. This is the "batch" half of the pipeline —
the consumer handles streaming inserts, this handles periodic recomputation.

NOTE: the model here is a deliberately simple heuristic, not a trained ML
model — it exists to demonstrate the batch-orchestration pattern (read from
Postgres, compute, write back on a schedule), which is the actual point of
this DAG for portfolio purposes.
"""
from datetime import datetime, timedelta

import psycopg2
from airflow import DAG
from airflow.operators.python import PythonOperator

DB_URL = "postgresql://agropulse:agropulse@postgres:5432/agropulse"
FIELD_ID = "field-04"
WEEK_LABELS = ["W1", "W4", "W8", "W12", "W16", "W20", "W24"]
BASE_MID_TONS_HA = [0, 1.1, 3.4, 5.9, 8.1, 9.6, 10.2]  # same baseline curve as the frontend mock


def recompute_forecast():
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    cur = conn.cursor()

    # Use recent soil moisture as a simple stand-in signal for "how the
    # season is trending" — a real model would use far more than this.
    cur.execute(
        """
        SELECT AVG(value) FROM field_readings
        WHERE field_id = %s AND metric = 'soil_moisture'
          AND time >= now() - interval '24 hours'
        """,
        (FIELD_ID,),
    )
    row = cur.fetchone()
    avg_moisture = row[0] if row and row[0] is not None else 35.0

    # Healthier average moisture nudges the projected curve up, within a
    # capped +/-15% band so one noisy day can't swing the forecast wildly.
    moisture_factor = max(0.85, min(1.15, avg_moisture / 35.0))

    for week, base_mid in zip(WEEK_LABELS, BASE_MID_TONS_HA):
        mid = round(base_mid * moisture_factor, 2)
        low = round(mid * 0.82, 2)
        high = round(mid * 1.14, 2)
        cur.execute(
            """
            INSERT INTO yield_forecast (field_id, week_label, low_tons_ha, mid_tons_ha, high_tons_ha, computed_at)
            VALUES (%s, %s, %s, %s, %s, now())
            ON CONFLICT (field_id, week_label)
            DO UPDATE SET low_tons_ha = EXCLUDED.low_tons_ha,
                          mid_tons_ha = EXCLUDED.mid_tons_ha,
                          high_tons_ha = EXCLUDED.high_tons_ha,
                          computed_at = now()
            """,
            (FIELD_ID, week, low, mid, high),
        )

    cur.close()
    conn.close()


default_args = {
    "owner": "agropulse",
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="recompute_yield_forecast",
    description="Nightly batch job recomputing the projected yield curve from accumulated sensor readings.",
    default_args=default_args,
    start_date=datetime(2026, 1, 1),
    schedule="0 2 * * *",  # 2am daily
    catchup=False,
    tags=["agropulse", "batch"],
) as dag:
    recompute = PythonOperator(
        task_id="recompute_yield_forecast",
        python_callable=recompute_forecast,
    )
