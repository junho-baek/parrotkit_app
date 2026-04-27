# 20260428 Native Home Quick Shoot Pager

## 배경
- 현재 Home/Quick Shoot swipe는 실제 화면이 나란히 있는 구조가 아니라 fake preview panel을 뒤에 깔아둔 구조다.
- 사용자는 Instagram처럼 Home과 Camera 실제 UI가 서로 옆에 있고 현재 화면이 밀리며 다음 화면이 드러나는 감각을 원한다.
- Quick Shoot 카메라는 평소에는 꺼져 있어야 하며, Home은 살아있는 상태를 유지해야 한다.

## 목표
- Home, Quick Shoot, Recipe Draft Preview를 같은 pager 안의 sibling page로 구성한다.
- Home은 기본 active page이고, 스와이프 중에도 실제 Home UI가 유지된다.
- Quick Shoot UI는 mount되어 있지만 CameraView는 Quick Shoot 노출률이 70% 이상이거나 Quick Shoot에 settle되었을 때만 활성화된다.
- Quick Shoot에서 왼쪽에서 오른쪽으로 밀면 현재 cue들을 recipe로 만들고 recipe detail로 이동한다.
- Quick Shoot에서 오른쪽에서 왼쪽으로 밀면 Home page로 settle된다.

## 범위
- Native Home/Quick Shoot paging architecture.
- Quick Shoot surface extraction.
- Prompt drag와 page swipe 충돌 방지.
- 기존 native recording/gallery save 기능 유지.

## 변경 파일
- `parrotkit-app/src/app/(tabs)/index.tsx`
- `parrotkit-app/src/core/navigation/navigation-chrome-context.tsx`
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- `parrotkit-app/src/features/recipes/components/quick-shoot-recipe-draft-preview.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `8081` Metro real-device dev-client launch.
- Home -> Quick Shoot left-to-right swipe: Home moves, real Quick Shoot UI appears, camera activates after 70% exposure.
- Quick Shoot -> Home right-to-left swipe: real Home UI appears and camera deactivates after settle.
- Quick Shoot -> Recipe left-to-right swipe: recipe is created from visible cue blocks and recipe detail opens.
- Prompt block drag does not trigger page navigation.

## 롤백
- `(tabs)/index.tsx`를 기존 `HomeScreen` export로 되돌린다.
- `HomeQuickShootPagerScreen`, `HomeWorkspaceSurface`, `QuickShootCameraSurface`, `QuickShootRecipeDraftPreview` 추가 파일을 제거한다.
- `quick-shoot-camera-screen.tsx`를 standalone full screen 구현으로 되돌린다.

## 리스크
- CameraView를 너무 일찍 mount하면 권한, 발열, 배터리 비용이 커질 수 있다.
- 70% activation threshold와 settle/cancel deactivation을 명확히 분리해야 한다.
- Prompt drag와 page swipe가 같은 touch stream을 공유하므로 prompter interaction guard가 필요하다.

## 결과
- Home/Quick Shoot/Recipe Draft Preview를 fake preview가 아닌 실제 sibling pager로 구성했다.
- Quick Shoot 카메라는 기본 dormant 상태로 두고, Quick Shoot 노출률 70% 이상 또는 Quick Shoot settle 후에만 `CameraView`를 활성화하도록 분리했다.
- Quick Shoot cue state를 recipe draft preview와 recipe 생성 플로우에 연결했다.
- Prompt block drag 중에는 page swipe가 개입하지 않도록 interaction guard를 추가했다.
- Quick Shoot/Recipe Preview 또는 horizontal pager gesture 중에는 AppTopBar, GlobalSourceCta, NativeTabs chrome을 숨기도록 navigation chrome context를 추가했다.
- 연결 context: `context/context_20260428_native_home_quick_shoot_pager.md`
