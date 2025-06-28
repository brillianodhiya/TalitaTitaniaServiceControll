# Kafka Setup untuk Development

## Quick Start

### 1. Start Services

```bash
docker compose up -d
```

### 2. Setup Topics (Manual)

#### Windows PowerShell

```powershell
# Option 1: Run PowerShell script
.\setup-topics.ps1

# Option 2: Manual command
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic webhooks_events_talita_tatania --partitions 3 --replication-factor 1
```

#### Linux/Mac

```bash
# Option 1: Run bash script
chmod +x setup-topics.sh
./setup-topics.sh

# Option 2: Manual command
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic webhooks_events_talita_tatania --partitions 3 --replication-factor 1
```

### 3. Verify Topics

```bash
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

## Services

- **Kafka Broker**: `localhost:9092`
- **Redis**: `localhost:6379`
- **Topic Creator**: Disabled (using manual setup)

## Useful Commands

### List Topics

```bash
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

### Describe Topic

```bash
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic webhooks_events_talita_tatania
```

### Delete Topic

```bash
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic webhooks_events_talita_tatania
```

### Check Consumer Groups

```bash
docker exec kafka-broker /opt/kafka/bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
```

## Troubleshooting

### Topic Creator Issues

- Topic creator container is disabled due to network connectivity issues
- Use manual setup instead (more reliable for development)

### Kafka Not Ready

- Wait for health check to pass
- Check logs: `docker logs kafka-broker`

### Network Issues

- Ensure containers are on the same network: `docker network ls`
- Check container connectivity: `docker exec kafka-broker ping redis-server`

### Windows PowerShell Issues

- If you get execution policy errors, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Use backticks (`) for line continuation in PowerShell
- Use `.\script.ps1` to run PowerShell scripts
