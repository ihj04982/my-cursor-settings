#!/bin/bash
# stop (Hooks Cursor Docs)
# Input: { "status": "completed"|"aborted"|"error", "loop_count": 0 }
# Output: { "followup_message"? } optional - when set, Cursor submits as next user message
set -euo pipefail

input=$(cat)

if command -v git >/dev/null 2>&1; then
  files=$(git diff --name-only HEAD 2>/dev/null)
  for file in $files; do
    [ -z "$file" ] && continue
    if [ -f "$file" ] && [[ "$file" =~ \.(js|jsx|ts|tsx)$ ]]; then
      if grep -q "console\.log" "$file"; then
        echo "[Hook Final Check] 경고: $file 파일에 console.log가 있습니다." >&2
      fi
    fi
  done
fi
# No output (no followup_message)
