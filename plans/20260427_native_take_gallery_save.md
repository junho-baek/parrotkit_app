# 20260427 Native Take Gallery Save

## 배경
- 현재 native shooting flow는 `recordAsync`로 받은 local video URI를 review 화면에 올리고, `Use Take`를 누르면 mock recorded take state에만 저장한다.
- 사용자는 촬영 후 한 번 확인한 뒤 기기 갤러리에도 저장되길 원한다.

## 목표
- review overlay에서 `Use Take`를 누른 뒤 Photos 권한을 요청하고 비디오를 갤러리에 저장한다.
- 저장 성공/실패 메시지를 shooting 화면에 표시한다.
- 권한이 거부되어도 앱 내부 take 저장은 유지하고, 사용자에게 갤러리 저장 실패를 알려준다.

## 범위
- native prompter recording review/use-take flow.
- Expo MediaLibrary dependency와 iOS permission copy.
- 실제 video playback preview는 이번 범위에 포함하지 않는다.

## 변경 파일
- `parrotkit-app/package.json`
- lockfile
- `parrotkit-app/app.json`
- iOS native permission config if needed
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260427_native_take_gallery_save.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- iOS real-device native rebuild/install if `expo-media-library` native module is added.
- 실기기에서 record -> review -> Use Take -> Photos permission -> gallery save smoke QA.

## 롤백
- MediaLibrary dependency/config and `handleUseTake` gallery save changes를 revert한다.

## 리스크
- `expo-media-library`는 native module이므로 현재 설치된 dev-client에는 즉시 포함되지 않을 수 있어 iOS rebuild가 필요하다.
- iOS Photos 권한 prompt는 한 번 거부하면 Settings에서 다시 켜야 한다.

## 결과
- `expo-media-library`를 추가하고 iOS Photos add/read permission copy를 `app.json`에 등록했다.
- shooting review overlay의 `Use Take`가 선택된 take를 Photos library에 저장하도록 연결했다.
- 저장 중에는 `Use Take`를 비활성화하고 `Saving...`으로 표시해 중복 저장을 막는다.
- Photos 권한 거부/저장 실패 시에도 앱 내부 recorded take state는 유지하고 상태 메시지로 실패를 알린다.
- 연결 context: `context/context_20260427_native_take_gallery_save.md`
