#!/bin/bash
input=$(cat)

# PR 생성 감지 (단순 문자열 매칭)
if echo "$input" | grep -q "gh pr create"; then
  # 출력 내용에 URL이 있는지 확인
  if echo "$input" | grep -q "https://github.com/.*/pull/"; then
    # 로그 출력 (stderr로 보내야 Cursor 로그에 찍힘)
    echo "[Hook] PR이 생성되었습니다." >&2
  fi
fi