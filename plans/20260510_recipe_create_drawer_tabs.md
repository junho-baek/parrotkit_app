# Recipe Create Drawer Tabs Plan

## 배경
- 플러스 버튼으로 진입하는 `Start a new recipe` 화면이 현재 별도 full-screen 선택 UI처럼 보인다.
- 사용자는 기본 동작이 더 명확하게 `Start new recipe`가 되길 원했고, UI는 Source drawer처럼 부드러운 bottom drawer 느낌이길 요청했다.
- 3개 생성 모드는 세로 카드보다 상단 icon tab 형태가 더 자연스럽고, `Reference link`와 `Brand context`에는 Pro 라벨이 필요하다.
- 수동 레시피 생성은 별도 입력 UI보다 레시피 실행 화면에서 바로 scene을 추가하며 만드는 흐름이 더 맞다는 피드백이 있었다.

## 목표
- Recipes 탭의 플러스 기본 동작을 manual `Start new recipe`로 바꾼다.
- `recipe-create` 화면은 transparent modal + bottom drawer처럼 보이게 한다.
- `reference`, `manual`, `brand` 3개 모드를 상단 icon tab으로 전환한다.
- `reference`와 `brand` tab/detail에 Pro 라벨을 표시한다.
- manual CTA는 별도 생성 form으로 머무르지 않고 새 draft recipe를 만든 뒤 바로 `/recipe/:id` 실행 화면으로 이동한다.

## 범위
- In scope:
  - `recipe-create-flow` 순수 helper/test 추가
  - `RecipeCreateScreen` drawer/tab UI 및 manual CTA 연결
  - Recipes FAB 기본 mode 조정
  - `recipe-create` Stack presentation을 drawer-like transparent modal로 조정
- Out of scope:
  - 실제 Pro 결제/권한 처리
  - 실제 reference/brand 분석 backend
  - Source drawer form 전체 리디자인

## 변경 파일
- Add: `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
- Add: `parrotkit-app/src/features/recipes/lib/recipe-create-flow.test.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- Modify: `parrotkit-app/src/app/_layout.tsx`
- Add/Modify: `context/context_20260510_recipe_create_drawer_tabs.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- `RecipeCreateScreen`을 이전 세로 카드 선택 UI로 되돌리고, flow helper/test와 Stack transparent modal 변경을 제거한다.

## 리스크
- `recipe-create` route가 transparent modal로 바뀌면서 배경 터치/뒤로가기 체감이 달라질 수 있다.
- manual CTA가 즉시 recipe detail로 이동하기 때문에 기존 manual form placeholder를 기대하는 데모 플로우는 바뀐다.

## 결과
- 플러스 FAB 기본 mode를 `manual`로 바꿨다.
- `recipe-create` route를 transparent modal로 바꾸고, 화면 UI를 bottom drawer 형태로 재구성했다.
- 3개 mode를 상단 icon tab으로 전환했고, `Reference link`와 `Brand context`에는 Pro 라벨을 붙였다.
- manual CTA는 새 draft recipe를 만든 뒤 바로 recipe execution board(`/recipe/:id`)로 이동한다.
- reference/brand CTA는 기존 Source action drawer로 연결한다.
- 연결 context: `context/context_20260510_recipe_create_drawer_tabs.md`
