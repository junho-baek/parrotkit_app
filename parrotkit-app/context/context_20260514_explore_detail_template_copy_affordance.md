# Context 2026-05-14 Explore Detail Template Copy Affordance

## 작업

Sub-AC 5.2.1: Explore detail screen displays the selected template content with a clear copy affordance.

## 변경

- `src/features/explore/lib/explore-template-copy-action.ts`
  - `getExploreTemplateDetailCopyAffordance`를 추가했다.
  - unsaved detail은 `content-copy` icon과 `Copy template` / `템플릿 복사` label을 반환한다.
  - copied detail은 `check-circle` icon과 `Copied` / `복사됨` label을 반환한다.
- `src/features/explore/lib/explore-template-copy-action.test.ts`
  - detail 화면의 template copy/copy-complete affordance contract를 추가했다.
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
  - selected recipe detail의 title, summary, key hook, structure preview 렌더링은 유지했다.
  - top action과 하단 CTA를 bookmark/save 표현에서 template copy/check 표현으로 바꿨다.
  - copied 상태 판정은 downloaded recipe뿐 아니라 owned template copy도 포함하도록 맞췄다.

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - 예상대로 `getExploreTemplateDetailCopyAffordance` missing export 오류로 실패했다.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - 통과했다.
- iPhone simulator QA는 현재 환경에서 수행하지 못했다.
  - `xcrun simctl list devices available`
  - 실패: `CoreSimulatorService connection became invalid`, `Connection refused`.

## 참고

- real paid/API/upload flow는 추가하지 않았다.
- Source/Recipes bottom tab 복원이나 web QA는 수행하지 않았다.
- Seed constraint에 따라 commit/push는 수행하지 않았다.
