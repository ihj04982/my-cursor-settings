#!/bin/bash
# sessionEnd (Hooks Cursor Docs) - fire and forget, response logged but not used
# Input: { "session_id", "reason", "duration_ms", "is_background_agent", "final_status", "error_message"? }
set -euo pipefail

cat >/dev/null
echo "[Hook] Session ended." >&2
# No output required (fire and forget)
