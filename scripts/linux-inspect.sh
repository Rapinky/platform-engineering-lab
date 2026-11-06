
#!/usr/bin/env bash
set -euo pipefail

echo "=== Linux System Inspection ==="

echo ""
echo "1. Current user:"
whoami
id

echo ""
echo "2. Current directory:"
pwd

echo ""
echo "3. Directory contents:"
ls -la

echo ""
echo "4. Operating system kernel:"
uname -a

echo ""
echo "5. Disk space:"
df -h .

echo ""
echo "6. Memory usage:"
free -h

echo ""
echo "Inspection completed successfully!"
