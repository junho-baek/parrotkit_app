# 20260427 Native Prompter Focus And New Cue

## 배경
- 새 cue는 생성 직후 자동 편집 모드에 들어가 드래그 responder가 비활성화된다.
- 색상 변경은 사용자가 명시적으로 선택한 cue가 아니라 첫 visible cue fallback을 대상으로 삼아 조작 감각이 애매하다.
- 사용자는 cue를 한 번 탭해 포커스하고, 그 상태에서 색을 바꾸는 흐름을 기대한다.

## 목표
- 새 cue는 생성 후 바로 드래그할 수 있게 한다.
- cue 색상/크기/숨김 컨트롤은 명시적으로 포커스한 cue에만 적용한다.
- 편집은 더블탭 또는 펜 버튼으로 진입한다.

## 범위
- native shooting prompter 화면의 focus/edit/control flow만 수정한다.
- provider schema, recording, recipe detail은 변경하지 않는다.

## 변경 파일
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260427_native_prompter_focus_and_new_cue.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- 실기기 dev-client에서 새 cue 생성 후 drag, cue tap 후 color change, double tap edit smoke QA

## 롤백
- camera screen의 focus fallback과 add cue edit request 변경을 revert한다.

## 리스크
- 기존처럼 화면 진입 시 첫 cue가 자동 선택되는 동작은 사라진다.
- 대신 명시적 tap-to-focus 흐름이 더 예측 가능해진다.

## 결과
- `focusedBlock`의 첫 visible cue fallback을 제거해, 사용자가 실제로 탭한 cue만 포커스/색상/크기/숨김 컨트롤 대상이 되게 했다.
- 새 cue 생성 시 자동 편집 요청을 제거해, 생성 직후 바로 드래그할 수 있게 했다.
- scene 전환 시 이전 scene의 focus를 초기화한다.
- 편집은 기존대로 더블탭 또는 펜 버튼으로 진입한다.
- 검증:
  - `cd parrotkit-app && npx tsc --noEmit` 통과.
  - 실기기 dev-client를 `192.168.0.104:8081` Metro로 재실행해 새 bundle 수신 확인.
- 연결 context: `context/context_20260427_native_prompter_focus_and_new_cue.md`
