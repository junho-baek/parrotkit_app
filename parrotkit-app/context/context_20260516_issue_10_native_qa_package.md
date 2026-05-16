# 2026-05-16 Issue #10 Native QA Package

## 배경

GitHub #10 requires final native QA evidence for the emergency UI patch. The previous Explore detail and shooting board follow-up had landed, so the QA pass needed fresh current-app captures, especially for Android/iPhone Explore detail and shooting board states.

## 수행

- Wrote `plans/20260516_issue_10_native_qa_package.md` using the Superpowers planning/execution structure.
- Ran static verification:
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - `npm run check:architecture`
  - `npx -y @google/design.md lint DESIGN.md`
  - `git diff --check`
- Started the current native app from `/Users/junho/project/parrotkit-app/parrotkit-app` on port 8094.
- Switched Android to the current development build server and captured seven fresh Android screens.
- Attempted fresh iPhone capture through Expo CLI, `simctl`, Simulator relaunch, and Simulator window discovery.
- Copied same-day existing iPhone evidence into the #10 package, marked as non-final because fresh recapture was blocked.
- Generated the contact sheet at `output/playwright/issue-10-native-qa-20260516/issue-10-contact-sheet.svg`.

## QA 중 발견 및 수정

Android fresh capture showed the board-level reference preview could disappear if a runtime board had missing media fields. This contradicted the intended board reference placement.

Fix:

- Added reference media hydration for existing editor boards.
- Added a fallback board reference preview shell when a media URI is unavailable.

Changed files:

- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`
- `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`

## 결과

PASS:

- TypeScript.
- Architecture check.
- `DESIGN.md` lint with 0 errors and existing unused-token warnings only.
- Git whitespace check.
- Android fresh current-app captures.
- Android board now visibly shows the reference preview above the title area.

BLOCKED:

- Fresh iPhone recapture. `simctl` timed out and the Simulator app did not expose a device window after restart.

## 산출물

- `output/reports/20260516_issue_10_native_qa_package.md`
- `output/playwright/issue-10-native-qa-20260516/`

## 판단

GitHub #10 should remain open until fresh iPhone captures are produced from the current app. The current package is useful and includes Android fresh evidence, but it does not fully satisfy #10 acceptance criteria.

