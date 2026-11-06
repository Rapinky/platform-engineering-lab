
#!/usr/bin/env bash
set -euo pipefail

echo "=== Environment Configuration Lab ==="

# Read configuration with safe defaults
APP_ENV="${APP_ENV:-development}"
APP_PORT="${APP_PORT:-3000}"

echo ""
echo "1. Validate environment:"

case "$APP_ENV" in
  development|staging|production)
    echo "Valid environment: $APP_ENV"
    ;;
  *)
    echo "ERROR: Invalid APP_ENV"
    exit 1
    ;;
esac

echo ""
echo "2. Validate application port:"

if [[ ! "$APP_PORT" =~ ^[0-9]+$ ]]; then
  echo "ERROR: APP_PORT must be numeric"
  exit 1
fi

echo "Application port: $APP_PORT"

echo ""
echo "3. Check secret availability:"

if [[ -n "${DEMO_API_TOKEN:-}" ]]; then
  echo "Demo API token: configured (value hidden)"
else
  echo "Demo API token: not configured"
fi

echo ""
echo "Environment configuration check completed!"
