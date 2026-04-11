# Plan - Parrotkit App Camera Permission Plist Fix

## 배경
- prompter camera route 진입 시 앱이 빨간 fatal 화면으로 죽는다.
- iOS simulator 로그와 캡처를 확인한 결과, 직접 원인은 `NSCameraUsageDescription`이 앱 번들의 `Info.plist`에 없어서 `expo-camera`가 강제 실패하는 것이다.

## 목표
- iOS native 앱 번들에 camera permission description을 추가해 `expo-camera`가 정상 permission flow로 진입하게 만든다.
- Expo app config를 source of truth로 맞춰 다음 iOS 빌드에도 설정이 유지되게 한다.

## 범위
- `parrotkit-app/app.json`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_camera_permission_plist_fix.md`
- `context/context_20260412_parrotkit_app_camera_permission_plist_fix.md`
- `parrotkit-app/app.json`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo run:ios -d 'iPhone 17'`

## 롤백
- `Info.plist`와 `app.json`의 camera permission description을 제거하고 이전 상태로 되돌린다.

## 리스크
- permission crash는 잡혀도 시뮬레이터 자체 카메라 제약 때문에 preview 품질이나 동작은 실제 기기와 다를 수 있다.

## 결과
- iOS camera crash의 직접 원인이 `NSCameraUsageDescription` 누락임을 로그와 스크린샷으로 재현 확인했다.
- `app.json`에 `ios.infoPlist.NSCameraUsageDescription`를 추가해 native configure source-of-truth를 맞췄다.
- 로컬 native `Info.plist`에도 동일 값이 반영되는 것을 재빌드로 확인했지만, repo에서 관리하는 durable 설정은 `app.json`이다.
- `npx expo run:ios -d 'iPhone 17'` 재빌드 후 같은 prompter deep link를 다시 열었을 때, 빨간 fatal 대신 정상 permission gate가 표시되는 것까지 확인했다.

## 연결 context
- `context/context_20260412_parrotkit_app_camera_permission_plist_fix.md`
