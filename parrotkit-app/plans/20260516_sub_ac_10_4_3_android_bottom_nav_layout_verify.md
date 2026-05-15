# 2026-05-16 Sub-AC 10.4.3 Android Bottom Nav Layout Verify

## 배경
Issue 6 Sub-AC 10.4.3은 복원된 Home, Explore, Paste, Recipes, My bottom navigation을 대표 Android viewport에서 확인해야 한다. 검증 대상은 item spacing, centered Paste prominence, tap target, Android gesture/navigation bar 영역 근처 동작이다.

## 목표
대표 Android viewport에서 bottom navigation이 `DESIGN.md`의 app-style five-slot model과 gesture/navigation bar clearance 요구를 만족하는지 확인하고 결과를 기록한다.

## 범위
- `DESIGN.md` bottom navigation/source copy 확인
- 최신 navigation/safe-area/viewport matrix context 확인
- Android 크기 viewport layout contract 검증
- focused TypeScript/navigation contract 검증

## 변경 파일
- `src/core/navigation/root-tab-android-layout-verification.test.ts`
- `tsconfig.root-tabs-check.json`
- `plans/20260516_sub_ac_10_4_3_android_bottom_nav_layout_verify.md`
- `context/context_20260516_sub_ac_10_4_3_android_bottom_nav_layout_verify.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts`
- DESIGN.md guardrail check

## 롤백
추가한 Android layout verification test를 제거하고 `tsconfig.root-tabs-check.json` include에서 제외한다. 검증 문서와 context 문서도 함께 제거한다.

## 리스크
- Native Android emulator/browser capture가 환경에서 불가능할 수 있어 source-level layout contract와 TypeScript 검증을 함께 사용한다.
- Shared worktree에 sibling-agent 변경이 많으므로 verification-only 변경은 commit/push하지 않는다.

## 결과
- Android representative viewport coverage를 `Pixel 8 gesture navigation` (`412x915`, bottom inset `0`)와 `Galaxy compact navigation bar` (`360x800`, bottom inset `24`)로 구성했다.
- `src/core/navigation/root-tab-android-layout-verification.test.ts`를 추가해 five-slot spacing, centered Paste position, larger Paste diameter, 48px tap target, edge target containment, minimum gesture/navigation bar bottom clearance, tab bar height를 검증했다.
- Native Android emulator capture는 이 sandbox에서 수행하지 않았고, source-level Android layout contract로 검증했다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check -- src/core/navigation/root-tab-viewport-matrix.ts src/core/navigation/root-tab-android-layout-verification.test.ts tsconfig.root-tabs-check.json plans/20260516_sub_ac_10_4_3_android_bottom_nav_layout_verify.md`
- PASS: forbidden user-facing copy scan returned no hits in the Android verification files and plan.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed with `ENOTFOUND registry.npmjs.org`; the package is not installed locally and network is restricted.

## Android layout measurements
- `Pixel 8 gesture navigation`: slot width `80.0px`, minimum tap target `48px`, Paste circle `64px`, tab bar height `76px`, bottom padding `10px`.
- `Galaxy compact navigation bar`: slot width `69.6px`, minimum tap target `48px`, Paste circle `64px`, tab bar height `90px`, bottom padding `24px`.

## 연결 context
- `context/context_20260516_sub_ac_10_4_3_android_bottom_nav_layout_verify.md`
