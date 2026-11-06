
#!/usr/bin/env bash
set -euo pipefail

echo "=== Service Health Check Lab ==="

HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/health}"

echo ""
echo "1. Checking service availability..."

if ! http_status=$(curl \
  --silent \
  --show-error \
  --output /dev/null \
  --write-out '%{http_code}' \
  --connect-timeout 2 \
  --max-time 5 \
  "$HEALTH_URL"); then
  echo "ERROR: Could not connect to service"
  exit 1
fi

echo "HTTP status: $http_status"

echo ""
echo "2. Evaluating health status..."

if [[ "$http_status" == "200" ]]; then
  echo "Service is healthy!"
else
  echo "ERROR: Service is unhealthy"
  exit 1
fi

echo ""
echo "Health check completed successfully!"
