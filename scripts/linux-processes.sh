
#!/usr/bin/env bash
set -euo pipefail

echo "=== Linux Process Management Lab ==="

# Start a temporary background process
sleep 30 &
process_id=$!

# Ensure cleanup even if the script fails
trap 'kill "$process_id" 2>/dev/null || true' EXIT

echo ""
echo "1. Started process with PID: $process_id"

echo ""
echo "2. Inspect running process:"
ps -p "$process_id" -o pid,ppid,stat,comm

echo ""
echo "3. Verify process is running:"
kill -0 "$process_id"
echo "Process is running!"

echo ""
echo "4. Stop the process:"
kill "$process_id"
wait "$process_id" || true

echo ""
echo "5. Verify process stopped:"
if kill -0 "$process_id" 2>/dev/null; then
  echo "ERROR: Process is still running"
  exit 1
fi

echo "Process stopped successfully!"
echo "Process management lab completed!"
