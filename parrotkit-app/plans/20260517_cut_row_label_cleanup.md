# 2026-05-17 Cut Row Label Cleanup

## 배경

Shooting board cut list가 rounded card border로 반복되어 답답하게 보이고, reference thumbnail 위의 `Reference` 오버레이가 불필요한 AI-slop 라벨처럼 보인다. `DESIGN.md`는 labels only when they clarify, containers support rather than shout를 요구한다.

## 목표

- Reference thumbnail 안의 redundant `Reference` label 제거.
- Cut row의 네모 박스 테두리 느낌을 줄인다.
- 현재/다음 cut 강조는 full outline 대신 작은 label과 left accent로 표현한다.
- 기존 9:16 reference thumbnail, My Take state, Board/Breakdown 흐름은 유지한다.

## 범위

- Native shooting board collapsed cut rows.
- Design contract guard 업데이트.
- Android screenshot QA.

## 변경 파일

- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `context/context_20260517_cut_row_label_cleanup.md`
- `output/playwright/recipe-execution-reference-20260517/*`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- Android screenshot QA

## 롤백

Revert this commit. The previous behavior restores full card borders and the reference label overlay.

## 리스크

- Borders를 줄이면 cut boundaries가 약해질 수 있다. spacing, soft fill, left accent로 구분을 유지한다.

## 결과

- Reference thumbnail 내부의 `Reference` / `레퍼런스` 라벨과 시간 오버레이를 제거했다.
- Collapsed cut row를 full rounded card border에서 divider 기반 list row로 정리했다.
- 다음 촬영 대상은 purple outline 대신 coral left accent + `Next cut` / `다음 컷` label로 표현한다.
- Design contract에 redundant reference thumbnail labels, boxed card border, purple boxed highlight 회귀 방지 조건을 추가했다.
- 연결 context: `context/context_20260517_cut_row_label_cleanup.md`
