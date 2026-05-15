# Context 2026-05-16 Icons Render

## 작업
Issue 6 AC 9: Bottom tab icons must render reliably on iPhone and Android captures.

## DESIGN.md 확인
- `DESIGN.md`를 먼저 확인했고, bottom navigation은 lightweight/native-feeling surface를 유지해야 한다는 방향을 적용했다.
- Home hierarchy/copy/create placement는 sibling AC 범위라 건드리지 않았다.
- Five-slot nav contract is Home, Explore, Paste, Recipes, My.

## 변경
- `src/core/navigation/root-tab-icons.ts`
  - Home/Explore/Paste/Recipes/My focused/unfocused icon names를 typed helper로 분리했다.
  - Icon names are typed against `@expo/vector-icons/MaterialCommunityIcons`, so invalid icon names fail TypeScript.
- `src/core/navigation/root-native-tabs.tsx`
  - Tab rendering now consumes the shared icon helper for all five visible slots, including the centered Paste CTA, while preserving existing visible/hidden route behavior.
- `src/core/navigation/root-tab-config.test.ts`
  - Added a glyph-map assertion that every configured Home/Explore/Paste/Recipes/My tab icon exists in the bundled MaterialCommunityIcons glyph map.
- `tsconfig.root-tabs-check.json`
  - Included the new icon helper in the focused root tab TypeScript check.

## 검증
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `git diff --check` 통과.
- `test -s DESIGN.md && rg -n "Simplicity Guardrails|Use bottom inset|Typography should reduce UI complexity|not a workflow console" DESIGN.md` 통과.
- `npx --no-install @google/design.md lint DESIGN.md` attempted, but failed because the sandbox cannot resolve `registry.npmjs.org` (`ENOTFOUND`).

## 리스크
- Seed constraint says not to include QA screenshots unless explicitly requested, so no new screenshot artifact was created in this AC pass.
- Existing sibling-agent worktree changes and untracked QA artifacts were left untouched.
