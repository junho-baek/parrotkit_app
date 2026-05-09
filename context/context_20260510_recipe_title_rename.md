# Recipe Title Rename Context

## 배경
- Blank recipe 생성 시 초기 title은 niche/goal 조합으로 자동 생성된다.
- 사용자는 상단 바를 눌러 recipe 이름을 바꾸는 방식을 제안했다.

## 변경 사항
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
  - `updateRecipeTitle(recipeId, title)` API를 추가했다.
  - Workspace recipe title과 matching recent reference title을 함께 갱신한다.
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Shoot board header title을 pressable로 바꿨다.
  - Chevron 대신 pencil affordance를 사용해 rename 가능성을 명확히 했다.
  - Rename modal을 추가했다.
  - 저장 시 현재 board title을 즉시 갱신하고 mock workspace에도 반영한다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- iOS Simulator + Metro reload:
  - Blank recipe 생성 후 0 cuts board가 열리는 것을 확인했다.
  - Header title tap으로 rename modal이 열리는 것을 확인했다.
  - `Morning Beauty Shoot`로 저장 후 header title이 즉시 변경되는 것을 확인했다.

## 리스크
- 현재 title 변경은 mock workspace runtime state에만 저장된다.
- 실제 DB/서버 저장이 붙으면 `updateRecipeTitle`은 API mutation으로 교체해야 한다.
