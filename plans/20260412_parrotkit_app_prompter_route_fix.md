# Plan - Parrotkit App Prompter Route Fix

## 배경
- 사용자가 native prompter 진입 시 `Unmatched Route` 화면을 확인했다.
- 현재 Expo Router 구조는 `recipe/[recipeId].tsx` 파일과 `recipe/[recipeId]/prompter.tsx` nested route를 동시에 두고 있어, dynamic segment 아래 child route 해석이 꼬일 가능성이 높다.

## 목표
- 레시피 상세 route를 folder `index.tsx` 구조로 정리해 `/recipe/[recipeId]` 와 `/recipe/[recipeId]/prompter` 둘 다 정상 인식되게 만든다.
- 기존 화면 흐름과 stack animation 설정은 유지한다.

## 범위
- `parrotkit-app/src/app/recipe/[recipeId].tsx`
- `parrotkit-app/src/app/recipe/[recipeId]/index.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_prompter_route_fix.md`
- `context/context_20260412_parrotkit_app_prompter_route_fix.md`
- `parrotkit-app/src/app/recipe/[recipeId].tsx`
- `parrotkit-app/src/app/recipe/[recipeId]/index.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- `recipe/[recipeId]/index.tsx`를 제거하고 기존 `recipe/[recipeId].tsx` 단일 파일 구조로 되돌린다.

## 리스크
- Expo Router route cache가 남아 있으면 로컬 dev server 재시작이 한 번 필요할 수 있다.

## 결과
- `recipe/[recipeId].tsx` 단일 파일 route를 `recipe/[recipeId]/index.tsx` 구조로 옮겨 nested `prompter` child route와 충돌하지 않도록 정리했다.
- `expo-dev-client`를 추가해 현재 기본 `expo start --dev-client` 실행 방식과 의존성을 맞췄다.
- Watchman watch를 재설정하고 `npx expo run:ios -d 'iPhone 17'`로 새 dev client를 재빌드해 `ExpoCamera` 네이티브 모듈이 포함된 시뮬레이터 앱을 다시 설치했다.
- `cd parrotkit-app && npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_prompter_route_fix.md`
