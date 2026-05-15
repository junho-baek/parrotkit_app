# 2026-05-16 Sub-AC 10.4.2 iOS Bottom Nav Layout Verify

## 배경
Issue 6 Sub-AC 10.4.2는 복원된 five-slot bottom navigation을 대표 iOS viewport에서 실제로 확인해야 한다. 검증 대상은 Home, Explore, Paste, Recipes, My spacing, center Paste prominence, tap target, bottom safe-area padding이다.

## 목표
대표 iOS viewport에서 bottom navigation이 `DESIGN.md`의 app-style five-slot model과 safe-area 요구를 만족하는지 확인하고 결과를 기록한다.

## 범위
- `DESIGN.md` bottom navigation/source copy 확인
- 최신 navigation/safe-area/viewport matrix context 확인
- iOS 크기 viewport에서 로컬 앱 bottom nav 캡처 및 레이아웃 확인
- focused TypeScript/navigation contract 검증

## 변경 파일
- `plans/20260516_sub_ac_10_4_2_ios_bottom_nav_layout_verify.md`
- `context/context_20260516_sub_ac_10_4_2_ios_bottom_nav_layout_verify.md`
- 필요 시 `output/` 하위 QA 캡처/리포트

## 테스트
- Representative iOS viewport visual capture
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- DESIGN.md guardrail check

## 롤백
검증 문서와 QA 산출물만 제거하면 된다. 앱 코드 변경이 생기면 해당 변경을 별도 검토 후 되돌린다.

## 리스크
- Shared worktree에 sibling-agent 변경이 많으므로 verification-only 변경은 commit/push하지 않는다.
- Web viewport 검증은 native iOS simulator와 safe-area reporting이 다를 수 있어, 실제 capture 결과와 safe-area contract test를 함께 본다.

## 결과
- Representative iOS verification coverage를 `iPhone 13 mini` (`375x812`, bottom inset `34`)와 `iPhone 15` (`393x852`, bottom inset `34`)로 확장했다.
- `src/core/navigation/root-tab-ios-layout-verification.test.ts`를 추가해 five-slot spacing, centered Paste position, larger Paste diameter, 48px tap target, edge target containment, bottom safe-area padding, tab bar height를 검증했다.
- Native Simulator capture는 환경 권한 문제로 직접 생성하지 못했다.
- Expo web capture는 local server가 bind되지 않아 직접 생성하지 못했다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts`
- PASS: `git diff --check -- src/core/navigation/root-tab-viewport-matrix.ts src/core/navigation/root-tab-ios-layout-verification.test.ts tsconfig.root-tabs-check.json plans/20260516_sub_ac_10_4_2_ios_bottom_nav_layout_verify.md`
- PASS: DESIGN.md guardrail scan confirmed bottom-nav source requirements; forbidden-copy hits are only `DESIGN.md` guardrail text and existing internal identifier `homeQuickShootChromeHidden`.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed with `ENOTFOUND registry.npmjs.org` because the package is not installed locally and network is restricted.

## iOS layout measurements
- `iPhone 13 mini`: slot width `72.6px`, minimum tap target `48px`, Paste circle `64px`, tab bar height `100px`, bottom padding `34px`.
- `iPhone 15`: slot width `76.2px`, minimum tap target `48px`, Paste circle `64px`, tab bar height `100px`, bottom padding `34px`.

## 연결 context
- `context/context_20260516_sub_ac_10_4_2_ios_bottom_nav_layout_verify.md`
