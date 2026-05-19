# 2026-05-19 Go Reference API Dev Runtime

## Request

Focused fix for issue #19 dev-runtime mismatch. Expo already calls
`/v1/reference-analysis`, but local/mobile QA could still point Expo at the old
Next dev server on port `3000`, and the Go service was not started by the root
dev flow.

## Changes

- Added `scripts/dev-reference-api.cjs` and root `npm run dev:reference-api`.
  - Loads root `.env.local` for the Go process only.
  - Prints only secret presence, not raw values.
  - Defaults `PORT=8787`.
  - Sets `PARROTKIT_ALLOW_DEV_UNAUTH=true` for local QA.
- Added `parrotkit-app/scripts/start-expo-reference-lan.cjs`.
  - Wired `parrotkit-app` scripts `start:go` and `start:reference-api:lan`.
  - Wired root `npm run dev:mobile:lan`.
  - Sets Expo `EXPO_PUBLIC_PARROTKIT_API_URL` to `http://<Mac-LAN-IP>:8787`.
  - Refuses URLs using port `3000`.
- Updated `.env.local.example`, `parrotkit-app/.env.local.example`,
  `services/reference-api/README.md`, and `README.md` with the local iPhone QA
  launch flow.
- Added plan `plans/20260519_go_reference_api_dev_runtime.md`.

## Verification

- PASS: `cd services/reference-api && go test ./...`
- PASS: `node --check scripts/dev-reference-api.cjs`
- PASS: `node --check parrotkit-app/scripts/start-expo-reference-lan.cjs`
- PASS: `npm run dev:reference-api -- --print-config`
- PASS: `PARROTKIT_LAN_IP=192.168.0.10 npm run dev:mobile:lan -- --print-config`
- PASS: `EXPO_PUBLIC_PARROTKIT_API_URL=http://192.168.0.10:3000 node parrotkit-app/scripts/start-expo-reference-lan.cjs --print-config` failed as expected, refusing `:3000`.
- PASS: `npm run dev:reference-api` started `reference-api listening on :8787`.
- PASS: `curl -fsS http://localhost:8787/healthz` returned `{"ok":true}`.

## Launch Notes

For physical iPhone QA:

```bash
npm run dev:reference-api
PARROTKIT_LAN_IP=<Mac-LAN-IP> npm run dev:mobile:lan
```

The Expo API base should be `http://<Mac-LAN-IP>:8787`, not
`http://<Mac-LAN-IP>:3000`.

## Limitations

- The developer still needs the Mac and iPhone on the same LAN.
- If auto-detection picks the wrong network interface, pass
  `PARROTKIT_LAN_IP=<Mac-LAN-IP>` explicitly.
