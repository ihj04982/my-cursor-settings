---
name: vitest-testing-skills
description: Advanced guidelines and best practices for writing tests using Vitest. Apply this skill when generating, reviewing, or refactoring test codes to prevent common pitfalls and ensure high performance.
---

# Vitest Testing Guidelines & Best Practices

이 프로젝트에서 Vitest를 사용하여 테스트 코드를 작성할 때 준수해야 할 핵심 지침입니다. AI는 테스트 코드를 생성하거나 수정할 때 이 규칙을 최우선으로 적용해야 합니다.

## 1. 테스트 기본 원칙 (Core Principles)

- **AAA 패턴 준수:** 모든 테스트는 `Arrange`(준비), `Act`(실행), `Assert`(검증) 단계를 시각적으로 명확히 분리하여 작성합니다.
- **행위 기반 검증 (Testing Behavior):** 내부 변수명이나 구현 세부 사항을 테스트하지 마세요. 사용자 관점의 입력과 동작(출력)만 검증합니다.
- **파일 병치 (Colocation):** 테스트 파일은 타겟 파일과 동일한 디렉토리에 위치시킵니다. (예: `utils/math.ts` -> `utils/math.test.ts`)

## 2. 모킹 및 격리 (Mocking & Isolation)

- **초기화:** 테스트 간의 상태 오염을 막기 위해, `describe` 블록 내부의 `beforeEach`에서 `vi.clearAllMocks()`를 호출하세요.
- **호이스팅 주의 (Hoisting):** `vi.mock()`은 파일 최상단으로 호이스팅됩니다. `vi.mock` 내부에서 외부 변수를 참조해야 할 경우 반드시 `vi.hoisted()`를 사용하여 변수도 함께 호이스팅되도록 처리하세요. 호이스팅을 원치 않는 동적 모킹 시에는 `vi.doMock()`을 사용합니다.
- **시간 제어 (Fake Timers):** 시간에 의존하는 로직은 실제 시간을 기다리지 말고 `vi.useFakeTimers()`와 `vi.advanceTimersByTime()`을 사용하세요.

## 3. 타입 검증 (Type Testing)

- **런타임 테스트 분리:** 복잡한 유틸리티 타입이나 제네릭(Generic)의 정확성을 검증해야 할 경우, 일반 런타임 테스트 파일이 아닌 `*.test-d.ts` 파일을 생성하세요.
- **타입 단언:** Vitest의 `expectTypeOf` 또는 `assertType` API를 사용하여 정적 타입 추론이 올바르게 작동하는지 검증합니다.

## 4. UI 컴포넌트 테스트 (DOM & Browser)

- **접근성 중심 쿼리:** `@testing-library` 사용 시 `querySelector` 등 DOM 구조에 의존하는 쿼리를 금지하고, `getByRole`, `getByText` 등 접근성 기반 쿼리를 사용하세요.
- **가상 DOM의 한계 인지:** `jsdom`이나 `happy-dom`은 실제 브라우저가 아니므로 `IntersectionObserver` 등 실제 브라우저 API가 필요한 경우, 이를 명시적으로 모킹하거나 Browser Mode 환경을 고려한 코드를 작성해야 합니다.

## 5. 안티 패턴 (Strictly Avoid)

- **거대한 단일 테스트 (God Test):** 하나의 `it` 블록에 여러 동작을 몰아넣지 말고, 하나의 논리적 동작만 검증하도록 쪼개세요.
- **무의미한 커버리지용 테스트:** 커버리지 수치만을 위한 의미 없는 검증(`expect(true).toBe(true)`)을 작성하지 마세요.
