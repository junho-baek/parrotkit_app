# 2026-05-16 Sub-AC 10.4.4 Verification Evidence

## 배경
Issue 6 Sub-AC 10.4.4는 restored Home, Explore, Paste, Recipes, My bottom navigation 검증 결과를 tested configuration별로 기록해야 한다. 이 작업은 기존 iOS/Android layout verification 결과를 하나의 evidence trail로 묶고, screenshot이 없는 경우 QA notes와 edge-case findings를 명시한다.

## 목표
각 tested configuration별로 five-slot nav, centered Paste CTA, Paste drawer behavior, Home/root route correctness, tab route mapping, safe-area clearance 검증 근거를 기록한다.

## 범위
- `DESIGN.md` source-of-truth 재확인
- 최신 iOS/Android bottom nav verification context 확인
- 현재 screenshot availability 확인 및 stale screenshot exclusion 기록
- focused navigation/layout/type checks 재실행
- QA evidence report와 context 작성

## 변경 파일
- `plans/20260516_sub_ac_10_4_4_verification_evidence.md`
- `context/context_20260516_sub_ac_10_4_4_verification_evidence.md`
- `output/reports/20260516_sub_ac_10_4_4_verification_evidence.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts`
- DESIGN.md guardrail / forbidden-copy notes

## 롤백
Verification-only 산출물인 이 plan, context, QA report를 제거한다. 앱 코드 변경은 포함하지 않는다.

## 리스크
- Native simulator/emulator screenshot capture는 이 sandbox에서 이전 Sub-AC에서 blocked로 기록되었다.
- Existing `output/playwright` screenshots are from an older three-slot nav and must not be used as passing evidence for the five-slot Paste nav.
- Shared worktree에 sibling-agent 변경이 많으므로 commit/push하지 않는다.

## 결과
- `output/reports/20260516_sub_ac_10_4_4_verification_evidence.md`에 four-viewport evidence matrix를 기록했다.
- iPhone 13 mini, iPhone 15, Pixel 8 gesture navigation, Galaxy compact navigation bar 각각에 대해 five-slot nav, centered Paste, route/deep-link, paste drawer, safe-area clearance 검증 근거와 QA notes를 남겼다.
- Existing `output/playwright` screenshots는 older three-slot nav를 보여 passing evidence에서 제외한다고 명시했다.
- 앱 코드 변경은 수행하지 않았다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-viewport-matrix.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-ios-layout-verification.test.ts`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-android-layout-verification.test.ts`
- PASS: `git diff --check -- plans/20260516_sub_ac_10_4_4_verification_evidence.md`
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md` failed with `ENOTFOUND registry.npmjs.org`; package is not installed locally and network is restricted.

## 연결 context
- `context/context_20260516_sub_ac_10_4_4_verification_evidence.md`
