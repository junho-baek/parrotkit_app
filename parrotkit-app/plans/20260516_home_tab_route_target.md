# 2026-05-16 Home Tab Route Target

## 배경
Issue 6 Sub-AC 4.1은 Home 탭과 root/Home deep link가 Explore 또는 guide detail이 아니라 Home 화면을 렌더링해야 한다.

## 목표
루트 탭의 명시적 route map을 추가해 Home 탭이 `/`로 이동하고 `index` route가 Home screen module을 유지하도록 검증한다.

## 범위
- root tab route/deep-link 계약 테스트 추가
- root tab shell에서 명시적 href 사용
- Home route module export 계약 확인

## 변경 파일
- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-tab-config.test.ts`
- `src/core/navigation/root-native-tabs.tsx`
- `plans/20260516_home_tab_route_target.md`
- `context/context_20260516_home_tab_route_target.md`

## 테스트
- RED: `tsc -p tsconfig.root-tabs-check.json`가 route map 누락으로 실패하는지 확인한다.
- GREEN: 같은 타입 체크 통과.
- 필요 시 전체 `tsc --noEmit --pretty false` 확인.

## 롤백
route map export와 `Tabs.Screen` href options, 테스트 기대값을 제거한다.

## 리스크
- 같은 navigation 파일에 sibling 변경이 많으므로 기존 five-slot Paste nav 계약을 보존하면서 최소 변경한다.

## 결과
- root tab route map 계약에 `rootTabHrefs.index === '/'` 검증을 추가했다.
- `rootTabHrefs.source`는 중심 Paste 액션 계약에 맞춰 `/recipe-create?mode=reference`를 유지한다.
- `RootNativeTabs`의 visible tab screen options가 `rootTabHrefs[tabName]`를 사용하도록 연결되어 Home tab은 root Home deep link로 이동한다.
- `src/app/(tabs)/index.tsx`가 `HomeScreen`을 default export하고, Explore/detail route와 분리되어 있음을 확인했다.

## 검증 결과
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 실패 (`rootTabHrefs` export 없음).
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false`
- PASS: route module 확인: `src/app/(tabs)/index.tsx`는 `HomeScreen`, `src/app/(tabs)/explore.tsx`는 `ExploreScreen`, `src/app/explore-recipe/[recipeId].tsx`는 detail screen을 export한다.
- BLOCKED: `npx -y @google/design.md lint DESIGN.md`는 restricted network에서 `getaddrinfo ENOTFOUND registry.npmjs.org`로 실패했다. local `node_modules/.bin/design.md`도 없음.
- 연결 context: `context/context_20260516_home_tab_route_target.md`
