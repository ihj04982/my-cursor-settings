#!/bin/bash
# beforeShellExecution (Hooks Cursor Docs)
# Input: { "command": "<full terminal command>", "cwd": "<cwd>", "timeout": 30 }
# Output: { "permission": "allow"|"deny"|"ask", "user_message"?: string, "agent_message"?: string }
# Exit: 0 = use JSON output; 2 = block action (equivalent to permission "deny")
set -euo pipefail

input=$(cat)

command=""
if command -v jq >/dev/null 2>&1; then
  command=$(printf '%s' "$input" | jq -r '.command // ""' 2>/dev/null || true)
else
  command=$(printf '%s' "$input" | sed -nE 's/.*"command"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/p' | head -n 1)
fi

permission="allow"
user_message=""
agent_message=""

# 1. Git push: allow but show warning in client and to agent
if echo "$command" | grep -qE '(^|[[:space:]])git[[:space:]]+push([[:space:]]|$)'; then
  user_message="Git push 실행 전 변경사항을 다시 확인하세요. (hooks/check-shell.sh)"
  agent_message="$user_message"
fi

# 2. Block unnecessary doc file creation
if echo "$command" | grep -qE '\.(md|txt)\b'; then
  if ! echo "$command" | grep -qE '(README\.md|CLAUDE\.md|AGENTS\.md|CONTRIBUTING\.md)\b'; then
    if echo "$command" | grep -qE '(touch|echo.*>|cat.*>)'; then
      permission="deny"
      user_message="불필요한 문서 파일 생성을 차단했습니다. (hooks/check-shell.sh)"
      agent_message="$user_message"
    fi
  fi
fi

# Output per Cursor Docs schema
if command -v jq >/dev/null 2>&1; then
  if [ "$permission" = "deny" ]; then
    jq -n --arg p "$permission" --arg u "$user_message" --arg a "$agent_message" \
      '{permission: $p, user_message: $u, agent_message: $a}'
  elif [ -n "$user_message" ]; then
    jq -n --arg p "$permission" --arg u "$user_message" --arg a "$agent_message" \
      '{permission: $p, user_message: $u, agent_message: $a}'
  else
    echo '{"permission":"allow"}'
  fi
else
  esc() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }
  if [ "$permission" = "deny" ]; then
    printf '{"permission":"deny","user_message":"%s","agent_message":"%s"}\n' "$(esc "$user_message")" "$(esc "$agent_message")"
  elif [ -n "$user_message" ]; then
    printf '{"permission":"allow","user_message":"%s","agent_message":"%s"}\n' "$(esc "$user_message")" "$(esc "$agent_message")"
  else
    echo '{"permission":"allow"}'
  fi
fi

# Exit 2 = block (Cursor Docs: equivalent to permission "deny")
if [ "$permission" = "deny" ]; then
  exit 2
fi
exit 0
