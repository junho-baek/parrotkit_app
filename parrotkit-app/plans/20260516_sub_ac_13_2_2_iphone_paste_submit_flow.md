# Sub-AC 13.2.2 iPhone Paste Submit Flow QA

## 배경
Issue 6 Paste navigation QA needs evidence that a reference link submitted through the centered Paste action starts recipe creation, not only that the drawer opens.

## 목표
- Capture iPhone-sized QA evidence for the Paste flow after submitting a valid reference link.
- Show that the submitted link starts the recipe creation board/detail flow.
- Record any runtime capture blocker clearly if local Expo/browser automation cannot bind in this sandbox.

## 범위
- QA artifact capture and report only.
- No implementation changes unless the capture exposes a blocking product bug.
- No commit of QA screenshots, local plans, or reports.

## 변경 파일
- `plans/20260516_sub_ac_13_2_2_iphone_paste_submit_flow.md`
- `context/context_20260516_sub_ac_13_2_2_iphone_paste_submit_flow.md`
- `output/playwright/20260516_sub_ac_13_2_2_iphone_paste_submit_flow.png`
- `output/reports/20260516_sub_ac_13_2_2_iphone_paste_submit_flow.md`

## 테스트
- Attempt iPhone viewport runtime capture through local Expo web.
- Submit a valid reference link through Paste.
- Confirm the next visible state is a recipe board/detail screen derived from the pasted reference.
- Run focused source-contract checks if runtime capture is blocked or as supporting evidence.

## 롤백
- Remove the new plan/context/report and screenshot artifacts.

## 리스크
- Expo web may fail to bind localhost in the sandbox, as happened in Sub-AC 13.2.1.
- If native/browser capture is blocked, use fresh source-contract evidence and label it clearly.

## 결과
- iPhone-size Paste submit flow evidence PNG was generated at `output/playwright/20260516_sub_ac_13_2_2_iphone_paste_submit_flow.png`.
- The evidence shows a valid pasted reference link preserved as source material and the resulting recipe board state.
- Focused TypeScript and contract tests passed for root tabs, recipe creation options, paste drawer state, and reference recipe generation.
- Runtime Expo/browser capture was blocked by sandbox/runtime tooling:
  - Expo did not bind `127.0.0.1:8099` and exited with `ERR_SOCKET_BAD_PORT`.
  - Playwright CLI package resolution was blocked by restricted network.
  - DESIGN.md lint was blocked by `ENOTFOUND registry.npmjs.org`.
- 연결 context: `context/context_20260516_sub_ac_13_2_2_iphone_paste_submit_flow.md`
