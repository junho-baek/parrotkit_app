# 20260428 Native Quick Shoot Swipe Recipe

## 배경
- Home에서는 왼쪽에서 오른쪽으로 밀어 Quick Shoot에 진입할 수 있다.
- Quick Shoot 안에서도 촬영 모드답게 좌우 gesture로 큰 흐름을 빠르게 바꾸고 싶다.
- Quick Shoot cue가 쌓이면 이를 그대로 레시피의 다중 컷 구조로 승격할 수 있어야 한다.

## 목표
- Quick Shoot에서 오른쪽에서 왼쪽으로 밀면 Home으로 돌아간다.
- Quick Shoot에서 왼쪽에서 오른쪽으로 밀면 현재 visible cue들을 컷 단위 scene으로 가진 recipe를 만든다.
- 생성된 recipe detail로 이동해 Analysis / Recipe / Shoot 흐름을 그대로 사용할 수 있게 한다.

## 범위
- Native Quick Shoot screen gesture handling.
- Mock workspace에 Quick Shoot cue 기반 recipe 생성 API 추가.
- 기존 recipe shooting / native gallery save flow는 변경하지 않는다.

## 변경 파일
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`
- `plans/20260428_native_quick_shoot_swipe_recipe.md`
- `context/context_20260428_native_quick_shoot_swipe_recipe.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- Metro 8081 real-device dev-client relaunch.
- Quick Shoot에서 right-to-left swipe -> Home 이동 smoke 확인.
- Quick Shoot에서 left-to-right swipe -> 새 recipe 생성 및 detail 진입 smoke 확인.

## 롤백
- Quick Shoot screen의 swipe handlers와 backdrop UI를 제거한다.
- Mock workspace의 Quick Shoot recipe creation API를 제거한다.

## 리스크
- Prompter block drag와 screen-level swipe가 충돌할 수 있다.
- 이를 줄이기 위해 horizontal intent, 충분한 이동 거리, recording/review 중 비활성화를 적용한다.

## 결과
- Quick Shoot 화면에 양방향 swipe surface를 추가했다.
- 오른쪽에서 왼쪽으로 충분히 밀면 Home으로 replace 이동한다.
- 왼쪽에서 오른쪽으로 충분히 밀면 현재 visible cue들을 cut-by-cut scene으로 가진 recipe를 생성하고 해당 recipe detail로 이동한다.
- swipe 중에는 뒤쪽에 `Make Recipe` / `Home` panel이 드러나 방향성이 보이도록 했다.
- 연결 context: `context/context_20260428_native_quick_shoot_swipe_recipe.md`
