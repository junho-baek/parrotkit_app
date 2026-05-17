# 2026-05-17 Cut Row Emphasis Removal

## 배경

Cut row에서 현재/다음 컷을 표현하려고 남긴 coral left strip과 soft tinted background도 과한 AI-slop 강조로 보인다는 피드백이 있었다. Session top bar의 `2/4 Cuts`와 리스트 순서만으로도 현재 맥락을 충분히 전달할 수 있다.

## 목표

- Cut row의 highlighted visual treatment 제거.
- Left strip 공간 예약 제거.
- Soft tinted row background 제거.
- Design contract가 highlighted row visual emphasis 재도입을 막도록 업데이트.

## 범위

- Native shooting board cut row root style.
- Design contract guard 업데이트.
- Android screenshot QA.

## 변경 파일

- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `plans/20260517_cut_row_emphasis_removal.md`
- `context/context_20260517_cut_row_emphasis_removal.md`
- `output/reports/20260517_cut_row_emphasis_removal.md`
- `output/playwright/recipe-execution-reference-20260517/*`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`
- Android screenshot QA

## 롤백

Revert this commit. Previous behavior restores coral left strip and tinted background for highlighted rows.

## 리스크

- 현재 컷의 시각적 구분이 약해질 수 있다. 상단 progress, row order, expanded state, My Take state로 보완한다.

## 결과

- `highlightedCard` style과 적용부를 제거했다.
- Row-level left strip과 tinted background를 제거했다.
- `card` root에서 left border 공간 예약을 제거했다.
- Design contract에 highlighted row visual emphasis 재도입 방지 guard를 추가했다.
- 연결 context: `context/context_20260517_cut_row_emphasis_removal.md`
