# Context 2026-05-14 Sub-AC 2.2 Home Continue Required My Take Filter

## 작업
Home Continue board lookup/filtering path가 required-cut saved My Take predicate를 실제 Home surface에서도 사용하도록 연결했다.

## 변경
- Updated `src/features/home/components/home-workspace-surface.tsx`
  - `getSavedRecipeTakes()` 전체 결과를 `getHomeWorkflowSelection(recipes, { savedTakes })`에 전달한다.
  - Saved takes 섹션 표시용 목록은 `recentSavedTakes = savedTakes.slice(0, 4)`로 분리해 기존 UI 범위를 유지한다.

## 검증
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 리스크 / 후속
- Explicit publish/complete state remains outside this sub-AC.
- Ordering by last meaningful activity remains outside this sub-AC.
- No commit or push performed per Seed constraints.
