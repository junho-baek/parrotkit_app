# Plan - Parrotkit App Native iOS Build

## 배경
- `parrotkit-app`은 Expo dev-client 기반 앱이며, Expo Go에서는 시뮬레이터 실행이 확인됐다.
- 네이티브 iOS dev-client 빌드는 `expo run:ios`에서 CocoaPods/Xcode 환경 문제로 실패했다.

## 목표
- `Codex iPhone 16` 시뮬레이터에 ParrotKit 네이티브 iOS dev-client 빌드를 설치하고 실행한다.
- 막히는 원인이 있으면 재현 명령, 에러, 필요한 조치를 명확히 기록한다.

## 범위
- `parrotkit-app`의 iOS 네이티브 빌드 환경 확인
- CocoaPods, Xcode SDK/runtime, Node/npm 호환성 확인
- 빌드 성공 시 시뮬레이터 실행 확인
- 작업 결과 context 기록

## 변경 파일
- `plans/20260426_parrotkit_app_native_ios_build.md`
- `context/context_20260426_parrotkit_app_native_ios_build.md`
- 필요 시 `parrotkit-app` 설정 파일

## 테스트
- `cd parrotkit-app && npx expo run:ios --device "Codex iPhone 16"`
- 필요 시 `cd parrotkit-app/ios && pod install`
- 실행 후 시뮬레이터 화면 캡처

## 롤백
- 생성된 네이티브 산출물이나 환경 변경이 프로젝트에 부적절하면 Git 추적 파일 기준으로 되돌린다.
- 로컬 설치물(`node_modules`, CocoaPods 캐시, DerivedData)은 코드 롤백 대상이 아니며 필요 시 정리한다.

## 리스크
- Xcode 26.3과 설치된 iOS Simulator runtime 버전 조합이 맞지 않으면 추가 runtime 설치가 필요할 수 있다.
- 구버전 CocoaPods는 최신 podspec 문법을 처리하지 못할 수 있다.
- 현재 Node 20.15.0은 React Native 0.81 계열 권장 버전보다 낮아 빌드 중 추가 오류가 날 수 있다.

## 결과
- 네이티브 iOS Debug 빌드 성공.
- `Codex iPhone 16 iOS 26` 시뮬레이터에 `com.anonymous.parrotkitapp` 설치 및 실행 성공.
- Metro dev server `http://localhost:8081` 연결 후 ParrotKit 홈 화면 로딩 확인.
- 증거 스크린샷: `output/playwright/parrotkit-app-native-ios-appscreen.png`
- 연결 context: `context/context_20260426_parrotkit_app_native_ios_build.md`

## 발견한 막힘
- CocoaPods 1.10.1은 최신 podspec의 `visionos` 설정을 파싱하지 못해 Homebrew CocoaPods 1.16.2로 교체했다.
- iOS 18.1 runtime만 있어 Xcode 26.3 빌드 대상이 맞지 않아 iOS 26.3.1 simulator runtime을 설치했다.
- `~/Library/Developer/Xcode/DerivedData`가 마운트되지 않은 `/Volumes/T7` symlink라 로컬 DerivedData 디렉토리로 복구했다.
- 프로젝트 경로의 괄호 때문에 Expo Constants Pod script가 `bash -c`에서 실패해 생성된 Pods script를 로컬로 따옴표 처리했다.
