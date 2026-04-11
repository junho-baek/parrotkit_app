# Plan - Parrotkit App Prompter Camera And Modal Spacing

## 배경
- 사용자는 `source-actions` 모달 하단 여백이 여전히 어색하다고 지적했다.
- 동시에 프롬프터 기능의 핵심을 "네이티브 카메라 위에 레시피에서 선택한 요소가 뜨는 것"으로 명확히 정의했다.
- 현재 RN 앱은 `prompter` 탭 안에서 텍스트만 전환하는 mock 상태라, 실제 카메라 surface와 선택 상태 ownership이 아직 없다.

## 목표
- `source-actions` 시트 하단 레이아웃을 다시 정리해 불필요하게 떠 보이는 여백을 줄인다.
- 레시피 상세에서 선택한 script/cue 요소를 별도 네이티브 카메라 프롬프터 화면으로 넘기는 mock 플로우를 추가한다.
- 서버 로직 없이 local source-of-truth 기준으로 selection -> camera overlay 흐름을 완성한다.

## 범위
- `parrotkit-app/app.json`
- `parrotkit-app/package.json`
- `parrotkit-app/package-lock.json`
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/recipe/[recipeId]/prompter.tsx`
- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_prompter_camera_and_modal_spacing.md`
- `context/context_20260412_parrotkit_app_prompter_camera_and_modal_spacing.md`
- 위 범위에 포함된 RN 앱 파일들

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`

## 롤백
- `expo-camera` 의존성과 prompter route를 제거하고, `recipe-detail-screen.tsx`를 기존 단순 mock detail 상태로 되돌린다.
- `source-action-sheet-screen.tsx` 레이아웃을 직전 버전으로 복원한다.

## 리스크
- `expo-camera`는 권한/네이티브 설정이 필요해 시뮬레이터와 실제 기기 체감이 다를 수 있다.
- 현재는 local mock selection state이므로 이후 서버 저장이 붙을 때 provider ownership을 다시 정리할 수 있다.
- 카메라 오버레이는 첫 버전에서 cue 편집보다 "선택된 요소 노출"을 우선하므로 세밀한 drag/resize UX는 후속 범위다.

## 결과
- `source-actions` modal은 backdrop absolute overlay + bottom-anchored `KeyboardAvoidingView` 구조로 다시 감아 하단 여백이 덜 떠 보이도록 조정했다.
- `expo-camera`를 추가하고 `recipe/[recipeId]/prompter` 풀스크린 route를 만들어 native camera preview를 붙였다.
- `RecipeDetailScreen`의 `Prompter` 탭은 scene별 script/cue 선택 UI와 camera 진입 CTA를 제공하도록 바꿨다.
- `MockWorkspaceProvider`는 recipe/scene 기준 prompter selection을 local source-of-truth로 관리하도록 확장했다.
- `cd parrotkit-app && npx tsc --noEmit`, `cd parrotkit-app && npx expo config --type public` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_prompter_camera_and_modal_spacing.md`
