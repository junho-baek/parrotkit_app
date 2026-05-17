# Recipe Create Drawer Motion And Bottom Margin Plan

## 배경

- User confirmed Paste now opens the drawer, but the drawer lacks a soft bottom-up entrance.
- User also noted the bottom CTA area needs more breathing room.
- DESIGN.md requires the recipe creation flow to remain a bottom drawer/modal sheet with dim backdrop, rounded top corners, drag handle, and safe-area padding.

## 목표

- Add a smooth bottom-up drawer entrance and dismissal motion.
- Add bottom safe-area margin around the primary CTA so it does not feel pinned to the screen edge.
- Preserve existing drawer contents, Link default mode, dim backdrop, drag handle, close button, and primary CTA.

## 범위

- `src/features/recipes/screens/recipe-create-screen.tsx`
- `src/features/recipes/screens/recipe-create/recipe-create-styles.ts`
- A focused source contract test for drawer motion and bottom margin.

## 변경 파일

- Modify: `src/features/recipes/screens/recipe-create-screen.tsx`
- Modify: `src/features/recipes/screens/recipe-create/recipe-create-styles.ts`
- Create: `src/features/recipes/screens/recipe-create/recipe-create-drawer-motion.test.ts`
- Create/update context file after verification.

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-create/recipe-create-drawer-motion.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `git diff --check`

## 롤백

- Revert this motion/margin commit. The previous drawer remains functional but visually abrupt.

## 리스크

- Route modal presentation may already animate on some platforms; internal motion should stay subtle to avoid feeling double-animated.
- Dismiss animation delays close callbacks by under 200ms; keep it short and only for close/backdrop actions.

## 결과

- Added a subtle `Animated` bottom-up entrance for the drawer sheet.
- Added fade-in/fade-out handling for the dim backdrop.
- Added a short dismissal animation for backdrop and X close.
- Moved bottom spacing to the footer CTA area with `Math.max(insets.bottom + 18, 28)`.
- Added a source contract test for drawer motion and bottom margin.
- Verification passed: drawer motion contract, Paste nav contracts, TypeScript, architecture check, and diff whitespace.
