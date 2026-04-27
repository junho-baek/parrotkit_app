# 20260427 Native Prompter Control Access

## 배경
- 실기기 shooting 화면에서 cue를 더블탭해도 편집이 열리지 않고 롱프레스에 의존한다.
- cue를 화면 하단 쪽으로 충분히 끌기 어렵다.
- 색상 팔레트 터치 영역이 작아 촬영 중 조작이 어렵다.
- cue를 숨긴 뒤 shooting 화면에서 다시 표시하는 방법이 없다.

## 목표
- cue 더블탭으로 즉시 텍스트 편집을 연다.
- cue drag 가능 영역을 하단까지 넓힌다.
- 색상 swatch hit target을 키워 조작성을 높인다.
- 숨긴 cue를 shooting toolbar에서 다시 보이게 할 수 있게 한다.

## 범위
- native prompter shooting 화면의 overlay/toolbar 조작 UX만 수정한다.
- recipe detail, recording, data schema는 변경하지 않는다.

## 변경 파일
- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-toolbar.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260427_native_prompter_control_access.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- running Metro `8081`에 실기기 dev-client 재실행
- 실기기에서 double tap edit, lower drag, color tap, hide/restore smoke QA

## 롤백
- 위 세 app 파일 변경을 revert하면 이전 toolbar/overlay 동작으로 돌아간다.

## 리스크
- 하단 drag bounds를 넓히면 일부 cue가 bottom controls에 가까워질 수 있다.
- restore는 숨김 cue를 순차적으로 복구하는 compact control로 시작한다.

## 결과
- cue single tap/double tap 처리를 `handleCueTap`으로 통합해 더블탭 시 텍스트 편집을 열게 했다.
- parent responder와 Text press가 같은 tap에서 중복 호출될 수 있어 80ms 중복 tap guard를 추가했다.
- drag 하단 bounds를 `0.66`에서 `0.88`로 넓히고 `pointFromGesture`의 기본 clamp를 우회해 실제 하단까지 이동할 수 있게 했다.
- color swatch를 `28px`에서 `38px`로 키웠다.
- 숨김 cue가 있으면 toolbar에 눈 아이콘과 개수 badge를 보여주고, 탭하면 숨긴 cue를 다시 표시한다.
- 검증:
  - `cd parrotkit-app && npx tsc --noEmit` 통과.
  - 실기기 dev-client를 `192.168.0.104:8081` Metro로 재실행해 새 bundle 수신 확인.
- 연결 context: `context/context_20260427_native_prompter_control_access.md`
