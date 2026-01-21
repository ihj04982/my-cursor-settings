# Cursor 설정 시각화 앱

React + Vite + TypeScript로 구현된 Cursor IDE의 agents, hooks, rules를 시각화하는 웹 애플리케이션입니다.

## 기능

- **Agents 시각화**: 설정된 모든 에이전트를 카드 형태로 표시
  - 에이전트 이름, 설명, 모델 타입, 사용 가능한 도구
- **Hooks 시각화**: 각종 훅 설정을 타임라인 형태로 표시
  - beforeShellExecution, afterShellExecution, afterFileEdit, stop
- **Rules 시각화**: 프로젝트 규칙을 카드 형태로 표시

## 기술 스택

- **React 19** - UI 프레임워크
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── AgentsView.tsx  # Agents 시각화 컴포넌트
│   ├── HooksView.tsx   # Hooks 시각화 컴포넌트
│   └── RulesView.tsx   # Rules 시각화 컴포넌트
├── utils/              # 유틸리티 함수
│   └── configLoader.ts # Cursor 설정 로더
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx            # 진입점
```

## 사용법

1. 앱을 실행하면 기본 샘플 데이터가 표시됩니다.
2. 상단 네비게이션에서 Agents, Hooks, Rules를 전환할 수 있습니다.
3. "설정 불러오기" 버튼을 통해 실제 Cursor 설정 파일을 불러올 수 있습니다 (추후 구현).

## 라이센스

MIT
