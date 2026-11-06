
#!/usr/bin/env bash
set -euo pipefail

echo "=== Linux Networking Diagnostics ==="

echo ""
echo "1. Network interfaces:"
ip -br addr

echo ""
echo "2. Routing table:"
ip route

echo ""
echo "3. Listening TCP ports:"
ss -ltn

echo ""
echo "4. DNS resolution:"
getent ahostsv4 github.com

echo ""
echo "5. HTTPS connectivity:"
curl --silent --show-error --location \
  --max-time 15 \
  --output /dev/null \
  --write-out 'HTTP status: %{http_code}\n' \
  https://github.com

echo ""
echo "Networking diagnostics completed!"
