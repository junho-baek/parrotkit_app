# Context - Parrotkit App Recipe Stack Name Fix

## 작업 요약
- `recipe/[recipeId]` detail route를 folder형 `index.tsx`로 옮긴 뒤에도 root stack은 여전히 예전 screen name인 `recipe/[recipeId]`를 보고 있었다.
- 실제 Expo Router route tree에는 `recipe/[recipeId]/index`가 등록되므로, 이 mismatch 때문에 `[Layout children]: No route named "recipe/[recipeId]" exists` 경고가 계속 남았다.
- root stack screen name을 `recipe/[recipeId]/index`로 맞춰 경고 원인을 제거했다.

## 변경 파일
- `plans/20260412_parrotkit_app_recipe_stack_name_fix.md`
- `context/context_20260412_parrotkit_app_recipe_stack_name_fix.md`
- `parrotkit-app/src/app/_layout.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- 이미 켜져 있던 Metro가 이전 route manifest를 잠깐 들고 있을 수 있어서, 경고가 바로 안 사라지면 `npm start -- --clear`로 한 번 재시작하는 편이 안전하다.
