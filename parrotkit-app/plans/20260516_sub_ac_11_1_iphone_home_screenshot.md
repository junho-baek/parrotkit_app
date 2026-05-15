# Sub-AC 11.1 iPhone Home Screenshot

## 배경
Seed issue 6 Sub-AC 11.1은 수정된 Home 화면의 iPhone 캡처를 저장해 세 가지 하단 탭, icon rendering, 하단 Create recipe 배치가 실제 화면에서 확인 가능해야 한다.

## 목표
- iPhone 크기 viewport에서 Home 화면 스크린샷을 캡처한다.
- 스크린샷에서 bottom navigation이 Home, Explore, My만 노출되는지 확인한다.
- 하단 Create recipe entry가 tab bar와 겹치지 않고 안전하게 위에 놓이는지 확인한다.

## 범위
- `output/playwright/` 스크린샷 artifact
- `plans/20260516_sub_ac_11_1_iphone_home_screenshot.md`
- `context/context_20260516_sub_ac_11_1_iphone_home_screenshot.md`

## 변경 파일
- 작업 전 계획 기준. 실제 결과는 결과 섹션에 기록한다.

## 테스트
- Expo web dev server를 iPhone viewport로 열어 Home 화면을 캡처한다.
- 캡처 결과에서 Home/Explore/My tab labels와 icon visibility, Create recipe lower placement를 육안 확인한다.

## 롤백
- 추가된 screenshot artifact와 이 plan/context 문서를 제거한다.

## 리스크
- 이 실행은 Expo web 기반 iPhone viewport 캡처이므로 실제 iOS simulator/native rendering과 완전히 동일하지 않을 수 있다.
- 현재 worktree에는 sibling-agent 변경과 untracked artifact가 많으므로 source file은 건드리지 않는다.

## 결과
- `output/playwright/20260516_sub_ac_11_1_iphone_home.png`를 저장했다.
- 캡처 artifact에는 Home, Explore, My 세 tab만 보이고 Source/Recipes는 보이지 않는다.
- Home copy는 `Continue recipe`, `Create recipe` 중심으로 표시되며 `workflow`, `Shoot`, `New Shoot`, `Start Shoot` copy를 노출하지 않는다.
- `My recipes`가 lower `Create recipe` entry보다 위에 있고, `Create recipe` entry는 bottom tab bar 위에 겹침 없이 배치되어 있다.
- 연결 context: `context/context_20260516_sub_ac_11_1_iphone_home_screenshot.md`
