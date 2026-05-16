# 2026-05-17 Cut Timeline Meta Cleanup

## 배경

Collapsed cut row의 `Next cut` / `다음 컷` 라벨도 reference label과 같은 과잉 설명으로 보일 수 있다. 현재 row meta는 time range만 보여 각 컷의 예상 촬영 길이가 명시적으로 읽히지 않는다. `Line to Say` / `Shot guide`는 촬영 실행에 중요한 정보이므로 collapsed preview와 expanded toggle 계약을 유지해야 한다.

## 목표

- `Next cut` / `다음 컷` 라벨 제거.
- 현재 cut 강조는 라벨 없이 coral left accent와 soft fill만 사용.
- Cut row meta를 `time range · expected duration` 형태로 변경.
- `Line to Say` / `Shot guide` preview rows가 toggle로 expanded detail에 연결되는 계약을 강화.

## 범위

- Native shooting board collapsed cut row.
- Design contract guard 업데이트.
- Android screenshot QA.

## 변경 파일

- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `plans/20260517_cut_timeline_meta_cleanup.md`
- `context/context_20260517_cut_timeline_meta_cleanup.md`
- `output/reports/20260517_cut_timeline_meta_cleanup.md`
- `output/playwright/recipe-execution-reference-20260517/*`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`
- Android screenshot QA

## 롤백

Revert this commit. Previous behavior restores `Next cut` label in highlighted rows and time range-only meta.

## 리스크

- 라벨 제거로 highlighted row의 의미가 약해질 수 있다. Coral left accent, row order, session progress를 함께 사용해 현재 작업 맥락을 유지한다.

## 결과

- `Next cut` / `다음 컷` 라벨을 제거했다.
- Cut row timeline을 `0:00-0:05 · 5s` 또는 한국어 `0:00-0:05 · 예상 5초` 형식으로 바꿨다.
- `Line to Say` / `Shot guide` preview row가 toggle expansion과 연결되는 contract guard를 추가했다.
- 연결 context: `context/context_20260517_expanded_cut_density_cleanup.md`
