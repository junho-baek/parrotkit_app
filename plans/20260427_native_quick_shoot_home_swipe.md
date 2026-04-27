# 20260427 Native Quick Shoot Home Swipe

## 배경
- 현재 native shooting screen은 recipe scene에 종속되어 있다.
- 사용자는 레시피 없이 프롬프터와 카메라만 빠르게 쓰고 싶을 수 있다.
- Instagram처럼 home에서 왼쪽 swipe로 shooting 화면에 바로 들어가는 진입이 자연스럽다.

## 목표
- `/quick-shoot` native route를 추가해 recipe 없이 카메라, 프롬프터 cue, 녹화, native gallery 저장을 제공한다.
- Home screen에서 왼쪽 horizontal swipe를 감지해 `/quick-shoot`로 이동한다.
- Quick shoot cue는 로컬 화면 상태로 관리하고, 기존 native prompter overlay/toolbar/review/record controls를 재사용한다.

## 범위
- Expo Router stack route 추가.
- Home gesture entry.
- Standalone quick shoot screen.
- 기존 recipe detail/shooting persistence 변경은 하지 않는다.

## 변경 파일
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/quick-shoot.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-toolbar.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`
- `plans/20260427_native_quick_shoot_home_swipe.md`
- `context/context_20260427_native_quick_shoot_home_swipe.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- Metro 8081로 real-device dev-client launch.
- Home에서 왼쪽 swipe -> quick shoot screen 진입 smoke 확인.

## 롤백
- `/quick-shoot` route와 screen을 제거한다.
- Home gesture wrapper를 제거한다.
- Stack route entry를 제거한다.

## 리스크
- Home vertical scroll과 horizontal swipe gesture가 충돌할 수 있어 dx가 충분히 크고 dy보다 우세할 때만 navigation한다.
- Quick shoot take는 recipe에 묶이지 않으므로 앱 내부 기록 없이 native gallery 저장 중심으로 동작한다.

## 결과
- `/quick-shoot` route를 추가하고 root stack에 `slide_from_left` animation으로 등록했다.
- Home screen에 왼쪽에서 오른쪽으로 미는 swipe gesture를 붙이고, home surface가 손가락을 따라 오른쪽으로 밀리며 뒤의 `Quick Shoot` panel이 드러나도록 animated transition을 추가했다.
- Quick shoot screen은 recipe 없이 local prompter cues를 추가/수정/이동/숨김/색/크기 조정할 수 있고, 녹화 후 native gallery 저장 review flow를 재사용한다.
- Native prompter toolbar의 `+` cue 버튼을 크게 키우고, 색상 팔레트는 palette icon으로 열고 X로 닫을 수 있게 했다.
- 연결 context: `context/context_20260427_native_quick_shoot_home_swipe.md`
