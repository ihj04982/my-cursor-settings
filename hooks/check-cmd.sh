#!/bin/bash
# 입력(JSON)을 변수에 저장
input=$(cat)

# 결과 기본값 (Allow)
permission="allow"
msg=""

# 1. Git Push 확인
if echo "$input" | grep -q "git push"; then
  permission="ask"
  msg="Git Push를 진행하시겠습니까? (Hooks Check)"
fi

# 2. 불필요한 문서 생성 차단
# .md 또는 .txt가 포함되어 있고, 주요 파일이 아닌 경우
if echo "$input" | grep -qE "\.md|\.txt"; then
  if ! echo "$input" | grep -qE "README\.md|CLAUDE\.md|AGENTS\.md|CONTRIBUTING\.md"; then
    # 파일 생성 명령어인지 확인
    if echo "$input" | grep -qE "touch|echo.*>|cat.*>"; then
      permission="deny"
      msg="BLOCKED: 불필요한 문서 파일 생성을 차단했습니다."
    fi
  fi
fi

# JSON 출력 (jq 없이 수동 생성)
if [ "$permission" == "allow" ]; then
  echo '{"permission": "allow"}'
elif [ "$permission" == "ask" ]; then
  echo "{\"permission\": \"ask\", \"user_message\": \"$msg\"}"
else
  echo "{\"permission\": \"deny\", \"agent_message\": \"$msg\"}"
fi