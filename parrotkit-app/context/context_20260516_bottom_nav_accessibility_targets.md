# Context 2026-05-16 Bottom Nav Accessibility Targets

## 작업

Issue 6 Sub-AC 10.3.1: bottom navigation의 모든 visible item에 minimum touch target sizing과 accessibility label/role을 추가한다.

## DESIGN.md 확인

- `DESIGN.md`의 Bottom navigation and creation entry, CTA copy, Do's and Don'ts를 확인했다.
- 기준: Home, Explore, Paste, Recipes, My five-slot model 유지; Paste는 larger center action이며 drawer/flow를 열어야 한다.
- 이번 변경은 copy나 layout hierarchy를 늘리지 않고 accessibility metadata와 touch target sizing만 보강했다.

## 변경

- `src/core/navigation/root-tab-config.ts`
  - `rootTabMinimumTouchTarget = 48` 추가.
  - visible tabs별 role contract 추가: Home/Explore/Recipes/My는 `tab`, Paste는 drawer action이므로 `button`.
- `src/core/navigation/root-native-tabs.tsx`
  - 모든 visible root tab에 `RootTabButton` Pressable wrapper 적용.
  - wrapper가 `accessibilityLabel={label}`, `accessibilityRole={role}`, `accessibilityState`, `onLongPress`, `onPress`를 전달하도록 정리.
  - regular tab button surface와 Paste surface에 shared 48px minimum touch target을 적용.
- `src/core/navigation/root-tab-config.test.ts`
  - touch target 최소값, role mapping, source-level accessibility prop wiring contract를 추가.

## 검증

- GREEN: `npx tsc --noEmit -p tsconfig.root-tabs-check.json`
- GREEN: `npx --no-install sucrase-node src/core/navigation/root-tab-config.test.ts`
- GREEN: `git diff --check -- src/core/navigation/root-native-tabs.tsx src/core/navigation/root-tab-config.ts src/core/navigation/root-tab-config.test.ts plans/20260516_bottom_nav_accessibility_targets.md`
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - 결과: `ENOTFOUND registry.npmjs.org`
  - repo-local `node_modules/.bin`에는 design.md lint binary가 없어 formal lint는 network 제한으로 완료하지 못했다.
- LOCAL EQUIVALENT: `DESIGN.md` bottom nav/source copy 기준을 확인했고, navigation 변경 파일에는 새 forbidden user-facing copy를 추가하지 않았다.

## 리스크

- 이 worktree는 sibling-agent 변경이 많은 shared dirty 상태다. 같은 navigation 파일에 이미 완료된 AC 변경이 섞여 있어, 이 sub-AC만 안전하게 commit/push하지 않았다.
