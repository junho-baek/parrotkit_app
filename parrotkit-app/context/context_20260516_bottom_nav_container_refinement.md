# Context 2026-05-16 Bottom Nav Container Refinement

## 작업
Issue 6 Sub-AC 10.2.1: restored five-slot bottom navigation의 컨테이너 레이아웃, spacing, alignment, safe-area handling, shadow/elevation 처리를 정리했다.

## DESIGN.md 확인
- `DESIGN.md`를 먼저 읽고 Layout, Elevation & Depth, Bottom navigation and creation entry 섹션을 확인했다.
- Preferred v1 nav는 Home, Explore, Paste, Recipes, My이며 Paste는 larger center action이다.
- Bottom inset/safe-area padding을 유지하고, white surface + light depth를 우선하며, box-in-box/redundant CTA를 피해야 함을 확인했다.

## 변경
- `src/core/navigation/root-tab-safe-area.ts`
  - tab bar content height, minimum bottom padding, top/horizontal padding, Paste CTA diameter/frame/top offset 상수를 추가했다.
  - safe-area layout helper가 horizontal padding까지 반환하도록 확장했다.
- `src/core/navigation/root-tab-safe-area.test.ts`
  - horizontal padding, Paste CTA diameter/frame/top offset, raised action anchoring 계약을 추가했다.
- `src/core/navigation/root-native-tabs.tsx`
  - helper 상수를 Paste CTA/button frame style에 연결했다.
  - regular tab item을 중앙 정렬하고 edge padding을 tab bar layout에서 적용한다.
  - tab bar surface에 hairline top border, iOS shadow, Android elevation을 적용해 native-feeling light depth를 만들었다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: DESIGN.md source guard
  - `rg -n "Preferred v1 bottom navigation model|Paste as the larger center action|Use bottom inset|Elevation & Depth|Do not create box-in-box|Do not add redundant CTA" DESIGN.md`
- PASS: forbidden user-facing copy scan for touched navigation files. Only hit is existing internal identifier `homeQuickShootChromeHidden`.
- PASS: `git diff --check -- src/core/navigation/root-tab-safe-area.ts src/core/navigation/root-tab-safe-area.test.ts src/core/navigation/root-native-tabs.tsx plans/20260516_bottom_nav_container_refinement.md`
- BLOCKED: `npx --no-install @google/design.md lint DESIGN.md`
  - repo-local `node_modules/.bin` exposes `tsc` only, no local design lint binary.
  - sandbox network cannot resolve `registry.npmjs.org`, so npm package resolution failed with `ENOTFOUND`.

## 리스크
- 이 sub-AC에서는 iPhone/Android simulator screenshot을 새로 생성하지 않았다.
- Shared worktree에 sibling-agent 변경이 많아 commit/push는 수행하지 않았다.
