# Sub-AC 13.1 iPhone Navigation States QA

## 배경
Issue 6 Paste navigation work needs fresh iPhone QA evidence for the Home, Explore, Recipes, and My navigation states after restoring the five-slot bottom navigation.

## 목표
- iPhone-sized capture evidence for Home, Explore, Recipes, and My.
- Confirm each state shows the intended screen and the five-slot bottom nav with centered Paste.
- Confirm Home/root does not show Unmatched Route during capture.

## 범위
- QA artifact capture and report only.
- No implementation changes.
- No commit of QA screenshots or local plan/context artifacts.

## 변경 파일
- `plans/20260516_sub_ac_13_1_iphone_nav_states.md`
- `context/context_20260516_sub_ac_13_1_iphone_nav_states.md`
- `output/playwright/20260516_sub_ac_13_1_iphone_*.png`
- `output/reports/20260516_sub_ac_13_1_iphone_nav_states.md`

## 테스트
- Run local Expo web if possible.
- Use iPhone viewport browser captures for `/`, `/explore`, `/recipes`, and `/my`.
- Review snapshots/screenshots for route correctness and bottom navigation state.

## 롤백
- Remove the new plan/context/report and screenshot artifacts.

## 리스크
- Native iOS Simulator access may remain unavailable in this sandbox.
- Expo web startup may fail due to previously observed `freeport-async` socket errors.
- Browser automation package download may be blocked by restricted network; if so, record blocker and do not reuse stale evidence.

## 결과
- iPhone-size route/navigation evidence PNGs were generated under `output/playwright/`.
- Runtime native/browser screenshot capture was blocked by the sandbox and recorded in `output/reports/20260516_sub_ac_13_1_iphone_nav_states.md`.
- Source route/layout contract verification passed for Home, Explore, Recipes, and My.
- 연결 context: `context/context_20260516_sub_ac_13_1_iphone_nav_states.md`
