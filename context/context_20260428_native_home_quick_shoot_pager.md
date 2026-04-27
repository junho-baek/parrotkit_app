# 20260428 Native Home Quick Shoot Pager

## 요약
- Home, Quick Shoot, Recipe Draft Preview를 하나의 실제 horizontal pager로 재구성했다.
- 기존 fake preview 방식 대신 실제 Home UI와 Quick Shoot UI가 sibling page로 mount되어 스와이프 중 다음 화면이 실제로 보인다.
- Quick Shoot 카메라는 UI는 살아있되 평소에는 dormant 상태이고, Quick Shoot 노출률 70% 이상 또는 Quick Shoot page settle 후에만 `CameraView`가 활성화된다.

## 구현
- `HomeWorkspaceSurface`로 기존 Home 화면 내용을 분리하고, `(tabs)/index`의 HomeScreen은 새 pager screen을 export하도록 바꿨다.
- `QuickShootCameraSurface`로 Quick Shoot UI, prompter, recording, review, native gallery save 동작을 route-independent surface로 분리했다.
- `HomeQuickShootPagerScreen`에서 page order를 `Recipe Preview / Quick Shoot / Home`으로 두고 Home에서 왼쪽에서 오른쪽 swipe 시 Quick Shoot, Quick Shoot에서 오른쪽에서 왼쪽 swipe 시 Home, Quick Shoot에서 왼쪽에서 오른쪽 swipe 시 recipe 생성 후 detail 이동을 처리한다.
- Prompt block drag 중 page swipe가 섞이지 않도록 `NativePrompterBlockOverlay`에서 interaction active callback을 노출했다.
- Quick Shoot cue 변경을 `QuickShootRecipeDraftPreview`와 `createQuickShootRecipe`에 연결했다.
- `NavigationChromeProvider`를 추가해 Home pager가 Quick Shoot/Recipe Preview 또는 horizontal swipe 중일 때 `AppTopBar`, `GlobalSourceCta`, NativeTabs label/icon/background chrome을 숨기도록 했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- Metro `http://127.0.0.1:8081/status` 확인: `packager-status:running`.
- iPhone 13 Pro dev client를 `exp+parrotkit-app://expo-development-client/?url=http://192.168.0.104:8081`로 재실행 성공.

## 리스크 / 다음 확인
- Expo Router `unstable-native-tabs`는 전체 tab bar hidden API가 없어, Quick Shoot 중 NativeTabs chrome은 투명 스타일과 label/icon hiding으로 제어한다. iOS Liquid Glass가 완전히 사라지지 않으면 native tabs 대신 custom JS tab chrome 또는 Quick Shoot root overlay route로 한 단계 더 옮기는 게 안전하다.
- 실제 손 QA에서 Home -> Quick Shoot swipe, Quick Shoot -> Home swipe, Quick Shoot -> Recipe swipe, prompt drag, record/review/gallery save를 다시 확인해야 한다.
