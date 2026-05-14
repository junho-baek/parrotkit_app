# Assets Recipe Create Metro ENOENT

## 작업 시간

- 2026-05-14

## 범위

- AC 8: Metro logs no longer show `ENOENT` for `assets/recipe-create` during simulator QA.
- Change stayed limited to Metro dev-server request handling.

## 원인

- Prior simulator QA reported `ENOENT: no such file or directory, scandir '.../assets/recipe-create'`.
- Repo search found no TypeScript, route, or `app.json` source reference to `assets/recipe-create`.
- Metro’s single-asset middleware handles every `/assets/*` request as a filesystem asset.
- A route-derived bad request such as `/assets/recipe-create/index.png?platform=ios` makes Metro call `fs.readdir` on the nonexistent `assets/recipe-create` directory, producing the logged ENOENT.

## 변경 요약

- Updated `metro.config.js`.
  - Preserves any existing Expo/NativeWind middleware behavior.
  - Intercepts only `/assets/recipe-create` and `/assets/recipe-create/*`.
  - Returns `204` before Metro attempts filesystem asset resolution.
  - Delegates all other requests, including real `/assets/*` app assets, to the original middleware.

## 검증

- Root-cause reproduction:
  - A direct Metro `getAsset('assets/recipe-create/index.png', ...)` probe produced `ENOENT: no such file or directory, scandir '.../assets/recipe-create'`.
- Middleware verification:
  - `REACT_NATIVE_IDE_LIB_PATH=1 node - <<'NODE' ... NODE`
  - Passed: `/assets/recipe-create/index.png?platform=ios` returned 204 before delegation.
  - Passed: `/assets/icon.png?platform=ios` still delegated normally.
- Config checks:
  - `node -c metro.config.js` passed.
  - `EXPO_NO_TELEMETRY=1 ./node_modules/.bin/expo config --type public` passed.

## Simulator QA

- Attempted `xcrun simctl list devices booted` and `xcrun simctl list devices available`.
- Blocked by CoreSimulatorService connection failure: `CoreSimulatorService connection became invalid` / `Unable to locate device set`.
- Live iPhone Metro log capture could not be completed in this sandbox.

## 리스크 / 후속

- The fix is intentionally scoped to the invalid recipe-create asset prefix; it does not prove which simulator client request originally generated the bad asset URL.
- Re-run iPhone simulator QA in an environment with working CoreSimulatorService and confirm Metro logs stay free of `assets/recipe-create` ENOENT.
