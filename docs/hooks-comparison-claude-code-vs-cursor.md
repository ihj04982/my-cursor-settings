# Hooks 비교: Claude Code vs Cursor

[Claude Code Hooks](https://code.claude.com/docs/en/hooks)와 [Cursor Hooks](https://cursor.com/docs/agent/hooks) 문서를 기준으로 두 플랫폼의 훅 사용법과 차이점을 정리한 문서입니다.

---

## 1. 개요 비교

| 항목 | Claude Code | Cursor |
|------|-------------|--------|
| **대상** | Claude Code CLI 세션 | Cursor IDE (Agent + Tab) |
| **설정 파일** | `settings.json` 내 `hooks` 객체 | 전용 `hooks.json` |
| **이벤트 명명** | PascalCase (`PreToolUse`, `SessionStart`) | camelCase (`preToolUse`, `sessionStart`) |
| **훅 타입** | command, prompt, **agent** | command, **prompt** (agent 없음) |

---

## 2. 설정 파일 위치 및 구조

### Claude Code

- **위치**
  - 사용자: `~/.claude/settings.json`
  - 프로젝트: `.claude/settings.json` 또는 `.claude/settings.local.json`
  - 플러그인: 플러그인 내 `hooks/hooks.json`
  - 스킬/에이전트: YAML frontmatter에 직접 정의
- **구조**: `settings.json` 안에 `"hooks": { "이벤트명": [ { matcher, hooks: [...] } ] }` 형태로 중첩

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/block-rm.sh" }
        ]
      }
    ]
  }
}
```

### Cursor

- **위치**
  - 사용자: `~/.cursor/hooks.json`
  - 프로젝트: `<project>/.cursor/hooks.json`
  - 엔터프라이즈: OS별 전역 경로 (macOS: `/Library/Application Support/Cursor/hooks.json` 등)
- **구조**: 최상위 `version` + `hooks` 객체, 이벤트별 배열만 사용 (matcher는 훅 정의 안의 옵션)

```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [{ "command": ".cursor/hooks/format.sh" }],
    "beforeShellExecution": [
      { "command": "./hooks/approve-network.sh", "matcher": "curl|wget|nc" }
    ]
  }
}
```

**차이점 요약**

- Claude Code: 설정이 `settings.json`에 통합, 이벤트 → matcher 그룹 → 훅 배열의 3단계.
- Cursor: 별도 `hooks.json`, `version` 필드 필수, 이벤트 → 훅 배열의 2단계. matcher는 각 훅 옵션.

---

## 3. 이벤트(훅) 목록 비교

### 공통 개념으로 대응되는 이벤트

| Claude Code | Cursor | 비고 |
|-------------|--------|------|
| `SessionStart` | `sessionStart` | 세션 시작 시 |
| `SessionEnd` | `sessionEnd` | 세션 종료 시 |
| `UserPromptSubmit` | `beforeSubmitPrompt` | 프롬프트 제출 전 |
| `PreToolUse` | `preToolUse` + `beforeShellExecution` / `beforeMCPExecution` | 도구/쉘/MCP 실행 전 |
| `PostToolUse` | `postToolUse` + `afterShellExecution` / `afterMCPExecution` | 도구/쉘/MCP 실행 후 |
| `PostToolUseFailure` | `postToolUseFailure` | 도구 실패 시 |
| `SubagentStart` | `subagentStart` | 서브에이전트(Task) 시작 |
| `SubagentStop` | `subagentStop` | 서브에이전트 종료 |
| `Stop` | `stop` | 에이전트 응답 종료 시 |
| `PreCompact` | `preCompact` | 컨텍스트 압축 전 |

### Claude Code에만 있는 이벤트

- `PermissionRequest` — 권한 다이얼로그 표시 시 (Cursor는 별도 훅 없이 pre/before 훅에서 처리)
- `Notification` — 알림 발송 시 (타입별 matcher 지원)
- `TeammateIdle` — 에이전트 팀 메이트가 idle 직전
- `TaskCompleted` — 태스크 완료 처리 시

### Cursor에만 있는 이벤트

- **파일/탭 전용**
  - `beforeReadFile` — Agent가 파일 읽기 전
  - `afterFileEdit` — Agent가 파일 편집 후
  - `beforeTabFileRead` — Tab(인라인 완성)이 파일 읽기 전
  - `afterTabFileEdit` — Tab이 파일 편집 후
- **관찰용**
  - `afterAgentResponse` — 에이전트 메시지 완료 후
  - `afterAgentThought` — thinking 블록 완료 후

**차이점 요약**

- Claude Code: 도구 중심(PreToolUse/PostToolUse 등) + 권한/알림/팀/태스크 완료 등 워크플로 이벤트.
- Cursor: Agent와 Tab을 구분하고, 파일 읽기/편집 전후와 쉘·MCP 실행 전후를 세분화. Tab 전용 훅으로 정책 분리 가능.

---

## 4. Matcher(필터) 방식

### Claude Code

- **위치**: 이벤트별로 “matcher 그룹” 단위. 같은 이벤트에 matcher 여러 개 가능.
- **적용 필드** (이벤트마다 상이):
  - `PreToolUse`, `PostToolUse`, `PermissionRequest`: **tool name** (예: `Bash`, `Edit|Write`, `mcp__.*`)
  - `SessionStart`: **source** (`startup`, `resume`, `clear`, `compact`)
  - `SessionEnd`: **reason** (`clear`, `logout`, …)
  - `Notification`: **notification type**
  - `SubagentStart`/`SubagentStop`: **agent type**
  - `PreCompact`: **trigger** (`manual`, `auto`)
- **문법**: regex 문자열. `UserPromptSubmit`, `Stop` 등은 matcher 미지원(항상 실행).

### Cursor

- **위치**: 훅 정의 하나하나에 `matcher` 옵션.
- **적용 필드** (훅마다 상이):
  - `preToolUse` 등 도구 훅: **tool type** (`Shell`, `Read`, `Write`, `MCP`, `Task` 등)
  - `subagentStart`: **subagent type** (`generalPurpose`, `explore`, `shell` 등)
  - `beforeShellExecution`: **쉘 명령 문자열** (예: `curl|wget|nc`)

**차이점 요약**

- Claude Code: 이벤트 단위로 “어떤 필드로 필터링할지”가 정해져 있고, matcher는 regex.
- Cursor: 훅별로 matcher가 붙고, `beforeShellExecution`는 “명령어 텍스트”에 대한 패턴 매칭으로 더 세밀한 제어 가능.

---

## 5. 훅 타입 (command / prompt / agent)

### Claude Code

| 타입 | 설명 |
|------|------|
| `command` | 셸 명령. stdin에 JSON, stdout/stderr/exit code로 응답. `async: true` 지원. |
| `prompt` | 단일 턴 LLM 호출. `$ARGUMENTS`에 훅 입력 JSON. 응답은 `{ ok, reason }` 등 구조화된 JSON. |
| `agent` | 서브에이전트 스폰(Read, Grep 등 도구 사용 가능). 최대 50턴 후 `{ ok, reason }` 반환. |

### Cursor

| 타입 | 설명 |
|------|------|
| `command` (기본) | 셸 스크립트. stdin JSON, stdout JSON. |
| `prompt` | LLM으로 조건 평가. `$ARGUMENTS` 또는 자동 append. `{ ok, reason? }` 반환. |

**차이점 요약**

- **Agent 훅**: Claude Code만 지원. “파일/코드베이스를 조사한 뒤 허용/거부” 같은 검증에 유리.
- **Async**: Claude Code는 command 훅에 `async: true`로 비동기 실행 가능. Cursor 문서에는 async 훅 설명 없음.

---

## 6. 입출력 및 결정 제어

### 공통 입력 필드 (대략적 대응)

- 세션/대화 식별: Claude Code `session_id` ↔ Cursor `conversation_id`
- 작업 디렉터리: 둘 다 `cwd`
- 훅 이름: 둘 다 `hook_event_name`
- Claude Code `transcript_path` ↔ Cursor `transcript_path` (nullable 등 차이 있음)

### PreToolUse / preToolUse·beforeShell·beforeMCP

| 항목 | Claude Code | Cursor |
|------|-------------|--------|
| 결정 출력 | `hookSpecificOutput.permissionDecision`: `allow` / `deny` / `ask` | `permission`: `allow` / `deny` / `ask` |
| 이유/메시지 | `permissionDecisionReason` | `user_message`, `agent_message` |
| 입력 수정 | `updatedInput` | `updated_input` (preToolUse), beforeShell/ beforeMCP는 별도 스키마 |
| 블로킹 | exit 2 또는 JSON `deny` | exit 2 또는 JSON `permission: "deny"` |

### Stop / stop

| 항목 | Claude Code | Cursor |
|------|-------------|--------|
| 결정 | `decision: "block"` + `reason` → 계속 진행 | `followup_message` → 다음 사용자 메시지로 자동 제출(루프) |
| 반복 제한 | 문서에 명시된 상한 없음 (Stop 훅 내부에서 `stop_hook_active` 등으로 방지) | `loop_limit` (기본 5), 최대 5번 자동 follow-up |

### SessionStart / sessionStart

| 항목 | Claude Code | Cursor |
|------|-------------|--------|
| 추가 컨텍스트 | `additionalContext` | `additional_context` |
| 환경 변수 | `CLAUDE_ENV_FILE`에 export 문 작성 | 출력 JSON의 `env` 객체 |
| 세션 차단 | 해당 없음 (SessionStart는 블로킹 불가) | `continue: false` + `user_message` |

**차이점 요약**

- **이름**: PascalCase vs camelCase, `permissionDecision` vs `permission`, `additionalContext` vs `additional_context` 등.
- **Stop**: Claude Code는 “멈추지 말고 계속해” 위주, Cursor는 “다음에 넣을 사용자 메시지”로 자동 이어지기.
- **세션 시작**: Cursor만 `sessionStart`에서 세션 생성 자체를 막을 수 있음.

---

## 7. Exit code 의미

| Exit | Claude Code | Cursor |
|------|-------------|--------|
| 0 | 성공. stdout JSON 파싱 후 결정 적용. | 성공. JSON 출력 사용. |
| 2 | **블로킹**. stderr를 에이전트/사용자에게 전달. 이벤트별로 “도구 실행 중단”, “프롬프트 거부” 등. | **블로킹**. `permission: "deny"`와 동일. |
| 그 외 | 비블로킹 실패. stderr는 verbose에서만. 실행은 계속. | 훅 실패, 동작은 계속 (fail-open). |

**예외 (Cursor)**  
`beforeMCPExecution`, `beforeReadFile`는 **fail-closed**: 훅 크래시/타임아웃/잘못된 JSON이면 해당 MCP 호출/파일 읽기는 차단.

---

## 8. 스크립트 실행 경로

### Claude Code

- 프로젝트 스크립트: `$CLAUDE_PROJECT_DIR`로 프로젝트 루트 기준 경로 지정.
- 플러그인: `${CLAUDE_PLUGIN_ROOT}`.
- 훅 실행 시 cwd는 “현재 작업 디렉터리”.

### Cursor

- **프로젝트 훅** (`.cursor/hooks.json`): 실행 cwd = **프로젝트 루트**. 예: `.cursor/hooks/format.sh`.
- **사용자 훅** (`~/.cursor/hooks.json`): 실행 cwd = **`~/.cursor/`**. 예: `./hooks/format.sh`.

같은 스크립트 경로를 두 설정에서 쓸 때, 상대 경로가 달라지므로 주의 필요.

---

## 9. 환경 변수

### Claude Code

- `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_ENV_FILE` (SessionStart 전용), `CLAUDE_CODE_REMOTE` 등.

### Cursor

- `CURSOR_PROJECT_DIR`, `CURSOR_VERSION`, `CURSOR_USER_EMAIL`, `CURSOR_CODE_REMOTE`
- 호환용: `CLAUDE_PROJECT_DIR` (= 프로젝트 디렉터리)

Session-scoped 환경 변수: Cursor는 `sessionStart` 훅 출력의 `env`로 설정하고, 이후 훅 실행에 전달.

---

## 10. 보안 및 기타

### 공통

- 훅은 사용자 권한으로 실행.
- 입력 검증, 경로 순회 방지, 절대 경로 사용 등 권장.

### Claude Code

- 설정 변경은 세션 스냅샷에 반영되지 않음. 변경 후 `/hooks` 메뉴에서 확인 필요.
- `disableAllHooks`로 전체 비활성화 가능. 개별 비활성화는 없음.

### Cursor

- 엔터프라이즈 → 팀 → 프로젝트 → 사용자 순 우선순위.
- 프로젝트 훅은 “신뢰된 워크스페이스”에서만 실행.

---

## 11. 요약 표: “무엇을 쓸 때 어디가 다른가”

| 목적 | Claude Code | Cursor |
|------|-------------|--------|
| 설정 파일 | `settings.json` 내 hooks | `hooks.json` (version 필수) |
| 이벤트 이름 | PascalCase | camelCase |
| “쉘 명령만” 검사 | PreToolUse matcher `Bash` | beforeShellExecution + matcher로 명령 문자열 |
| “파일 편집 후” 포맷터 | PostToolUse matcher `Edit\|Write` | afterFileEdit |
| Tab 전용 정책 | 없음 | beforeTabFileRead, afterTabFileEdit |
| LLM으로 허용/거부 | prompt 훅 | prompt 훅 |
| 도구 쓰면서 검증 | **agent** 훅 | 없음 (command + 스크립트로 구현) |
| Stop 후 자동 재진행 | decision block + reason | followup_message (loop_limit 5) |
| 세션 시작 시 환경 변수 | CLAUDE_ENV_FILE에 쓰기 | sessionStart 출력 `env` |
| 세션 시작 차단 | 불가 | sessionStart `continue: false` |
| MCP/파일 읽기 훅 실패 시 | (문서상 별도 명시 없음) | fail-closed로 차단 |

---

## 참고 링크

- [Claude Code – Hooks reference](https://code.claude.com/docs/en/hooks)
- [Cursor – Hooks](https://cursor.com/docs/agent/hooks)
- [Cursor – Third Party Hooks](https://cursor.com/docs/agent/third-party-hooks) (Claude Code 등 외부 훅 호환)
