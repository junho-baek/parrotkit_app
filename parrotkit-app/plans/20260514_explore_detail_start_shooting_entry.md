# Explore Detail Start Shooting Entry

## 배경

- Sub-AC 5.2.2는 Explore detail screen에서 선택한 template으로 바로 촬영/creator workflow를 시작할 수 있어야 한다.
- 기존 detail 화면에는 Start Shooting 버튼이 있으나, detail-specific route contract를 명시적으로 고정해 회귀를 막아야 한다.

## 목표

- Explore detail Start Shooting CTA가 선택한 template을 saved/local recipe로 보장한 뒤 `/recipe/:id/prompter`로 이동한다.
- route query에 saved template recipe id, Explore source kind, 원본 selected template id, 첫 cut id를 유지한다.
- Source/Recipes bottom tabs, real paid/API/upload flow, web QA는 추가하지 않는다.

## 범위

- Explore template start-shooting route helper/test.
- Explore recipe detail start action wiring.
- Focused TypeScript 검증 및 simulator availability 확인.

## 변경 파일

- `plans/20260514_explore_detail_start_shooting_entry.md`
- `src/features/explore/lib/explore-template-recipe-copy.ts`
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `context/context_20260514_explore_detail_start_shooting_entry.md`

## 테스트

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
- iPhone simulator availability: `xcrun simctl list devices available`

## 롤백

- Detail start action을 기존 inline `getExploreTemplateStartFilmingHref` 호출로 되돌리고 helper/test/context 추가분을 제거한다.

## 리스크

- shared worktree에 sibling AC 변경이 많으므로 unrelated edits는 건드리지 않는다.
- 현재 환경에서 CoreSimulatorService가 unavailable일 수 있어 실제 iPhone simulator UI QA가 막힐 수 있다.

## 결과

- `getExploreTemplateDetailStartShootingHref` helper를 추가해 Explore detail Start Shooting route contract를 명시했다.
- Detail Start Shooting CTA가 선택한 template recipe와 saved/local target recipe를 함께 사용해 `/recipe/:savedId/prompter`로 이동하도록 연결했다.
- route query는 `savedTemplateRecipeId`, `source=explore-template`, `sourceRecipeId`, 첫 `sceneId`를 유지한다.
- 연결 context: `context/context_20260514_explore_detail_start_shooting_entry.md`

## 검증 결과

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - 실패 확인: `getExploreTemplateDetailStartShootingHref` export 없음.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - 통과.
- iPhone simulator availability: `xcrun simctl list devices available`
  - 실패: `CoreSimulatorService connection became invalid`, `Connection refused`.
