# Context 2026-05-16 Bottom Nav Safe Area

## 작업
Issue 6 Sub-AC 10.1: iOS/Android root bottom navigation이 system gesture/home indicator 영역과 겹치지 않도록 safe-area 기반 height/padding 계산을 적용했다.

## DESIGN.md 확인
- `DESIGN.md`의 Layout 섹션에서 bottom inset/safe-area padding 요구를 확인했다.
- Bottom navigation 섹션에서 Home, Explore, Paste, Recipes, My 및 center Paste action 모델을 재확인했다.
- box-in-box, redundant CTA, 금지 creation copy guardrail을 확인했다.

## 변경
- `src/core/navigation/root-tab-safe-area.ts`
  - root tab bar layout helper를 추가했다.
  - `height = rootTabBarContentHeight + max(bottomInset, rootTabBarMinBottomPadding)` 계약을 명시했다.
  - iOS home indicator inset과 Android gesture/navigation inset을 bottom padding에 반영한다.
- `src/core/navigation/root-tab-safe-area.test.ts`
  - iOS 34px inset, Android 0px/24px inset, invalid inset clamp case를 runtime contract로 검증했다.
- `src/core/navigation/root-native-tabs.tsx`
  - `useSafeAreaInsets()`를 사용해 root tab bar style에 safe-area-aware `height`, `paddingBottom`, `paddingTop`을 적용했다.
  - 기존 Paste drawer, tab order, route interception 동작은 유지했다.
- `tsconfig.root-tabs-check.json`
  - 새 safe-area helper/test를 focused root-tabs check에 포함했다.

## 검증
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
  - `src/core/navigation/root-tab-safe-area.test.ts`의 helper import가 없어 실패함을 확인했다.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- Runtime safe-area contract: `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-safe-area.test.ts`
- Runtime route regression: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- 전체 타입 체크: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- DESIGN.md guard: bottom inset/safe-area, preferred v1 nav, box-in-box, redundant CTA 문구 존재 확인.
- 금지 copy 검색: 새 user-facing 금지 copy 추가 없음. 검색 hit는 기존 내부 식별자/test guard 문구뿐이다.
- Whitespace: `git diff --check -- src/core/navigation/root-tab-safe-area.ts src/core/navigation/root-tab-safe-area.test.ts src/core/navigation/root-native-tabs.tsx tsconfig.root-tabs-check.json plans/20260516_bottom_nav_safe_area.md`

## 리스크
- 이 Sub-AC에서는 simulator screenshot을 새로 생성하지 않았다.
- Shared worktree에 sibling-agent 변경이 많아 commit/push는 수행하지 않았다.
