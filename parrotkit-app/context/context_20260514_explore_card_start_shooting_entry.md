# Context 2026-05-14 Explore Card Start Shooting Entry

## 작업

Sub-AC 5.1.2: Explore template cards expose a start-shooting entry point that launches the creator workflow for the selected template.

## 변경

- `src/features/explore/lib/explore-template-recipe-copy.ts`
  - `getExploreTemplateCardStartShootingHref` helper를 추가했다.
  - card에서 선택한 source recipe와 saved owned recipe를 받아 `/recipe/:savedRecipeId/prompter` filming route를 만들고, `savedTemplateRecipeId`, `source=explore-template`, `sourceRecipeId`, 첫 scene id를 query로 유지한다.
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
  - Explore card start-shooting route가 saved template recipe의 creator workflow를 열고 source template id와 첫 cut id를 보존하는 contract를 추가했다.
- `src/features/explore/screens/explore-screen.tsx`
  - recipe-backed recommended/browse cards에 기존 copy action과 별도 `Shoot` / `촬영하기` start-shooting entry를 추가했다.
  - card start-shooting action은 기존 local/mock `downloadRecipe`를 통해 owned recipe를 보장한 뒤 prompter route로 이동한다.
  - Brand/static card는 기존 `recipe-create?mode=brand` deferred/pro path를 유지했다.

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - `getExploreTemplateCardStartShootingHref` export 없음으로 실패 확인.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - 통과.
- Full: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 통과.

## iPhone Simulator QA

- `xcrun simctl list devices available`로 simulator 접근을 확인했으나 현재 환경에서 CoreSimulatorService가 초기화되지 않았다.
- 실패 메시지: `CoreSimulatorService connection became invalid`, `Connection refused`.
- 따라서 이번 run에서는 simulator UI gate를 실제 실행하지 못했고, route/helper contract와 TypeScript 검증까지만 완료했다.

## 참고

- Source/Recipes bottom tabs는 복원하지 않았다.
- real paid/API/upload flow, web QA, Notion upload, commit/push는 수행하지 않았다.
- shared worktree의 다른 AC 변경은 보존했다.
