# Context - ParrotKit App Native iOS Build

## 작업 시간
- 2026-04-26 14:30-15:00 KST

## 요약
- `parrotkit-app` 네이티브 iOS dev-client를 Debug 구성으로 빌드했다.
- 빌드 산출물 `ios/build/DerivedData/Build/Products/Debug-iphonesimulator/parrotkitapp.app`을 `Codex iPhone 16 iOS 26` 시뮬레이터에 설치했다.
- Metro dev server를 `http://localhost:8081`로 실행하고, dev-client에서 실제 ParrotKit 홈 화면 로딩까지 확인했다.
- 최종 증거 스크린샷: `output/playwright/parrotkit-app-native-ios-appscreen.png`

## 수행 내용
- `parrotkit-app` 의존성이 없어 `npm ci`로 설치했다.
- 기존 CocoaPods 1.10.1이 `visionos.deployment_target` podspec 문법을 처리하지 못해 Homebrew CocoaPods 1.16.2를 설치했다.
- 기존 시뮬레이터 런타임이 iOS 18.1뿐이라 `xcodebuild -downloadPlatform iOS`로 iOS 26.3.1 런타임을 설치했다.
- `Codex iPhone 16 iOS 26` 시뮬레이터를 생성했다.
  - UDID: `9AF641D2-B9CA-4D3C-B457-1481B39E0F14`
- `~/Library/Developer/Xcode/DerivedData`가 `/Volumes/T7/XcodeCache/DerivedData`를 가리키는 깨진 symlink라 Xcode가 DerivedData를 만들지 못했다.
  - 기존 symlink는 `~/Library/Developer/Xcode/DerivedData.link_backup_20260426144252`로 보관했다.
  - `~/Library/Developer/Xcode/DerivedData`를 로컬 디렉토리로 다시 만들었다.
- 프로젝트 경로의 괄호 때문에 Expo Constants Pod script가 `bash -c`에서 실패했다.
  - 오류: `syntax error near unexpected token '든든'`
  - 원인: `bash -l -c "$PODS_TARGET_SRCROOT/../scripts/get-app-config-ios.sh"` 형태가 괄호 포함 경로를 명령 문자열로 다시 해석했다.
  - 로컬 생성 산출물인 `parrotkit-app/ios/Pods/Pods.xcodeproj/project.pbxproj`와 `parrotkit-app/ios/Pods/Local Podspecs/EXConstants.podspec.json`에서 해당 스크립트 경로를 따옴표 처리해 빌드를 통과시켰다.

## 검증
- `xcodebuild -quiet -workspace ios/parrotkitapp.xcworkspace -configuration Debug -scheme parrotkitapp -destination id=9AF641D2-B9CA-4D3C-B457-1481B39E0F14 -derivedDataPath ios/build/DerivedData`
  - 결과: 성공
- `xcrun simctl install 9AF641D2-B9CA-4D3C-B457-1481B39E0F14 ios/build/DerivedData/Build/Products/Debug-iphonesimulator/parrotkitapp.app`
  - 결과: 성공
- `xcrun simctl launch 9AF641D2-B9CA-4D3C-B457-1481B39E0F14 com.anonymous.parrotkitapp`
  - 결과: 성공
- `npx expo start --dev-client --localhost`
  - 결과: Metro `http://localhost:8081` 실행, dev-client 연결 성공

## 남은 주의사항
- 현재 Node.js는 `v20.15.0`이라 React Native/Metro 권장 범위보다 낮다는 경고가 계속 나온다. 장기적으로는 Node `>=20.19.4` 또는 프로젝트 표준 Node 버전으로 맞추는 것이 좋다.
- 디스크 여유 공간이 약 11GB 수준까지 내려갔다. iOS runtime, DerivedData, Pods가 커서 추가 네이티브 빌드 전 정리가 필요할 수 있다.
- 괄호 포함 경로에서 Expo Constants Pod script가 깨지는 문제는 생성 산출물 로컬 패치로 우회했다. `pod install`을 다시 실행하면 재발할 수 있으므로, 안정적으로는 괄호 없는 작업 경로에서 빌드하거나 upstream pod script 패치를 프로젝트에 고정하는 방안을 검토한다.
- `~/.bash_profile`의 `export dotnet_env = "/Users/baekjunho/dotnet"` 라인이 bash login shell에서 경고를 만든다. 현재 빌드는 통과했지만 추후 Xcode script phase 로그를 오염시킬 수 있다.
