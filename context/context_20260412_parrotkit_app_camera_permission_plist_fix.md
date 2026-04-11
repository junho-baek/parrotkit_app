# Context - Parrotkit App Camera Permission Plist Fix

## 작업 요약
- prompter camera route 진입 시 앱이 빨간 fatal 화면으로 죽는 현상을 재현했다.
- 실제 원인은 route나 `expo-camera` 설치 자체가 아니라, iOS bundle에 `NSCameraUsageDescription`이 없어 permission request 단계에서 `expo-camera`가 강제 실패한 것이었다.
- 재현 로그:
  - `This app is missing NSCameraUsageDescription, so video services will fail. Add this entry to your bundle's Info.plist.`
- `app.json`의 `ios.infoPlist.NSCameraUsageDescription`를 추가했고, 다시 `npx expo run:ios -d 'iPhone 17'`로 빌드했다.
- 재빌드 과정에서 로컬 native `Info.plist`에도 값이 반영되는 것을 확인했고, repo 기준 source of truth는 `app.json`으로 유지한다.
- 같은 deep link로 prompter route를 다시 열었을 때 빨간 fatal은 사라졌고, 정상적인 camera permission gate가 뜨는 것까지 확인했다.

## 변경 파일
- `plans/20260412_parrotkit_app_camera_permission_plist_fix.md`
- `context/context_20260412_parrotkit_app_camera_permission_plist_fix.md`
- `parrotkit-app/app.json`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과
- `cd parrotkit-app && npx expo run:ios -d 'iPhone 17'`
  - 결과: `Build Succeeded`
- deep link smoke
  - `xcrun simctl openurl booted 'parrotkit-app://recipe/recipe-korean-diet-hook/prompter?sceneId=scene-1'`
  - 수정 전: `output/sim/camera_route_attempt.png` 에서 `NSCameraUsageDescription` fatal 확인
  - 수정 후: `output/sim/camera_route_after_plist_fix.png` 에서 permission gate 확인

## 남은 리스크
- 시뮬레이터에서는 실제 카메라 preview 동작이 기기와 다를 수 있어, permission crash 수정 이후의 최종 QA는 실기기에서 한 번 더 보는 편이 좋다.
- `output/sim/`은 로컬 디버깅 산출물이고, repo에 커밋하지 않는다.
