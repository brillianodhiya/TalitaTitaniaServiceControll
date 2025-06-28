#!/bin/bash

echo "🚀 Setting up Kafka topics..."

# Wait for Kafka to be ready
echo "⏳ Waiting for Kafka broker to be ready..."
until docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list > /dev/null 2>&1; do
    echo "   Kafka broker not ready yet, waiting..."
    sleep 5
done

echo "✅ Kafka broker is ready!"

# Create main topic
echo "📝 Creating topic: webhooks_events_talita_tatania"
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh \
    --bootstrap-server localhost:9092 \
    --create \
    --if-not-exists \
    --topic webhooks_events_talita_tatania \
    --partitions 3 \
    --replication-factor 1

# List all topics
echo "📋 Listing all topics:"
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

echo "✅ Topic setup completed!" 