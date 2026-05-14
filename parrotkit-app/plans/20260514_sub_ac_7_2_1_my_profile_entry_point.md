# Sub-AC 7.2.1 My Profile Entry Point

## 배경
Previous navigation realignment work keeps the visible bottom tabs limited to Home, Explore, and My. This follow-up is limited to verifying that the My tab remains the Profile entry point without restoring Source or Recipes as bottom tabs.

## 목표
- Verify `/my` opens the Profile screen.
- Preserve existing Home, Explore, My bottom-tab contract.
- Avoid changing the primary floating CTA language or route behavior.

## 범위
- Add focused contract coverage for the My route/Profile screen connection.
- Run focused local checks only.
- Record simulator availability if needed.

## 변경 파일
- `plans/20260514_sub_ac_7_2_1_my_profile_entry_point.md`
- `context/context_20260514_sub_ac_7_2_1_my_profile_entry_point.md`
- `src/features/profile/lib/my-profile-entry.test.ts`
- `tsconfig.my-profile-entry-check.json`

## 테스트
- Run the focused My/Profile entry contract test.
- Run focused TypeScript validation for the My route/Profile screen surface.
- Attempt iPhone simulator availability check and record blocker if CoreSimulatorService remains unavailable.

## 롤백
- Remove this plan/context file.
- Remove the focused My/Profile entry contract test and tsconfig.

## 리스크
- iPhone simulator remains the intended UI gate, but this environment may continue to block CoreSimulatorService.
- This AC should not make broad Profile UI changes because prior saved recipe/take and clearance fixes are already present.

## 결과
- `/my` route was verified as the Profile entry point: `src/app/(tabs)/my.tsx` exports `ProfileScreen` as the default route component.
- Added focused route contract coverage in `src/features/profile/lib/my-profile-entry.test.ts`.
- Added focused TypeScript validation in `tsconfig.my-profile-entry-check.json`.
- Preserved the completed bottom-tab contract; Source and Recipes were not reintroduced as visible bottom tabs.
- Focused checks passed:
  - `./node_modules/.bin/sucrase-node src/features/profile/lib/my-profile-entry.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.my-profile-entry-check.json`
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- iPhone simulator check failed because CoreSimulatorService is unavailable in this environment (`connection became invalid` / `Connection refused`).
- 연결 context: `context/context_20260514_sub_ac_7_2_1_my_profile_entry_point.md`
