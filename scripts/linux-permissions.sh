
#!/usr/bin/env bash
set -euo pipefail

echo "=== Linux Permissions Lab ==="

# Create a temporary sample file
sample_file="$(mktemp)"
trap 'rm -f "$sample_file"' EXIT

echo "Sample content" > "$sample_file"

echo ""
echo "1. Current permissions:"
ls -l "$sample_file"

echo ""
echo "2. Set permissions to 640:"
chmod 640 "$sample_file"
ls -l "$sample_file"

echo ""
echo "3. Verify permissions:"
permissions=$(stat -c "%a" "$sample_file")
echo "Permission value: $permissions"
test "$permissions" = "640"

echo ""
echo "4. Restrict permissions to 600:"
chmod 600 "$sample_file"
ls -l "$sample_file"

echo ""
echo "5. Verify restricted access:"
permissions=$(stat -c "%a" "$sample_file")
test "$permissions" = "600"

echo "Permissions lab completed successfully!"
