#!/bin/bash
# preCompact (Hooks Cursor Docs) - observational, cannot block compaction
# Input: { "trigger", "context_usage_percent", "context_tokens", "context_window_size", "message_count", "messages_to_compact", "is_first_compaction" }
# Output: { "user_message"? } optional
set -euo pipefail

cat >/dev/null
echo "[Hook] Context compaction triggered." >&2
echo '{}'
