# Sub-AC 13.2.1 iPhone Paste Drawer QA

## 배경
Issue 6 Paste navigation work needs iPhone QA evidence that the centered Paste bottom-navigation action opens the recipe creation paste drawer.

## 목표
- Capture iPhone-sized evidence showing the five-slot bottom navigation.
- Show the centered Paste action as the primary bottom-nav CTA.
- Show the paste/reference-link drawer open from that bottom-nav action with visible link-input affordance.

## 범위
- QA artifact capture and report only.
- No implementation changes.
- No commit of QA screenshots, local plans, or reports.

## 변경 파일
- `plans/20260516_sub_ac_13_2_1_iphone_paste_drawer.md`
- `context/context_20260516_sub_ac_13_2_1_iphone_paste_drawer.md`
- `output/playwright/20260516_sub_ac_13_2_1_iphone_paste_drawer.png`
- `output/reports/20260516_sub_ac_13_2_1_iphone_paste_drawer.md`

## 테스트
- Attempt local Expo web/iPhone viewport capture.
- Verify source route/tab contracts and paste drawer state contract.
- Review the resulting evidence image for centered Paste and drawer input visibility.

## 롤백
- Remove the new plan/context/report and screenshot artifacts.

## 리스크
- Runtime browser/native capture may remain blocked by the sandbox.
- If runtime capture is blocked, use freshly generated source-contract QA evidence and clearly label it as not a native Simulator screenshot.

## 결과
- iPhone-size Paste drawer evidence PNG was generated at `output/playwright/20260516_sub_ac_13_2_1_iphone_paste_drawer.png`.
- Source contract verification passed for five-slot nav, Paste action href, Paste drawer open state, and drawer state transitions.
- Runtime Expo/browser capture was blocked because the local server did not bind the requested localhost port in this sandbox.
- 연결 context: `context/context_20260516_sub_ac_13_2_1_iphone_paste_drawer.md`
