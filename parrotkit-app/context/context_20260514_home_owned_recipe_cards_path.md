# Context 2026-05-14 Home Owned Recipe Cards Path

## 작업

Sub-AC 3.3: Home exposes a distinct section or path for viewing owned recipe cards.

## 변경

- `src/features/home/lib/home-owned-recipe-cards.ts`
  - Home recipe card entries를 owned recipe만 포함하도록 필터링하는 helper를 추가했다.
  - Home view-all destination을 `/recipes?filter=owned`로 고정했다.
- `src/features/home/components/home-workspace-surface.tsx`
  - Home `내 레시피` / `My recipes` 카드 목록을 owned recipe helper 기반으로 변경했다.
  - 섹션의 view-all affordance가 owned recipe filter 경로로 이동하도록 변경했다.
- `src/features/recipes/screens/recipes-screen.tsx`
  - `filter` query param을 받아 Recipes screen의 selected filter를 설정하도록 추가했다.

## 검증

- Red 확인:
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-owned-recipe-cards-check.json`
  - `home-owned-recipe-cards` module이 없어 실패했다.
- Green 확인:
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-owned-recipe-cards-check.json` 통과.
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- Simulator 확인:
  - `xcrun simctl list devices booted` 실행 시 CoreSimulatorService connection invalid / connection refused로 실패했다.
  - 이 환경에서는 iPhone simulator UI QA를 진행하지 못했다.

## 참고

- iPhone simulator-oriented 최소 변경으로 유지했다.
- Source/Recipes bottom tab 복구, paid/API/upload flow, 웹 QA, commit/push는 수행하지 않았다.
