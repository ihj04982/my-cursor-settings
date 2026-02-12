#!/bin/bash
# sessionStart (Hooks Cursor Docs)
# Input: { "session_id", "is_background_agent", "composer_mode" }
# Output: { "env"?, "additional_context"?, "continue"?, "user_message"? }
set -euo pipefail

cat >/dev/null
echo "[Hook] Session started." >&2
# No output = Cursor continues; empty object for clarity
echo '{}'
