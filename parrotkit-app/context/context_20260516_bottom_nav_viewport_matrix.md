# Context 2026-05-16 Bottom Nav Viewport Matrix

## 작업
Issue 6 Sub-AC 10.4.1: iOS/Android bottom navigation QA에 사용할 대표 viewport/device matrix를 정의했다.

## DESIGN.md 확인
- `DESIGN.md`의 Bottom navigation and creation entry 섹션에서 Home, Explore, Paste, Recipes, My 5-slot model과 larger center Paste action 요구를 확인했다.
- `Paste`는 reference link를 source material로 사용하는 recipe creation drawer/flow여야 한다는 지침을 확인했다.
- Layout 섹션의 bottom inset/safe-area padding 요구를 확인했다.
- forbidden creation copy와 box-in-box/redundant CTA guardrail을 확인했다.

## 변경
- `src/core/navigation/root-tab-viewport-matrix.ts`
  - 후속 QA가 공유할 root bottom navigation viewport matrix를 추가했다.
  - iOS profile: `iPhone 15`, `393x852`, bottom inset `34`, display cutout/home-indicator safe-area case.
  - Android profile: `Pixel 8 gesture navigation`, `412x915`, bottom inset `0`, Android gesture-navigation-sized case.
  - 각 profile은 expected visible tabs, center action, Paste flow href, production route map, required checks를 포함한다.
- `src/core/navigation/root-tab-viewport-matrix.test.ts`
  - Matrix가 iOS safe-area/notch device와 Android gesture-navigation-sized viewport를 포함하는지 검증한다.
  - 각 viewport가 Home, Explore, Paste, Recipes, My 5-slot nav, `source` center Paste action, `/recipe-create?mode=reference` Paste flow, root Home route, Paste drawer coverage, safe-area/gesture padding을 검증하도록 강제한다.
- `tsconfig.root-tabs-check.json`
  - 새 matrix와 contract test를 focused root-tabs check에 포함했다.
- `plans/20260516_bottom_nav_viewport_matrix.md`
  - 작업 계획과 검증 결과를 기록했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check -- src/core/navigation/root-tab-viewport-matrix.ts src/core/navigation/root-tab-viewport-matrix.test.ts tsconfig.root-tabs-check.json plans/20260516_bottom_nav_viewport_matrix.md`
- PASS: 새 파일 범위 forbidden user-facing copy scan에서 `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` hit 없음

## 리스크
- 이 Sub-AC는 representative matrix 정의이며 실제 iPhone/Android screenshot capture는 수행하지 않았다.
- Shared worktree에 sibling-agent 변경이 많아 commit/push는 수행하지 않았다.
