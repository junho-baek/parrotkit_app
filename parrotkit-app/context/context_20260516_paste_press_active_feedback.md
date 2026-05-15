# Context 2026-05-16 Paste Press Active Feedback

## 작업
Issue 6 Sub-AC 10.3.3: centered Paste action에 distinct press/active feedback을 추가했다.

## DESIGN.md 확인
- Preferred v1 bottom navigation은 `Home`, `Explore`, larger center `Paste`, `Recipes`, `My`이다.
- `Paste`는 generic/debug action이 아니라 reference link를 붙여 recipe creation drawer/flow로 이어지는 action이다.
- Center action은 circular/larger일 수 있지만 bottom bar와 통합되어 보여야 한다.
- 사용자-facing UI에 Shoot/New Shoot/Start Shoot/workflow/console/debug copy를 추가하지 않아야 한다.

## 변경
- `src/core/navigation/root-native-tabs.tsx`
  - Paste visual active state를 route focus뿐 아니라 `pasteDrawerState.open`에도 연결했다.
  - Paste drawer가 열린 동안 halo/background/border/shadow/label이 active 상태로 보인다.
  - Paste `RootTabButton`에 `active` prop을 추가하고 active 상태에서는 accessibility state에 `expanded: true`를 반영했다.
  - Paste pressed state를 standard tabs와 구분되도록 opacity + translate/scale 값을 강화했다.
  - `onPress={openPasteDrawer}`, `rootTabHrefs.source`, `RecipeCreateScreen initialMode="reference"` 흐름은 유지했다.
- `src/core/navigation/root-tab-config.test.ts`
  - Paste active feedback이 drawer-open state에 연결되고, active halo/pressed style이 유지되는지 static guard를 추가했다.

## 검증
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `git diff --check` 통과.
- `DESIGN.md` bottom navigation/Paste guardrail 확인.
- forbidden user-facing copy 검색: 신규 UI copy 없음. 검색 hit는 `DESIGN.md` guardrail 텍스트와 기존 내부 식별자 `homeQuickShootChromeHidden`.

## 리스크
- 실제 iPhone/Android screenshot QA는 이 sub-AC 범위에서 수행하지 않았다.
- 공유 worktree에 sibling-agent 변경이 많아 커밋/푸시는 하지 않았다.
