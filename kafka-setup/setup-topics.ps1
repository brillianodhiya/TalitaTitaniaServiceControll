# PowerShell script untuk setup Kafka topics di Windows

Write-Host "Setting up Kafka topics..." -ForegroundColor Green

# Wait for Kafka to be ready
Write-Host "Waiting for Kafka broker to be ready..." -ForegroundColor Yellow
do {
    Write-Host "   Kafka broker not ready yet, waiting..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    $result = docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list 2>$null
} while ($LASTEXITCODE -ne 0)

Write-Host "Kafka broker is ready!" -ForegroundColor Green

# Create main topic
Write-Host "Creating topic: webhooks_events_talita_tatania" -ForegroundColor Cyan
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh `
    --bootstrap-server localhost:9092 `
    --create `
    --if-not-exists `
    --topic webhooks_events_talita_tatania `
    --partitions 3 `
    --replication-factor 1

# List all topics
Write-Host "Listing all topics:" -ForegroundColor Cyan
docker exec kafka-broker /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

Write-Host "Topic setup completed!" -ForegroundColor Green 