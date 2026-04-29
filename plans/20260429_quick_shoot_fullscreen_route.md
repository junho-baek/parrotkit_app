# 20260429 Quick Shoot Fullscreen Route

## 배경
- Home 안의 Quick Shoot pager는 실제 Quick Shoot UI를 탭 내부 sibling page로 mount한다.
- iOS native tabs는 색상/라벨을 투명하게 해도 tab bar container나 blur가 남을 수 있다.
- Quick Shoot는 촬영 도구라 하단 네비게이션 없이 full-screen route로 열리는 편이 자연스럽다.

## 목표
- Home swipe 중에는 실제 Quick Shoot preview를 보여준다.
- Swipe threshold를 넘겨 Quick Shoot로 진입하면 `/quick-shoot` Stack route로 전환한다.
- Full-screen Quick Shoot에서는 하단 네비게이션과 floating source CTA가 보이지 않게 한다.

## 범위
- Home Quick Shoot pager의 settle/navigation 동작만 수정한다.
- Quick Shoot camera surface, recipe 생성, gallery save 로직은 변경하지 않는다.

## 변경 파일
- `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`
- `plans/20260429_quick_shoot_fullscreen_route.md`
- `context/context_20260429_quick_shoot_fullscreen_route.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- 8081 Metro에서 Home을 오른쪽으로 swipe하면 `/quick-shoot` full-screen route가 열리는지 확인한다.
- Quick Shoot 화면에서 하단 네비게이션이 보이지 않는지 확인한다.

## 롤백
- Home swipe release 동작을 `settleToPage('quick')`로 되돌린다.
- 새 context/plan 문서를 되돌린다.

## 리스크
- Home swipe preview에서 camera surface가 잠깐 warm-up 되므로, 아주 짧은 순간 native tabs chrome과 camera preview가 동시에 보일 수 있다.
- `/quick-shoot` route 안의 좌우 swipe 동작은 기존 QuickShootCameraScreen/Surface 계약에 의존한다.

## 결과
- Home에서 Quick Shoot로 swipe release할 때 탭 내부 Quick page에 머물지 않고 `/quick-shoot` Stack route로 전환하도록 변경했다.
- Route push 직전에 underlying Home pager 상태를 Home으로 되돌려 Quick Shoot 종료 후 탭 화면이 정상 상태로 남게 했다.
- 연결 context: `context/context_20260429_quick_shoot_fullscreen_route.md`
