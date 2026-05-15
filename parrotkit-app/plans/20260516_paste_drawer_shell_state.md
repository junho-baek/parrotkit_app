# 2026-05-16 Paste Drawer Shell State

## 배경
Issue 6 Sub-AC 3.2.1은 중심 Paste 하단 네비게이션 액션이 route-only 이동이 아니라 명시적인 paste drawer/window shell을 열고 닫는 상태를 가져야 한다.

## 목표
하단 네비게이션의 중심 `Paste` 버튼을 누르면 reference link 입력이 보이는 recipe creation drawer가 열리고, backdrop/close affordance로 닫을 수 있게 한다.

## 범위
- Root bottom navigation에서 Paste drawer open/close state를 소유한다.
- 기존 recipe creation drawer UI를 재사용하되 reference mode로 열 수 있게 파라미터화한다.
- state contract를 root tab TypeScript check에 포함한다.

## 변경 파일
- `src/core/navigation/root-native-tabs.tsx`
- `src/core/navigation/paste-drawer-state.ts`
- `src/core/navigation/paste-drawer-state.test.ts`
- `src/features/recipes/screens/recipe-create-screen.tsx`
- `tsconfig.root-tabs-check.json`
- `plans/20260516_paste_drawer_shell_state.md`
- `context/context_20260516_paste_drawer_shell_state.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- DESIGN.md 관련 문구 및 금지 copy 검색

## 롤백
Root navigation의 local Paste drawer state와 `RecipeCreateScreen` props를 제거하고 기존 `/recipe-create?mode=reference` route 이동 방식으로 되돌린다.

## 리스크
- route modal과 nav-owned drawer가 같은 component를 공유하므로 close/create 콜백 경로가 모두 타입 검증되어야 한다.

## 결과
- `Paste` 중심 tab button이 local drawer open state를 켜도록 변경했다.
- root navigation layer에 `RecipeCreateScreen` drawer shell을 absolute overlay로 렌더링하고 `initialMode="reference"`로 열도록 연결했다.
- drawer backdrop/close affordance는 `onClose` 콜백으로 local state를 닫고, recipe 생성 완료 시 drawer를 닫은 뒤 생성된 recipe detail로 이동하도록 연결했다.
- route 기반 `/recipe-create` 화면은 기존 동작을 유지하도록 `RecipeCreateScreen` props를 optional로 추가했다.
- `paste-drawer-state` contract를 추가하고 root tabs TypeScript check에 포함했다.

## 검증 결과
- RED 확인: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`가 `Cannot find module './paste-drawer-state'`로 실패했다.
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `git diff --check -- src/core/navigation/root-native-tabs.tsx src/core/navigation/paste-drawer-state.ts src/core/navigation/paste-drawer-state.test.ts src/features/recipes/screens/recipe-create-screen.tsx tsconfig.root-tabs-check.json plans/20260516_paste_drawer_shell_state.md`
- PASS: DESIGN.md 관련 source check 및 금지 copy 검색. 검색 hit는 기존 내부 식별자/test 문구뿐이며 새 user-facing 금지 copy 추가 없음.
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`). repo-local DESIGN.md lint binary/script도 없다.
- 연결 context: `context/context_20260516_paste_drawer_shell_state.md`
