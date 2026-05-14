# Context 2026-05-14 AC10 Existing V1 Preserved

## 작업

- Seed AC 10: 기존 v1 구조 보존 확인.
- Scope was limited to bottom tab membership and the global floating creation CTA while sibling tasks work on Home Continue internals.

## 확인

- `src/core/navigation/root-tab-config.ts`
  - `rootTabNames` remains `['index', 'explore', 'my']`.
- `src/core/navigation/root-native-tabs.tsx`
  - Visible bottom tabs are rendered from `rootTabNames.map(...)`.
  - No Source or Recipes tab trigger was added.
- `src/core/navigation/global-create-cta.ts`
  - Korean floating CTA label remains `레시피 생성`.
  - Korean accessibility label remains `레시피 생성`.
  - Destination remains `/recipe-create?mode=manual`, preserving the existing blank/manual recipe creation flow.

## 변경

- Production code changes: none.
- Added the AC-specific plan and this context note.

## 검증

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
  - Passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
  - Passed.
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
  - Passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
  - Passed.
- Additional source scan:
  - `rg "rootTabNames|NativeTabs\\.Trigger|name=\\\"(source|recipes)\\\"|레시피 생성|Shoot|New Shoot|Start Shoot" src/core/navigation 'src/app/(tabs)' src/features/home/lib -n`
  - Confirmed visible tab creation remains driven by `rootTabNames`; Shoot/New Shoot/Start Shoot only appear in regression tests as forbidden copy checks.

## 리스크

- No simulator QA was run for this preservation-only AC.
- Sibling Home Continue integration should rerun these focused checks if it touches root tab or global CTA files.

## 연결 문서

- `plans/20260514_ac10_existing_v1_preserved.md`
