# 2026-05-17 Cut Row Label Cleanup

## 배경

Shooting board의 collapsed cut rows가 rounded card border 반복으로 답답하게 보였고, reference thumbnail 내부의 `Reference` overlay가 의미 없는 라벨처럼 보여 `DESIGN.md`의 "labels only when they clarify"와 "containers support, they do not shout" 원칙에 맞지 않았다.

## 변경

- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - Collapsed reference thumbnail 내부의 `Reference` / `레퍼런스` label overlay 제거.
  - Thumbnail 내부 시간 pill 제거, 시간 정보는 cut title 위 compact meta row로 이동.
  - Cut row root를 full rounded card border/shadow에서 divider 기반 list row로 변경.
  - Highlighted next cut은 purple outline 대신 coral left accent와 `Next cut` / `다음 컷` label로 표시.
  - Take state border coloring 제거. My Take button/count가 take state를 소유하도록 유지.
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
  - Collapsed thumbnail에 redundant reference label/time overlay가 재도입되지 않도록 guard 추가.
  - Full rounded card border와 purple boxed highlight 회귀 방지 guard 추가.

## 검증

- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `npm run check:architecture`
- PASS: `npx -y @google/design.md lint DESIGN.md` (0 errors, existing 14 unused-token warnings)
- PASS: `git diff --check`
- PASS: Android screenshot QA

## 산출물

- Android home capture: `output/playwright/recipe-execution-reference-20260517/android-cut-row-label-cleanup-home.png`
- Android board capture: `output/playwright/recipe-execution-reference-20260517/android-cut-row-label-cleanup-board.png`

## 메모

이번 변경은 reference media visibility를 유지하면서 불필요한 overlay copy와 boxed list treatment만 줄였다. Expanded cut의 Reference/My Take 9:16 frame, Board/Breakdown 탭, note entry model은 그대로 유지했다.
