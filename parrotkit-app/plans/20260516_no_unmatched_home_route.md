# 2026-05-16 No Unmatched Home Route

## 배경
Issue 6 AC 8은 QA에서 사용하는 Home/root navigation paths가 Expo Router의 Unmatched Route로 빠지지 않아야 한다.

## 목표
Home tab, root `/`, `/home`, route-group Home aliases가 모두 의도한 Home route 또는 canonical Home redirect로 해석되는 계약을 고정한다.

## 범위
- 기존 five-slot bottom navigation과 Paste drawer behavior는 변경하지 않는다.
- Home route/deep-link resolution guard만 추가하거나 보강한다.
- QA screenshot/local output은 커밋 대상에 포함하지 않는다.

## 변경 파일
- `src/core/navigation/root-tab-config.test.ts`
- 필요 시 Home route shim 파일
- `plans/20260516_no_unmatched_home_route.md`
- `context/context_20260516_no_unmatched_home_route.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- DESIGN.md guard와 금지 user-facing copy 검색

## 롤백
추가한 Home unmatched-route guard와 필요 시 route shim을 제거해 이전 route 계약으로 되돌린다.

## 리스크
- 실제 iOS/Android runtime deep-link smoke는 별도 QA AC의 책임이며, 이번 작업은 compile-time route tree guard로 회귀를 막는다.

## 결과
- root stack에 `home` screen을 명시 등록해 `/home` redirect route가 stack route table에서 빠지지 않도록 했다.
- root tab route contract test에 QA Home paths `/`, `/(tabs)`, `/(tabs)/index`, `/home`의 route module resolution guard를 추가했다.
- `tsconfig.root-tabs-check.json`에 `src/app/_layout.tsx`와 `src/app/home.tsx`를 포함해 focused TypeScript 검증이 Home redirect route까지 확인하도록 했다.

## 검증 결과
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false`
- PASS: `git diff --check`
- PASS: DESIGN.md guard 문구 확인 (`Bottom navigation and creation entry`, box-in-box/redundant CTA guardrails)
- PASS: 변경 파일 금지 user-facing copy 검색 결과 없음
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`는 restricted network에서 npm registry DNS 실패(`getaddrinfo ENOTFOUND registry.npmjs.org`)로 완료할 수 없었다.
- 연결 context: `context/context_20260516_no_unmatched_home_route.md`
