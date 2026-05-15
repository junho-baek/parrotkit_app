# 2026-05-16 Route Recipes Correct

## 배경
Issue 6 AC 6은 하단 Recipes 탭이 Source나 의도하지 않은 경로가 아니라 저장된 레시피 / 레시피 목록 화면을 열어야 한다고 요구한다. 현재 sibling 작업으로 5-slot nav와 Paste 중심 액션이 추가되어 있어 Recipes 경로 계약이 별도로 고정되어야 한다.

## 목표
Recipes 탭과 QA deep-link 경로가 `/recipes` 레시피 목록 화면으로 해석되도록 navigation route contract를 검증하고 필요한 최소 수정을 적용한다.

## 범위
- `rootTabHrefs.recipes`가 Source/Paste 액션이 아닌 Recipes 목록 경로를 가리키는지 확인한다.
- Recipes 탭 파일 라우트가 `RecipesScreen`을 렌더링하는지 확인한다.
- route contract test에 Recipes 전용 회귀 검증을 추가한다.

## 변경 파일
- `src/core/navigation/root-tab-config.test.ts`
- 필요 시 `src/core/navigation/root-tab-config.ts`
- `context/context_20260516_route_recipes_correct.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- DESIGN.md 관련 guardrail 문구 확인
- navigation 범위에서 금지 user-facing copy 추가 여부 검색

## 롤백
AC 6에서 추가한 Recipes route contract 검증과 route config 변경이 있다면 되돌린다.

## 리스크
- sibling agents가 같은 navigation 파일을 동시에 수정 중이므로 기존 Paste/Home/My 작업을 덮지 않고 Recipes 관련 계약만 좁게 수정해야 한다.
- 실제 iOS/Android visual QA는 별도 AC 범위이며, 여기서는 route correctness를 타입/계약 테스트로 우선 고정한다.

## 결과
- `src/core/navigation/root-tab-config.test.ts`에 Recipes 전용 route regression guard를 추가했다.
- `rootTabHrefs.recipes`가 Paste/Source action destination과 같아지면 실패하도록 고정했다.
- `rootTabHrefs.recipes`가 `/recipes` deep-link를 유지하는지 검증한다.
- `src/app/(tabs)/recipes.tsx`가 `RecipesScreen`을 default export하는지 검증해 Source 또는 다른 화면으로 잘못 연결되는 회귀를 잡는다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: DESIGN.md guardrail 문구 확인
- PASS: navigation 범위 금지 copy 검색. 결과는 기존 내부 `QuickShoot` 식별자와 test 문구뿐이며 AC 6에서 새 user-facing copy를 추가하지 않았다.
- BLOCKED: 전체 `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`는 sibling 작업의 `src/core/navigation/paste-drawer-state.test.ts`가 없는 `./paste-drawer-state`를 import해 실패한다.
- 연결 context: `context/context_20260516_route_recipes_correct.md`
