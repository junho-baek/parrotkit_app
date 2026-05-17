# 2026-05-17 Cut Row Emphasis Removal

## 배경

Cut row에서 현재/다음 컷을 암시하기 위해 남겨둔 coral left strip과 tinted background도 과한 AI-slop 강조로 보인다는 피드백이 있었다. 상단 session progress와 리스트 순서만으로 현재 작업 맥락을 전달할 수 있으므로 row-level 강조를 제거했다.

## 변경

- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - `highlighted && styles.highlightedCard` 적용 제거.
  - `highlightedCard` style 제거.
  - `card`의 left border width/color 예약 제거.
  - Cut row horizontal padding을 left-strip 제거에 맞춰 정리.
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
  - `highlightedCard`, `borderLeftWidth`, `borderLeftColor`, tinted background 색상 재도입 금지 guard 추가.

## 검증

- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `npm run check:architecture`
- PASS: `npx -y @google/design.md lint DESIGN.md` (0 errors, existing 14 unused-token warnings)
- PASS: `git diff --check`
- PASS: Android screenshot QA

## 산출물

- Collapsed board: `output/playwright/recipe-execution-reference-20260517/android-no-row-emphasis-board.png`
- Expanded cut: `output/playwright/recipe-execution-reference-20260517/android-no-row-emphasis-expanded.png`

## 메모

현재 컷을 별도 띠나 배경색으로 강조하지 않는다. 필요한 맥락은 session header의 progress, row order, expanded state, My Take state로 전달한다.
