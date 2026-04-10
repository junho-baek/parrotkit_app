# Plan - Parrotkit App Android Dev Client Fix

## 배경
- 사용자가 Android 에뮬레이터에서 `parrotkit-app`이 아닌 기본 Expo starter처럼 보이는 화면을 확인했다.
- 현재 확인 결과 Android 에뮬레이터에는 `com.anonymous.parrotkitapp` 패키지가 설치되어 있지 않고, `npm start`는 일반 `expo start`라 Expo Go 경로로 열리고 있다.
- 이 앱은 Expo Router native tabs와 dev build 흐름을 기준으로 검증해 왔기 때문에 Android도 같은 방식으로 맞춰야 한다.

## 목표
- `npm start`를 dev client 기준 실행으로 바꿔 iOS/Android 실행 경로를 일관되게 만든다.
- Android 에뮬레이터에 `parrotkit-app` dev client를 실제로 빌드/설치한다.
- 사용자가 Android에서 Expo Go가 아니라 `parrotkit-app` dev client를 통해 앱을 열 수 있게 한다.

## 범위
- `parrotkit-app/package.json` 스크립트 조정
- Android dev client 빌드 원인 확인
- 작업 결과를 context에 기록

## 변경 파일
- `plans/20260411_parrotkit_app_android_dev_client_fix.md`
- `parrotkit-app/package.json`
- `context/context_20260411_parrotkit_app_android_dev_client_fix.md`

## 테스트
- `~/Library/Android/sdk/platform-tools/adb devices -l`
- `~/Library/Android/sdk/platform-tools/adb shell pm list packages | rg 'parrotkit|anonymous'`
- `node -e "const p=require('./parrotkit-app/package.json'); console.log('start=' + p.scripts.start); console.log('start:go=' + p.scripts['start:go']);"`
- `cd parrotkit-app && npx expo run:android --port 8084`

## 롤백
- `package.json`의 `start` 스크립트를 다시 `expo start`로 되돌린다.
- Android dev client 설치가 문제를 만들면 `adb uninstall com.anonymous.parrotkitapp` 후 기존 Expo Go 흐름으로 복귀할 수 있다.

## 리스크
- Android Gradle/SDK 환경에 따라 첫 build 시간이 길 수 있다.
- 익명 기본 package name을 계속 쓰는 동안 다른 local Expo 앱과 식별자 충돌 가능성이 남아 있다.
- 외장 볼륨에서 Android Gradle 산출물에 AppleDouble `._*` 파일이 섞이면 빌드가 실패할 수 있다.

## 결과
- `npm start`를 `expo start --dev-client`로 바꿔 기본 실행 경로를 dev client 기준으로 통일했다.
- `npm start:go`를 추가해 Expo Go가 필요할 때만 명시적으로 열 수 있게 분리했다.
- Android 에뮬레이터에는 `com.anonymous.parrotkitapp` dev client가 설치되어 있지 않음을 확인했다.
- `/Volumes/T7/...` 외장 볼륨 환경에서 Android Gradle build 산출물에 `._drawable`, `._anim`, `._AndroidUIScheduler$1.class` 같은 AppleDouble 파일이 섞여 빌드가 실패함을 확인했다.
- 실험성 Gradle 우회 패치는 남기지 않고, 로컬 디스크 clone에서 사용자가 바로 이어서 검증할 수 있도록 최소 변경만 유지했다.
- 연결 context: `context/context_20260411_parrotkit_app_android_dev_client_fix.md`
