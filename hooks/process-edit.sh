#!/bin/bash
input=$(cat)

# 파일 경로 추출 (간단한 파싱)
# 정규식으로 "file_path": "..." 부분을 찾음
file_path=$(echo "$input" | grep -o '"file_path": *"[^"]*"' | cut -d'"' -f4)

# 파일이 존재할 때만 실행
if [ -n "$file_path" ] && [ -f "$file_path" ]; then
  
  # 1. Prettier 실행 (설치된 경우에만)
  if command -v prettier >/dev/null 2>&1; then
    if [[ "$file_path" =~ \.(js|jsx|ts|tsx)$ ]]; then
      prettier --write "$file_path" >/dev/null 2>&1
    fi
  fi

  # 2. Console.log 경고
  if [[ "$file_path" =~ \.(js|jsx|ts|tsx)$ ]]; then
    if grep -q "console\.log" "$file_path"; then
      echo "[Hook WARNING] $file_path 파일에 console.log가 남아있습니다." >&2
    fi
  fi
fi