# Sub-AC 7.2.2 My Settings Entry Point

## 배경
Previous navigation realignment follow-up verified that the My tab remains the Profile entry point. This task is limited to the next failed/pending item: confirming that Settings remains reachable from the My screen while preserving the completed Home, Explore, My bottom-tab contract.

## 목표
- Verify the My/Profile screen exposes a Settings entry point.
- Preserve Source and Recipes as non-visible bottom tabs.
- Avoid changing the primary floating CTA copy or route behavior.

## 범위
- Add focused contract coverage for the My screen Settings surface.
- Run focused local checks only.
- Record simulator availability if CoreSimulatorService remains unavailable.

## 변경 파일
- `plans/20260514_sub_ac_7_2_2_my_settings_entry_point.md`
- `context/context_20260514_sub_ac_7_2_2_my_settings_entry_point.md`
- `src/features/profile/lib/my-settings-entry.test.ts`
- `tsconfig.my-settings-entry-check.json`

## 테스트
- Run the focused My Settings entry contract test.
- Run focused TypeScript validation for the My/Profile settings surface.
- Run the existing root-tab contract check to confirm Source and Recipes were not reintroduced.
- Attempt iPhone simulator availability check and record blocker if CoreSimulatorService remains unavailable.

## 롤백
- Remove this plan/context file.
- Remove the focused My Settings entry contract test and tsconfig.

## 리스크
- The iPhone simulator is the UI gate, but this environment may continue to block CoreSimulatorService.
- This AC should not make broader Settings architecture changes because the current My screen already contains the settings controls.

## 결과
- My/Profile 화면은 기존 Settings 섹션을 이미 노출하고 있으며, 해당 섹션 안에 English/Korean language controls가 유지되는 것을 검증했다.
- Production UI code 변경 없이 focused contract coverage만 추가했다.
- Source와 Recipes는 visible bottom tab으로 재도입하지 않았다.
- Focused checks passed:
  - `./node_modules/.bin/sucrase-node src/features/profile/lib/my-settings-entry.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.my-settings-entry-check.json`
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- iPhone simulator check failed because CoreSimulatorService is unavailable in this environment (`connection became invalid` / `Connection refused`).
- 연결 context: `context/context_20260514_sub_ac_7_2_2_my_settings_entry_point.md`
