# 20260427 Native Gallery Autosave Review

## 배경
- 현재 shooting flow는 녹화 후 앱 내부 review card에 local file URI를 보여준다.
- Gallery 저장은 `Use Take` 뒤에만 시도해서, 사용자는 native camera roll에 저장됐다는 확신을 얻기 어렵다.
- 사용자는 앱 내부 파일 화면이 아니라 iOS native gallery/camera roll에 실제 녹화물이 저장되길 원한다.

## 목표
- 녹화가 끝나면 즉시 native gallery 저장을 시작한다.
- review overlay에는 local URI 대신 실제 take preview와 gallery 저장 상태를 보여준다.
- `Use Take`는 gallery 저장이 끝난 take를 recipe take로 확정하는 역할로 정리한다.
- gallery 저장 실패/권한 거부 시 같은 review 화면에서 재시도할 수 있게 한다.

## 범위
- Native prompter camera screen의 recording/review/save state.
- Native take review UI copy and preview presentation.
- 새 native dependency 추가는 하지 않는다.

## 변경 파일
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `parrotkit-app/src/features/recipes/components/native-take-review.tsx`
- `plans/20260427_native_gallery_autosave_review.md`
- `context/context_20260427_native_gallery_autosave_review.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- 가능한 경우 연결된 iPhone에서 Metro dev URL로 앱 launch 후 record -> native gallery save prompt/status 확인.

## 롤백
- autosave helper/state를 제거하고 이전 `Use Take` 저장 흐름으로 되돌린다.
- review overlay copy/preview 변경을 revert한다.

## 리스크
- 녹화 직후 저장하는 방식은 retake를 눌러도 이미 camera roll에 들어간 take를 자동 삭제하지 않는다.
- iOS Photos 권한을 사용자가 이미 거부한 경우 Settings에서 권한을 바꿔야 정상 저장된다.

## 결과
- 녹화가 끝나면 `expo-media-library`로 native camera roll 저장을 즉시 시작하도록 변경했다.
- review overlay는 local `file://` URI 대신 실제 video preview와 gallery 저장 상태를 보여준다.
- `Keep Take`는 gallery 저장이 끝난 take를 recipe take로 확정하고, 저장 실패/권한 거부 시에는 `Save to Gallery`로 재시도한다.
- 연결 context: `context/context_20260427_native_gallery_autosave_review.md`
