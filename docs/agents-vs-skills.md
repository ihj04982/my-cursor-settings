# Agents vs Skills 가이드

[Plugins reference](./Plugins%20reference.md)를 바탕으로 `agents/`와 `skills/`의 역할 차이 및 권장 패턴을 정리한 문서입니다.

---

## 1. 개념 차이

| 구분 | Agents | Skills |
|------|--------|--------|
| **역할** | 특정 작업을 수행하는 전문 서브에이전트 | `/name` 단축키, 컨텍스트 트리거 |
| **위치** | `agents/` (마크다운 파일) | `skills/` (SKILL.md 포함 디렉터리) |
| **형식** | agent frontmatter (name, description, tools, model) | skill frontmatter (name, description, disable-model-invocation 등) |
| **사용 방식** | /agents UI 노출, 수동/자동 호출 | 작업 컨텍스트에 맞게 자동 로드 |
| **내용** | 실행 절차, 체크리스트, 도구 사용법 등 | 언제/어떻게 사용할지, 또는 에이전트 위임 |

---

## 2. 권장 패턴

### 패턴 A: Skill → Agent 위임 (Command 스타일)

Skill은 가볍게 "언제 사용할지"와 "어떤 에이전트를 호출할지"만 담고, 실제 작업은 Agent에게 맡깁니다.

| Skill | Agent | 비고 |
|-------|-------|------|
| `plan` | `planner` | 요구사항 정리 → 구현 계획 수립 |
| `tdd` | `tdd-guide` | 테스트 우선 개발 워크플로우 |
| `e2e` | `e2e-runner` | Playwright E2E 테스트 |
| `code-review` | `code-reviewer` | 코드 리뷰 (품질·보안) |
| `build-fix` | `build-error-resolver` | 빌드/타입 에러 해결 |
| `refactor-clean` | `refactor-cleaner` | 데드코드 정리, 리팩터링 |

**원칙**: Skill에 동일한 절차를 다시 쓰지 않고, Agent 참조만 명시합니다.

### 패턴 B: Skill = 지식 트리거, Agent = 실행자

Skill은 "언제 이 컨텍스트를 적용할지"만 정의하고, Agent는 상세 실행 가이드·체크리스트를 담습니다.

| Skill | Agent | 비고 |
|-------|-------|------|
| `security-review` | `security-reviewer` | 전처리 체크리스트 + Agent 호출 안내 |
| `tdd-workflow` | `tdd-guide` | TDD 원칙 요약 + Agent 실행 가이드 |

### 패턴 C: Skill = 지식만 (Agent 없음)

특정 도메인 지식·패턴을 담은 Skill. Agent 호출 없이 컨텍스트로만 사용됩니다.

예: `vercel-react-best-practices`, `avoid-barrel-file-imports`, `hoist-regexp-creation` 등 세분화된 performance/패턴 스킬

### 패턴 D: Agent = 오케스트레이터, Skill = 하위 절차

Agent가 여러 Skill/명령을 조합해 실행합니다.

| Agent | 호출하는 Skill/명령 | 비고 |
|-------|---------------------|------|
| `doc-updater` | `update-codemaps`, `update-docs` | 문서·코드맵 갱신 오케스트레이션 |

---

## 3. 중복 방지 원칙

1. **동일 절차 반복 금지**: Skill과 Agent에 같은 워크플로를 이중으로 정의하지 않습니다.
2. **Skill은 얇게, Agent는 두껍게**: Skill은 트리거·요약·에이전트 참조, Agent는 상세 절차와 도구 사용법.
3. **단일 진실 공급원(Single Source of Truth)**: 상세 가이드는 한 곳(주로 Agent)에만 보관합니다.

---

## 4. 현재 매핑 요약

```
agents/                    skills/ (위임/참조)
────────────────────────────────────────────────
planner          ←── plan
tdd-guide        ←── tdd, tdd-workflow
e2e-runner       ←── e2e
code-reviewer    ←── code-review
build-error-resolver ←── build-fix
refactor-cleaner ←── refactor-clean
security-reviewer ←── security-review (지식+참조)
doc-updater      ──→ update-codemaps, update-docs
architect        (단독)
vercel-react-best-practices (참조 문서/스킬)
```
