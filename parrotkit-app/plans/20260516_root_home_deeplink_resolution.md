# 2026-05-16 Root Home Deeplink Resolution

## 배경
Issue 6 Sub-AC 4.2는 root/Home deeplink가 iOS와 Android에서 Unmatched Route로 빠지지 않고 Home screen으로 해석되어야 한다.

## 목표
Root `/`와 Home `/home` deeplink가 Home route로 수렴하도록 route 계약을 고정한다.

## 범위
- Home deeplink route guard를 추가한다.
- 필요한 경우 `/home` route를 `/`로 redirect해 tab shell의 Home screen으로 진입시킨다.
- 기존 five-slot bottom navigation 계약은 유지한다.

## 변경 파일
- `src/core/navigation/root-tab-config.test.ts`
- `src/app/home.tsx`

## 테스트
- RED: root tab 계약 체크가 `/home` route 부재로 실패하는지 확인한다.
- GREEN: `tsc -p tsconfig.root-tabs-check.json`와 focused route test를 통과시킨다.
- DESIGN.md guard 문구와 금지 copy 검색을 확인한다.

## 롤백
`src/app/home.tsx`와 관련 test guard를 제거해 이전 route table로 되돌린다.

## 리스크
- Expo Router route-group 해석은 런타임 의존성이 있으므로, 이번 변경은 compile-time route module guard로 회귀를 막고 실제 simulator QA는 상위 AC에서 수행해야 한다.

## 결과
- `/home` deep link route인 `src/app/home.tsx`를 추가했다.
- `/home`은 HomeScreen을 직접 렌더링하지 않고 `<Redirect href="/" />`로 canonical root Home route에 수렴한다.
- root tab href 계약은 `index: '/'`를 유지한다.

## 검증 결과
- RED 확인: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`가 `src/app/home.tsx` 부재로 `ENOENT` 실패했다.
- GREEN 확인: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- GREEN 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- GREEN 확인: `./node_modules/.bin/tsc --noEmit --pretty false` 통과.
- DESIGN.md guard 확인: bottom navigation 섹션과 box-in-box/redundant CTA guardrail 문구를 확인했다.
- 금지 copy 확인: 변경 파일 범위에서 `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` 검색 결과가 없었다.
- BLOCKED: `npx -y @google/design.md lint DESIGN.md`는 restricted network에서 npm registry DNS 실패(`getaddrinfo ENOTFOUND registry.npmjs.org`)로 실행할 수 없었다.
- 연결 context: `context/context_20260516_root_home_deeplink_resolution.md`
