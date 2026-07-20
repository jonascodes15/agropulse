"""
The ETL layer. Extract: consume from Kafka. Transform: validate and
normalize each reading. Load: insert into TimescaleDB.
"""
import json
import os
import time

import psycopg2
from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")
TOPIC = os.getenv("KAFKA_TOPIC", "field.readings")
GROUP_ID = os.getenv("KAFKA_GROUP_ID", "agropulse-etl")

PG_DSN = os.getenv("DATABASE_URL", "postgresql://agropulse:agropulse@postgres:5432/agropulse")

VALID_METRICS = {"soil_moisture", "canopy_temp", "nitrogen_index", "irrigation_draw"}
VALID_STATUS = {"nominal", "watch", "alert"}


def connect_kafka() -> KafkaConsumer:
    for attempt in range(1, 11):
        try:
            return KafkaConsumer(
                TOPIC,
                bootstrap_servers=KAFKA_BROKER,
                group_id=GROUP_ID,
                value_deserializer=lambda v: json.loads(v.decode("utf-8")),
                auto_offset_reset="earliest",
            )
        except NoBrokersAvailable:
            print(f"[consumer] Kafka not ready, retrying ({attempt}/10)...")
            time.sleep(3)
    raise RuntimeError("Could not connect to Kafka after 10 attempts")


def connect_postgres():
    for attempt in range(1, 11):
        try:
            return psycopg2.connect(PG_DSN)
        except psycopg2.OperationalError:
            print(f"[consumer] Postgres not ready, retrying ({attempt}/10)...")
            time.sleep(3)
    raise RuntimeError("Could not connect to Postgres after 10 attempts")


def clean(reading: dict) -> dict | None:
    """Validate and normalize a raw reading. Returns None to drop a bad one."""
    metric = reading.get("metric")
    value = reading.get("value")
    status = reading.get("status", "nominal")

    if metric not in VALID_METRICS:
        print(f"[consumer] dropping reading with unknown metric: {metric}")
        return None
    if not isinstance(value, (int, float)):
        print(f"[consumer] dropping reading with non-numeric value: {value}")
        return None
    if status not in VALID_STATUS:
        status = "nominal"

    reading["status"] = status
    return reading


def main():
    consumer = connect_kafka()
    conn = connect_postgres()
    conn.autocommit = True
    cur = conn.cursor()
    print(f"[consumer] connected — consuming '{TOPIC}' as group '{GROUP_ID}'")

    for message in consumer:
        reading = clean(message.value)
        if reading is None:
            continue
        cur.execute(
            """
            INSERT INTO field_readings (time, field_id, metric, value, unit, status)
            VALUES (%(time)s, %(field_id)s, %(metric)s, %(value)s, %(unit)s, %(status)s)
            """,
            reading,
        )
        print(f"[consumer] wrote {reading['field_id']}/{reading['metric']} = {reading['value']}{reading['unit']}")


if __name__ == "__main__":
    main()
