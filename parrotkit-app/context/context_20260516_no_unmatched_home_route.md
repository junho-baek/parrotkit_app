# Context 2026-05-16 No Unmatched Home Route

## 작업
Issue 6 AC 8: QA navigation paths for Home이 Expo Router의 Unmatched Route로 빠지지 않도록 Home/root route contract를 보강했다.

## DESIGN.md 확인
- `DESIGN.md`를 먼저 확인했다.
- `Bottom navigation and creation entry`와 box-in-box/redundant CTA guardrail을 확인했다.
- 이번 작업은 UI surface를 추가하지 않고 route registration/test guard만 변경했다.

## 변경
- `src/app/_layout.tsx`
  - root stack에 `<Stack.Screen name="home" />`를 명시 등록했다.
  - `/home` file route가 redirect shim으로 존재하더라도 stack route table에서 누락되는 회귀를 막는다.
- `src/core/navigation/root-tab-config.test.ts`
  - QA Home paths `/`, `/(tabs)`, `/(tabs)/index`, `/home`가 실제 Home route module 또는 canonical Home redirect로 해석되는지 검증한다.
  - `/home` redirect route가 root stack에 등록되어 있는지 검증한다.
- `tsconfig.root-tabs-check.json`
  - focused route TypeScript check가 root layout과 `/home` redirect shim까지 포함하도록 보강했다.
- `plans/20260516_no_unmatched_home_route.md`
  - 작업 계획과 결과를 기록했다.

## 검증
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false`
- PASS: `git diff --check`
- PASS: DESIGN.md guard 문구 확인 (`Bottom navigation and creation entry`, box-in-box/redundant CTA guardrails)
- PASS: 변경 파일 금지 user-facing copy 검색 결과 없음
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - restricted network에서 npm registry DNS 실패: `getaddrinfo ENOTFOUND registry.npmjs.org`.

## 리스크
- 실제 iOS/Android simulator에서 deeplink를 열어보는 runtime QA는 수행하지 않았다.
- 현재 worktree에는 sibling-agent 변경과 로컬 산출물이 많아 이번 AC만 분리 commit/push하지 않았다.
