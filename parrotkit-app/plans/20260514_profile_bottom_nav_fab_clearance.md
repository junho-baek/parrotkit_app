# Profile Bottom Nav FAB Clearance

## 배경

- AC 7 requires My/Profile content to remain unobscured by the bottom nav or global FAB on iPhone simulator layouts.
- The `/my` route keeps `GlobalSourceCta` visible, so Profile needs enough scroll bottom padding for both native tabs and the floating action.

## 목표

- Give My/Profile a focused bottom scroll padding contract that clears the iPhone bottom nav and FAB.
- Keep the change minimal and simulator-oriented.

## 범위

- Profile screen bottom padding only.
- Focused layout helper/test for Profile bottom clearance.
- Context documentation for this AC.

## 변경 파일

- `src/features/profile/screens/profile-screen.tsx`
- `src/features/profile/lib/profile-layout.ts`
- `src/features/profile/lib/profile-layout.test.ts`
- `tsconfig.profile-bottom-clearance-check.json`
- `context/context_20260514_profile_bottom_nav_fab_clearance.md`

## 테스트

- Red/green helper test with `sucrase-node`.
- Focused TypeScript check with `tsconfig.profile-bottom-clearance-check.json`.
- Attempt iPhone simulator availability check; record blocker if CoreSimulatorService remains unavailable.

## 롤백

- Remove the Profile layout helper/test and focused tsconfig.
- Revert `ProfileScreen` to the default `AppScreenScrollView` bottom padding.
- Remove this AC context entry.

## 리스크

- Live iPhone simulator QA may remain blocked by CoreSimulatorService in this environment.
- Worktree contains sibling AC edits, so this run must avoid broad formatting or unrelated navigation changes.

## 결과

- Added `getProfileScrollBottomPadding(bottomInset)` and applied it to `ProfileScreen`.
- My/Profile now uses 196pt base bottom padding plus the iPhone safe-area bottom inset, giving 230pt on home-indicator iPhones.
- The padding is scoped to `/my` and does not restore Source or Recipes as bottom tabs.
- 연결 context: `context/context_20260514_profile_bottom_nav_fab_clearance.md`
