#!/bin/bash

# git이 있는 경우에만 실행
if command -v git >/dev/null 2>&1; then
  # 변경된 파일 목록 조회
  files=$(git diff --name-only HEAD 2>/dev/null)
  
  for file in $files; do
    if [ -f "$file" ]; then
      # JS/TS 파일인 경우
      if [[ "$file" =~ \.(js|jsx|ts|tsx)$ ]]; then
        if grep -q "console\.log" "$file"; then
          echo "[Hook Final Check] 경고: $file 파일에 console.log가 있습니다." >&2
        fi
      fi
    fi
  done
fi