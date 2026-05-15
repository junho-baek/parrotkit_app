# Context 2026-05-16 Home Tab Route Target

## 작업
Issue 6 Sub-AC 4.1: Home tab route가 Explore 또는 guide/detail content가 아니라 Home screen을 target/render하도록 root tab route 계약을 보강했다.

## DESIGN.md 확인
- `DESIGN.md`의 Bottom navigation and creation entry 섹션을 확인했다.
- Home, Explore, Paste, Recipes, My 5-slot 모델과 Paste 중심 action, box-in-box/redundant CTA guardrail을 확인했다.

## 변경
- `src/core/navigation/root-tab-config.ts`
  - root tab deep-link map인 `rootTabHrefs`를 단일 source of truth로 유지했다.
  - `index`는 `/`로 지정해 Home tab/root deep link가 Home route를 target하게 했다.
  - `source`는 `rootPasteActionHref`(`/recipe-create?mode=reference`)를 사용해 Paste 계약과 충돌하지 않게 했다.
- `src/core/navigation/root-tab-config.test.ts`
  - visible tab별 href 계약을 검증하도록 보강했다.
  - Home tab이 `/` 이외 Explore/detail route로 drift하면 실패하는 guard를 추가했다.
- `src/core/navigation/root-native-tabs.tsx`
  - visible `Tabs.Screen` options가 `rootTabHrefs[tabName]`를 사용하도록 연결했다.

## 검증
- RED: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
  - `rootTabHrefs` export가 없어 실패하는 것을 확인했다.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false`
- PASS: route module grep 확인
  - `src/app/(tabs)/index.tsx` exports `HomeScreen`.
  - `src/app/(tabs)/explore.tsx` exports `ExploreScreen`.
  - `src/app/explore-recipe/[recipeId].tsx` exports `ExploreRecipeDetailScreen`.
- BLOCKED: `npx -y @google/design.md lint DESIGN.md`
  - local binary 없음.
  - restricted network에서 npm registry DNS 실패: `getaddrinfo ENOTFOUND registry.npmjs.org`.

## 리스크
- 현재 worktree에는 sibling-agent 변경이 많이 남아 있어 이번 작업만 분리 commit/push하지 않았다.
- 실제 iOS/Android screenshot QA는 이 Sub-AC 범위에서 수행하지 않았다.
