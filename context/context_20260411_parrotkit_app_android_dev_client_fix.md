# Context - Parrotkit App Android Dev Client Fix

## 작업 요약
- `parrotkit-app`의 기본 실행 명령을 `expo start --dev-client`로 변경해 iOS와 Android 모두 dev client 기준으로 열리게 맞췄다.
- `start:go` 스크립트를 별도로 추가해 Expo Go는 필요할 때만 명시적으로 사용할 수 있게 분리했다.
- Android 에뮬레이터 blank 화면 원인을 조사한 결과, 에뮬레이터에는 `com.anonymous.parrotkitapp`가 설치되어 있지 않았고, 외장 볼륨 `/Volumes/T7/...`에서 Android Gradle build 산출물에 AppleDouble `._*` 파일이 섞여 빌드가 깨지는 환경 이슈를 확인했다.

## 변경 파일
- `plans/20260411_parrotkit_app_android_dev_client_fix.md`
- `parrotkit-app/package.json`
- `context/context_20260411_parrotkit_app_android_dev_client_fix.md`

## 확인 내용
- Android 에뮬레이터 연결 확인
  - `~/Library/Android/sdk/platform-tools/adb devices -l`
  - 결과: `emulator-5554` 연결 확인
- 설치 패키지 확인
  - `~/Library/Android/sdk/platform-tools/adb shell pm list packages | rg 'parrotkit|anonymous'`
  - 결과: `com.anonymous.nomaddiary`만 설치되어 있고 `com.anonymous.parrotkitapp`는 없음
- 스크립트 확인
  - `node -e "const p=require('./parrotkit-app/package.json'); console.log('start=' + p.scripts.start); console.log('start:go=' + p.scripts['start:go']);"`
  - 결과
    - `start=expo start --dev-client`
    - `start:go=expo start`

## Android 실패 메모
- `cd parrotkit-app && npx expo run:android --port 8084`를 여러 차례 시도했지만 외장 볼륨 환경에서 Android Gradle 산출물 경로에 AppleDouble 파일이 섞이며 실패했다.
- 대표 에러
  - `packageDebugResources/._drawable is not a directory`
  - `packageDebugResources/._anim is not a directory`
  - `._AndroidUIScheduler$1.class already exists`
- 판단
  - Expo Router/NativeWind 자체보다는 `/Volumes/T7/...` 파일시스템 환경에서 Android build output이 오염되는 문제가 더 직접적인 원인이다.
  - 실험성 Gradle 패치는 저장하지 않고 제거했다.

## 다음 액션
- 로컬 디스크 예: `~/project/parrotkit-app-local`로 복사한 뒤 Android dev client를 다시 빌드한다.
- 기본 명령은 아래 흐름을 권장한다.
  - `npm start`
  - `npx expo run:android --port 8084`
