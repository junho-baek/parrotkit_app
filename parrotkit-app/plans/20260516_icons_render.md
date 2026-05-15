# Icons Render

## 배경
Issue 6 AC 9 requires the Home, Explore, Paste, Recipes, and My bottom tab icons to render reliably in iPhone and Android native captures.

## 목표
- Visible root tabs keep concrete icon names for focused and unfocused states across all five slots.
- Icon names are type-checked against Expo MaterialCommunityIcons.
- Focused validation fails if any configured tab icon is missing from the bundled glyph map.
- The centered Paste CTA renders from the same validated icon contract as the neighboring tabs.

## 범위
- Root tab icon mapping, rendered tab icon usage, and focused root tab contract checks only.
- Do not change Home hierarchy, create entry placement, hidden route behavior, or tab bar visual weight beyond what icon rendering requires.

## 변경 파일
- `plans/20260516_icons_render.md`
- `src/core/navigation/root-tab-icons.ts`
- `src/core/navigation/root-native-tabs.tsx`
- `src/core/navigation/root-tab-config.test.ts`
- `tsconfig.root-tabs-check.json`
- `context/context_20260516_icons_render.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- DESIGN.md lint equivalent: verify `DESIGN.md` is present/read and relevant guardrails were applied. Do not run network-only lint if sandbox blocks npm registry.

## 롤백
- Inline the tab icon switch back into `root-native-tabs.tsx` and remove the additional glyph-map assertions if the helper module creates an Expo Router bundling issue.

## 리스크
- Native screenshots are intentionally not added in this AC execution per seed constraints; this pass provides code-level and glyph-map validation.

## 결과
- Added `src/core/navigation/root-tab-icons.ts` so Home/Explore/Paste/Recipes/My focused and unfocused icons are typed against Expo MaterialCommunityIcons.
- Updated root tabs to consume the shared icon helper for all five rendered slots, including the centered Paste CTA, without changing route visibility or tab bar presentation.
- Added glyph-map assertions to the root tab contract test so missing native icon glyphs fail focused validation.
- `npx --no-install @google/design.md lint DESIGN.md` was attempted but blocked by npm registry DNS (`ENOTFOUND`); local DESIGN.md source checks, focused tests, TypeScript checks, and `git diff --check` passed.
- 연결 context: `context/context_20260516_icons_render.md`
