# 2026-05-16 Bottom Nav Viewport Matrix

## 배경
Issue 6 Sub-AC 10.4.1은 복원된 Home, Explore, Paste, Recipes, My bottom navigation을 실제 QA할 대표 iOS/Android device viewport matrix가 필요하다. 특히 safe-area/notch iOS와 Android gesture navigation 크기를 포함해야 한다.

## 목표
후속 screenshot/tap QA가 같은 기준을 쓰도록 iOS/Android bottom-navigation 대표 viewport/device matrix를 코드 계약으로 정의한다.

## 범위
- Root bottom navigation QA matrix 정의
- Matrix가 iOS safe-area/notch device와 Android gesture-navigation-sized viewport를 포함하는지 검증
- 실제 simulator screenshot 생성은 이 Sub-AC 범위에서 제외

## 변경 파일
- `src/core/navigation/root-tab-viewport-matrix.ts`
- `src/core/navigation/root-tab-viewport-matrix.test.ts`
- `tsconfig.root-tabs-check.json`
- `plans/20260516_bottom_nav_viewport_matrix.md`
- `context/context_20260516_bottom_nav_viewport_matrix.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- `git diff --check -- ...`

## 롤백
추가한 viewport matrix/test 파일을 제거하고 `tsconfig.root-tabs-check.json` include에서 제외한다.

## 리스크
- 이 Sub-AC는 matrix 정의만 담당하므로 실제 iPhone/Android capture 증거는 후속 QA AC에서 생성해야 한다.
- shared worktree에 sibling-agent 변경이 많아 기존 navigation 구현을 덮지 않는다.

## 결과
- 대표 bottom navigation QA matrix를 코드 계약으로 추가했다.
- Matrix는 safe-area/notch iOS profile인 `iPhone 15` (`393x852`, bottom inset `34`)와 Android gesture-navigation profile인 `Pixel 8 gesture navigation` (`412x915`, bottom inset `0`)를 포함한다.
- 각 profile은 Home, Explore, Paste, Recipes, My 5-slot nav, centered Paste action, reference-link drawer destination, root/Home unmatched-route regression, route mapping, bottom safe-area/gesture clearance를 검증 대상으로 명시한다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check -- src/core/navigation/root-tab-viewport-matrix.ts src/core/navigation/root-tab-viewport-matrix.test.ts tsconfig.root-tabs-check.json plans/20260516_bottom_nav_viewport_matrix.md`
- PASS: 새 파일 범위 forbidden user-facing copy scan에서 `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` hit 없음
- 연결 context: `context/context_20260516_bottom_nav_viewport_matrix.md`
