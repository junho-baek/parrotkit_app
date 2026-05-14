# Assets Recipe Create Metro ENOENT

## 배경

- AC 8 requires Metro logs to stop showing `ENOENT` for `assets/recipe-create` during iPhone simulator QA.
- Prior QA recorded `ENOENT: no such file or directory, scandir '.../assets/recipe-create'`.
- The Seed scopes this run to simulator QA and asks for minimal changes without commit/push.

## 목표

- Identify the source of the `assets/recipe-create` scandir request.
- Apply the smallest fix that keeps simulator Metro logs clean for the recipe-create route.
- Preserve existing route and creation workflow behavior.

## 범위

- Metro/asset request handling related to the `/recipe-create` simulator route.
- Minimal asset or config changes only if root cause evidence supports them.
- Focused verification via local Metro request/log check when simulator access is unavailable.

## 변경 파일

- `metro.config.js`
- `plans/20260514_assets_recipe_create_metro_enoent.md`
- `context/context_20260514_assets_recipe_create_metro_enoent.md`

## 테스트

- Reproduce the `assets/recipe-create` request against local Metro.
- Verify the same request no longer logs or returns ENOENT after the fix.
- Run a focused repo check if any TypeScript/config file changes are made.

## 롤백

- Remove the asset/config change and return Metro asset handling to the previous state.

## 리스크

- iPhone simulator may be unavailable in the sandbox, so verification may need to use local Metro request evidence instead of full simulator logs.
- Avoid modifying sibling navigation or create-screen product files unless the ENOENT root cause points there.

## 결과

- Confirmed there is no source import or `app.json` asset reference to `assets/recipe-create`.
- Reproduced the root failure at Metro’s asset layer: `getAsset('assets/recipe-create/index.png', ...)` raises `ENOENT: no such file or directory, scandir '.../assets/recipe-create'`.
- Updated `metro.config.js` to intercept only `/assets/recipe-create` and `/assets/recipe-create/*` requests before Metro’s single-asset middleware scans the filesystem.
- Preserved normal Metro asset handling for all other `/assets/*` requests.
- Verification passed:
  - `REACT_NATIVE_IDE_LIB_PATH=1 node - <<'NODE' ... NODE` middleware probe: recipe-create asset probe returned 204 and `/assets/icon.png` delegated normally.
  - `node -c metro.config.js`
  - `EXPO_NO_TELEMETRY=1 ./node_modules/.bin/expo config --type public`
- Live simulator QA remained blocked by CoreSimulatorService connection failure in this sandbox.
- Linked context: `context/context_20260514_assets_recipe_create_metro_enoent.md`
