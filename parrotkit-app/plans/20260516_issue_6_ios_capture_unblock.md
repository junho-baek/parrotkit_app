# 2026-05-16 Issue 6 iOS Capture Unblock

## 배경

GitHub #6은 Home / Explore / Paste / Recipes / My bottom navigation 복구와 iPhone/Android native capture를 요구한다. Android capture는 `20260516_main_tab_paste_qa`에서 완료했지만, iOS Simulator는 `simctl` timeout으로 캡처하지 못했다.

## 목표

- CoreSimulator / Simulator 상태를 복구하거나 우회해 iPhone Simulator에서 앱을 실행한다.
- iPhone에서 Home, Explore, Paste drawer, Recipes, My 캡처를 남긴다.
- #6 acceptance criteria 중 iPhone capture와 navigation route correctness를 검증한다.
- 조건이 충족되면 #6을 닫고, 아니면 blocker를 명확히 기록한다.

## 범위

- iOS Simulator 상태 진단 및 재시작
- Metro / Expo dev client iOS 실행
- iPhone native capture artifact 생성
- #6 QA report/context 작성
- GitHub #6 상태 업데이트

## 변경 파일

- `plans/20260516_issue_6_ios_capture_unblock.md`
- `context/context_20260516_issue_6_ios_capture_unblock.md`
- `output/reports/20260516_issue_6_ios_capture_unblock.md`
- `output/playwright/issue-6-ios-capture-20260516/*`

## 테스트

- `timeout 8 xcrun simctl list devices booted`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npx -y @google/design.md lint DESIGN.md`
- iPhone Simulator capture set
- Source route residue search if route state changes

## 롤백

QA artifact commit만 revert하면 된다. Simulator/process restart는 로컬 개발 환경 상태 복구 조치라 코드 롤백 대상이 아니다.

## 리스크

- CoreSimulator가 계속 timeout이면 iPhone capture는 이번 턴에서 완료할 수 없다.
- iOS dev client가 stale native modules를 가질 경우 `expo run:ios` 재설치가 필요할 수 있다.
- #6은 iPhone + Android 캡처를 요구하므로, iPhone 캡처 실패 시 issue를 닫지 않는다.

## 결과

- `/Applications/Xcode.app/Contents/Developer/usr/bin/simctl` wrapper가 CoreSimulator version mismatch 때문에 `xcodebuild -runFirstLaunch`에서 대기하는 원인을 확인했다.
- Underlying CoreSimulator simctl binary를 직접 호출해 iPhone 17 Pro Simulator를 부팅하고 캡처했다.
- iPhone Expo Go render에서 `href: null`인 Paste tab item이 숨겨지는 회귀를 발견했고, app shell screen option에 Home href fallback을 추가해 Paste를 다시 노출했다.
- iPhone 캡처 5장과 contact board를 생성했다.
- Android evidence는 `output/playwright/main-tab-paste-qa-20260516/android-main-tab-paste-board.png`를 재사용한다.
- QA 리포트: `output/reports/20260516_issue_6_ios_capture_unblock.md`
- Context: `context/context_20260516_issue_6_ios_capture_unblock.md`
