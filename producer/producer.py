"""
Simulates a sensor gateway on a single field, publishing readings to Kafka
on an interval. Stands in for real hardware (LoRaWAN/MQTT sensors) — this is
the "Ingestion" stage in the architecture diagram.
"""
import json
import os
import random
import time
from datetime import datetime, timezone

from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")
TOPIC = os.getenv("KAFKA_TOPIC", "field.readings")
FIELD_ID = os.getenv("FIELD_ID", "field-04")
INTERVAL_SECONDS = float(os.getenv("INTERVAL_SECONDS", "5"))

# Starting point + bounds + how much each metric can drift per tick —
# loosely mirrors the numbers already hardcoded in the frontend's mock data.
METRICS = {
    "soil_moisture":   {"unit": "%",     "value": 41.8, "min": 15, "max": 55,  "drift": 0.6},
    "canopy_temp":     {"unit": "°C",    "value": 22.1, "min": 14, "max": 34,  "drift": 0.3},
    "nitrogen_index":  {"unit": "ppm",   "value": 38,   "min": 15, "max": 60,  "drift": 1.2},
    "irrigation_draw": {"unit": "L/min", "value": 0,    "min": 0,  "max": 900, "drift": 40},
}


def status_for(metric: str, value: float) -> str:
    if metric == "soil_moisture":
        if value < 25:
            return "alert"
        if value < 32:
            return "watch"
        return "nominal"
    if metric == "irrigation_draw":
        return "alert" if value > 700 else ("watch" if value > 300 else "nominal")
    return "nominal"


def next_value(state: dict) -> float:
    delta = random.uniform(-state["drift"], state["drift"])
    value = max(state["min"], min(state["max"], state["value"] + delta))
    state["value"] = value
    return round(value, 2)


def connect() -> KafkaProducer:
    for attempt in range(1, 11):
        try:
            return KafkaProducer(
                bootstrap_servers=KAFKA_BROKER,
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            )
        except NoBrokersAvailable:
            print(f"[producer] Kafka not ready, retrying ({attempt}/10)...")
            time.sleep(3)
    raise RuntimeError("Could not connect to Kafka after 10 attempts")


def main():
    producer = connect()
    print(f"[producer] connected to {KAFKA_BROKER}, publishing '{TOPIC}' every {INTERVAL_SECONDS}s")

    while True:
        for metric, state in METRICS.items():
            value = next_value(state)
            reading = {
                "time": datetime.now(timezone.utc).isoformat(),
                "field_id": FIELD_ID,
                "metric": metric,
                "value": value,
                "unit": state["unit"],
                "status": status_for(metric, value),
            }
            producer.send(TOPIC, reading)
            print(f"[producer] {reading}")
        producer.flush()
        time.sleep(INTERVAL_SECONDS)


if __name__ == "__main__":
    main()
