# Context - Parrotkit App Prompter Route Fix

## 작업 요약
- `Unmatched Route`의 직접 원인은 카메라 권한이 아니라 Expo Router route 구조였다.
- 기존에는 `parrotkit-app/src/app/recipe/[recipeId].tsx` 파일과 `parrotkit-app/src/app/recipe/[recipeId]/prompter.tsx` nested route를 동시에 두고 있어 dynamic child route 인식이 꼬일 수 있는 상태였다.
- 레시피 상세 route를 `parrotkit-app/src/app/recipe/[recipeId]/index.tsx` 구조로 옮겨 `/recipe/[recipeId]` 와 `/recipe/[recipeId]/prompter`가 같은 segment tree 아래에서 정리되도록 수정했다.
- 추가로 `expo-dev-client`를 설치하고 Watchman watch를 재설정한 뒤 `npx expo run:ios -d 'iPhone 17'`로 새 iOS dev client를 재빌드했다.
- 이번 로그의 `Cannot find native module 'ExpoCamera'`는 route 문제가 아니라, `expo-camera`를 추가한 뒤 기존 dev build를 재설치하지 않아 생긴 네이티브 바이너리 mismatch였다.

## 변경 파일
- `plans/20260412_parrotkit_app_prompter_route_fix.md`
- `context/context_20260412_parrotkit_app_prompter_route_fix.md`
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/src/app/recipe/[recipeId]/index.tsx`
- `parrotkit-app/src/app/recipe/[recipeId].tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과
- `watchman watch-del '/Users/junho/project/RN_practice' ; watchman watch-project '/Users/junho/project/RN_practice'`
  - 결과: watch 재설정 완료
- `cd parrotkit-app && npx expo run:ios -d 'iPhone 17'`
  - 결과: `Build Succeeded`, 새 dev client 설치 및 실행

## 남은 리스크
- Metro가 오래된 route manifest를 계속 잡고 있으면 `npm start -- --clear`로 한 번 더 cache clear가 필요할 수 있다.
- 이번 수정은 route tree와 native build mismatch를 정리한 것이고, 실제 camera overlay UX는 앱 런타임에서 한 번 더 눈으로 확인하는 편이 좋다.
