#!/bin/bash
set -euo pipefail

# 입력(JSON)을 변수에 저장
input=$(cat)

# preToolUse의 Shell 입력에서 command를 추출한다.
command=""
if command -v jq >/dev/null 2>&1; then
  command=$(printf '%s' "$input" | jq -r '.tool_input.command // .command // ""' 2>/dev/null || true)
else
  # jq 미설치 환경(Windows Git Bash 등) 대비 fallback
  command=$(printf '%s' "$input" | sed -nE 's/.*"command"[[:space:]]*:[[:space:]]*"([^"]*)".*/\1/p' | head -n 1)
fi

# 기본 동작: 허용
decision="allow"
reason=""
system_message=""

# 1. Git Push 확인
if echo "$command" | grep -qE '(^|[[:space:]])git[[:space:]]+push([[:space:]]|$)'; then
  # Cursor preToolUse는 allow/deny 중심이므로 경고 메시지 후 allow 처리
  system_message="Git push 실행 전 변경사항을 다시 확인하세요. (hooks/check-cmd.sh)"
fi

# 2. 불필요한 문서 생성 차단
# .md 또는 .txt가 포함되어 있고, 주요 파일이 아닌 경우
if echo "$command" | grep -qE '\.(md|txt)\b'; then
  if ! echo "$command" | grep -qE '(README\.md|CLAUDE\.md|AGENTS\.md|CONTRIBUTING\.md)\b'; then
    if echo "$command" | grep -qE '(touch|echo.*>|cat.*>)'; then
      decision="deny"
      reason="BLOCKED: 불필요한 문서 파일 생성을 차단했습니다."
      system_message=""
    fi
  fi
fi

# JSON 출력 (Cursor preToolUse decision schema)
if [ "$decision" = "allow" ]; then
  if [ -n "$system_message" ]; then
    printf '{"decision":"allow","system_message":"%s"}\n' "$system_message"
  else
    echo '{"decision":"allow"}'
  fi
else
  printf '{"decision":"deny","reason":"%s"}\n' "$reason"
fi