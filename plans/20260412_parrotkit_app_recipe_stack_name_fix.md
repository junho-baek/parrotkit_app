# Plan - Parrotkit App Recipe Stack Name Fix

## 배경
- route 구조를 `recipe/[recipeId]/index.tsx`로 옮긴 뒤에도 root stack은 여전히 `recipe/[recipeId]` 이름을 참조하고 있다.
- 이 때문에 런타임에서 `[Layout children]: No route named "recipe/[recipeId]" exists` 경고가 남는다.

## 목표
- root stack screen name을 실제 Expo Router route tree와 일치시키고 경고를 제거한다.

## 범위
- `parrotkit-app/src/app/_layout.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_recipe_stack_name_fix.md`
- `context/context_20260412_parrotkit_app_recipe_stack_name_fix.md`
- `parrotkit-app/src/app/_layout.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- stack route name을 이전 `recipe/[recipeId]` 값으로 되돌린다.

## 리스크
- Metro가 오래된 route manifest를 물고 있으면 dev server 재시작 전까지 경고가 잠깐 남을 수 있다.

## 결과
- root stack의 detail screen name을 `recipe/[recipeId]`에서 `recipe/[recipeId]/index`로 수정해 현재 folder-based route 구조와 맞췄다.
- `cd parrotkit-app && npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_recipe_stack_name_fix.md`
