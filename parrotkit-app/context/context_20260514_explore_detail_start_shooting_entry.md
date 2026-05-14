# Context 2026-05-14 Explore Detail Start Shooting Entry

## 작업

Sub-AC 5.2.2: Explore detail screen provides a start-shooting entry point for the selected template.

## 변경

- `src/features/explore/lib/explore-template-recipe-copy.ts`
  - `getExploreTemplateDetailStartShootingHref` helper를 추가했다.
  - saved/local recipe id로 `/recipe/:id/prompter`를 만들고, selected Explore template id를 `sourceRecipeId` query로 보존한다.
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
  - Detail Start Shooting route가 saved template creator workflow를 열고 `savedTemplateRecipeId`, `sourceRecipeId`, 첫 `sceneId`를 유지하는 contract를 추가했다.
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
  - 기존 Start Shooting CTA를 detail-specific helper로 연결했다.
  - 기존 `ensureSavedRecipe` 흐름은 유지해 선택한 template을 local saved recipe로 보장한 뒤 촬영 플로우로 진입한다.

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - `getExploreTemplateDetailStartShootingHref` export 없음으로 실패 확인.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - 통과.

## iPhone Simulator QA

- `xcrun simctl list devices available`로 simulator availability를 확인했다.
- 현재 환경에서 CoreSimulatorService가 초기화되지 않아 실제 iPhone simulator UI QA는 실행하지 못했다.
- 실패 메시지: `CoreSimulatorService connection became invalid`, `Connection refused`.

## 참고

- Source/Recipes bottom tabs는 복원하지 않았다.
- real paid/API/upload flow, web QA, Notion upload, commit/push는 수행하지 않았다.
- shared worktree의 이전 failed-item fixes와 sibling AC 변경은 보존했다.
