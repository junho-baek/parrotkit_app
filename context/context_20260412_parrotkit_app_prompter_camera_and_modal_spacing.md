# Context - Parrotkit App Prompter Camera And Modal Spacing

## 작업 요약
- `source-actions` 시트는 backdrop을 absolute overlay로 분리하고, 루트 레이아웃을 `justify-end` 기준으로 다시 감아 모달이 바닥에 더 직접 붙는 느낌으로 정리했다.
- 하단 spacing은 `Math.max(insets.bottom, 12)`로 조정해 홈 인디케이터 안전 거리는 유지하면서 CTA 아래 공백을 조금 더 줄였다.
- `expo-camera`를 추가하고 `recipe/[recipeId]/prompter` 풀스크린 route를 만들어, 실제 네이티브 카메라 프리뷰 위에 선택한 script/cue 요소가 overlay로 보이도록 mock 플로우를 붙였다.
- `MockWorkspaceProvider`는 이제 레시피별/씬별 prompter selection을 local source-of-truth로 들고 있고, `RecipeDetailScreen`의 `Prompter` 탭은 scene 선택, element 선택, native prompter 진입 CTA를 담당한다.

## 변경 파일
- `plans/20260412_parrotkit_app_prompter_camera_and_modal_spacing.md`
- `context/context_20260412_parrotkit_app_prompter_camera_and_modal_spacing.md`
- `parrotkit-app/app.json`
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/recipe/[recipeId]/prompter.tsx`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/features/recipes/lib/mock-prompter-elements.ts`
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과
- `cd parrotkit-app && npx expo config --type public`
  - 결과: 통과

## 남은 리스크
- 이번 프롬프터 화면은 first-pass native mock이라서 웹 `CameraShooting`의 drag/resize/layout editor까지는 아직 옮기지 않았다.
- 카메라 permission prompt와 실제 기기 체감은 시뮬레이터와 조금 다를 수 있어, 다음 단계에서는 iOS 실제 디바이스에서 overlay 위치와 홈 인디케이터 간격을 한 번 더 보는 편이 좋다.
- selection state는 현재 local provider만 기준이라, 이후 서버 저장이 붙을 때 recipe scene schema와 동기화 ownership을 다시 정리해야 한다.
