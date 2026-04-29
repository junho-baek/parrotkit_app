# 20260429 Quick Shoot Fullscreen Route

## 요약
- Home pager에서 Quick Shoot로 settle된 상태를 유지하지 않고, swipe threshold를 넘기면 `/quick-shoot` Stack route로 전환하도록 바꿨다.
- Swipe 중에는 기존 Quick Shoot surface가 preview처럼 보이지만, 실제 촬영 화면은 탭 밖 full-screen route에서 열린다.
- Full-screen Quick Shoot에서는 NativeTabs 하단 네비게이션과 global source CTA가 구조적으로 보이지 않아야 한다.

## 변경
- `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`
  - `openQuickShootRoute`를 추가했다.
  - Home에서 오른쪽 swipe release 시 `settleToPage('quick')`에 머무르지 않고 preview settle 후 `/quick-shoot`로 push한다.
  - route push 직전에 underlying pager 상태를 Home으로 되돌려, Quick Shoot route를 닫았을 때 탭 홈이 정상 상태로 남도록 했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- Metro 8081 실행 중 dev-client를 `exp+parrotkit-app://expo-development-client/?url=http://172.30.1.50:8081`로 재실행했다.
- Metro에서 iOS bundle 요청을 확인했다.

## 남은 확인
- 실기기에서 Home swipe -> Quick Shoot 진입 시 하단 네비게이션이 사라지는지 손 QA가 필요하다.
- `/quick-shoot` 내부에서 Back/Home 동작은 기존 `QuickShootCameraScreen`의 `router.replace('/(tabs)')` 계약을 사용한다.
