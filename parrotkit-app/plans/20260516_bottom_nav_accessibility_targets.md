# Bottom Nav Accessibility Targets

## 배경

Issue 6 paste navigation work restored the five-slot Home, Explore, Paste, Recipes, My bottom navigation. This sub-AC focuses on accessibility affordances for those bottom nav items.

## 목표

All visible bottom navigation items expose explicit accessibility labels/roles and have at least a 48px touch target.

## 범위

- Root bottom tab button accessibility metadata.
- Minimum touch target sizing for regular tabs and the center Paste CTA.
- Focused TypeScript contract coverage for the navigation shell.

## 변경 파일

- `src/core/navigation/root-native-tabs.tsx`
- `src/core/navigation/root-tab-config.test.ts`
- `plans/20260516_bottom_nav_accessibility_targets.md`
- `context/context_20260516_bottom_nav_accessibility_targets.md`

## 테스트

- `npx tsc --noEmit -p tsconfig.root-tabs-check.json`
- Focused nav contract execution if the project test setup supports it.

## 롤백

Revert the focused nav button wrapper and the related test additions; the previous five-slot route config remains intact.

## 리스크

Replacing the default tab button for regular tabs must preserve React Navigation tab press behavior and existing route mapping.

## 결과

- `RootTabButton` wrapper를 모든 visible root tab에 적용해 `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, `onLongPress`를 명시적으로 전달했다.
- regular tab과 center Paste CTA surface/item에 shared `rootTabMinimumTouchTarget = 48` 기반 `minHeight`/`minWidth`를 적용했다.
- Paste는 drawer action이므로 `button`, Home/Explore/Recipes/My는 navigation tab이므로 `tab` role을 사용한다.
- 연결 context: `context/context_20260516_bottom_nav_accessibility_targets.md`

## 검증

- GREEN: `npx tsc --noEmit -p tsconfig.root-tabs-check.json`
- GREEN: `npx --no-install sucrase-node src/core/navigation/root-tab-config.test.ts`
- GREEN: `git diff --check -- src/core/navigation/root-native-tabs.tsx src/core/navigation/root-tab-config.ts src/core/navigation/root-tab-config.test.ts plans/20260516_bottom_nav_accessibility_targets.md`
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다.
- LOCAL EQUIVALENT: `DESIGN.md` bottom navigation/source copy 기준을 재확인했고, navigation 변경 파일에는 새 user-facing forbidden copy를 추가하지 않았다.
