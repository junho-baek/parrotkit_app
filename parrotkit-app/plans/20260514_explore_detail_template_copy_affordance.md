# Explore Detail Template Copy Affordance

## 배경
Sub-AC 5.2.1 requires the Explore detail screen to show the selected template content with a clear copy affordance. The existing detail route already renders the selected recipe content, but the save action still reads like a generic recipe bookmark.

## 목표
- Explore recipe detail keeps showing the selected template title, summary, key hook, and cut structure.
- Unsaved template details expose an explicit copy-template affordance.
- Saved/copied template details continue to show shooting access.

## 범위
- Detail-screen copy affordance label/icon.
- Focused TypeScript contract for the detail affordance.
- No navigation/tab/product-area rework.

## 변경 파일
- `plans/20260514_explore_detail_template_copy_affordance.md`
- `src/features/explore/lib/explore-template-copy-action.ts`
- `src/features/explore/lib/explore-template-copy-action.test.ts`
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `context/context_20260514_explore_detail_template_copy_affordance.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
- iPhone simulator availability check; run UI QA only if CoreSimulatorService is available in this environment.

## 롤백
- 위 변경 파일을 되돌리면 detail CTA는 기존 generic save/bookmark 표현으로 돌아간다.

## 리스크
- Simulator service may be unavailable in the sandbox, as noted in prior context.
- This change intentionally does not add real paid/API/upload flows and does not restore Source or Recipes as bottom tabs.

## 결과
- Explore recipe detail continues to render the selected template title, summary, key hook, creator notes, and structure preview from the selected recipe id.
- Unsaved template details now show `Copy template` / `템플릿 복사` with a `content-copy` icon instead of a generic bookmark/save affordance.
- Copied/saved template details, including owned template copies, now show `Copied` / `복사됨` with a check icon while retaining `Start Shooting`.
- 연결 context: `context/context_20260514_explore_detail_template_copy_affordance.md`

## 검증 결과
- Red check observed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json` failed before implementation because `getExploreTemplateDetailCopyAffordance` did not exist.
- Green check: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json` exited 0.
- iPhone simulator QA blocked: `xcrun simctl list devices available` failed because CoreSimulatorService was unavailable (`Connection refused` / `CoreSimulatorService connection became invalid`).
