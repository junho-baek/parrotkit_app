# Paste Drawer Hit Target Fix Plan

## 배경

- User verified the latest Expo tunnel and reported that tapping bottom-center Paste still does not open the drawer.
- Existing source tests only proved `openPasteDrawer` was wired through `tabBarButton`; they did not prove native tap delivery.
- Root cause hypothesis after inspection: the centered Paste item is kept as a visible Expo Router tab with `href="/"`, so native tab press delivery can still behave like a tab surface instead of a reliable app-shell action.

## 목표

- Make the visible Paste control open the existing recipe-create drawer reliably from the app shell.
- Keep Paste as an action, not a destination page.
- Do not change Recipes/My UI cleanup from the previous commit.

## 범위

- Modify `src/app-shell/navigation/root-native-tabs.tsx`.
- Strengthen `src/core/navigation/root-tab-config.test.ts`.
- Update context with root cause and verification.

## 변경 파일

- `src/app-shell/navigation/root-native-tabs.tsx`
- `src/core/navigation/root-tab-config.test.ts`
- `plans/20260518_paste_drawer_hit_target_fix.md`
- `context/context_20260518_paste_drawer_hit_target_fix.md`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `git diff --check`
- Restart Expo tunnel with `--clear` and give the user a fresh link.

## 롤백

- Revert the hit target fix commit. The previous state keeps the visual Paste tab but may remain unreliable in native Expo Go.

## 리스크

- A transparent hit target can drift from the visual Paste button if bottom tab geometry changes. Guard this with constants from `root-tab-safe-area.ts` rather than hard-coded viewport values.
- Native device confirmation still depends on the user tapping the fresh Expo link.

## 결과

- Added an app-shell-owned transparent Paste hit target above the visual bottom-center tab item.
- The hit target calls `openPasteDrawer` directly and sits below the drawer overlay, so it does not interfere once the drawer is open.
- Strengthened the root tab contract test to require the dedicated hit target and geometry-based sizing.
- Verification passed for root tab contracts, paste drawer state, TypeScript, architecture boundaries, and whitespace.
