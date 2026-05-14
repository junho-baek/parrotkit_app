# Home Continue Recent First

## 배경

- AC 3 requires Home to first show Continue recent recipe/board access.
- Home already has local/mock recipe data and a continue panel, but the welcome header currently appears before the continue access surface.
- The v1 flow should make the most recent editable recipe board the first useful action from Home.

## 목표

- Ensure Home's first content section is continue/recent recipe board access.
- Keep recipe/board access routed to the existing recipe detail/cut-board route.
- Preserve local/mock-only behavior and avoid Source/Recipes tab changes.

## 범위

- Home section ordering and labels.
- Focused TypeScript contract for Home section order.
- No server, auth, cloud sync, Explore search, or payment behavior.

## 변경 파일

- `src/features/home/components/home-workspace-surface.tsx`
- `src/features/home/lib/home-workspace-sections.ts`
- `src/features/home/lib/home-workspace-sections.test.ts`
- `tsconfig.home-continue-recent-check.json`
- `context/context_20260514_home_continue_recent_first.md`

## 테스트

- Red/green focused TypeScript check for section ordering.
- Full TypeScript check if feasible.

## 롤백

- Remove the Home section-order helper/test and focused tsconfig.
- Move the welcome header back above the continue panel.

## 리스크

- The shared worktree has concurrent sibling AC changes; keep edits scoped to Home and new focused test files.
- This does not add device-level visual QA, only focused TypeScript contract validation.

## 결과

- Home의 첫 번째 콘텐츠 섹션을 최근/이어하기 레시피 보드 접근 영역으로 고정했다.
- Welcome 및 `+ 레시피 만들기` 진입점은 이어하기 영역 아래에 유지했다.
- 이어하기 섹션 라벨을 `Continue recent recipe` / `최근 레시피 이어하기`로 명확히 하고, 기본 동작은 기존 컷보드 route를 연다.
- 연결 context: `context/context_20260514_home_continue_recent_first.md`

## 검증 결과

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-recent-check.json`
  - 구현 전 `home-workspace-sections` 모듈이 없어 실패 확인.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-recent-check.json`
  - 통과.
- Full: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 통과.
