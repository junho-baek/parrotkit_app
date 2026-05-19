# Go Reference API Dev Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local/mobile QA launch the Go reference API on port `8787` and point Expo at that API, avoiding accidental calls to the old Next dev server on port `3000`.

**Architecture:** Keep the Go reference analysis backend in `services/reference-api/` as the only local runtime for `POST /v1/reference-analysis`. Add small root/app scripts and docs so local dev loads root `.env.local` server secrets into the Go process only, while Expo receives only `EXPO_PUBLIC_PARROTKIT_API_URL=http://<Mac-LAN-IP>:8787`.

**Tech Stack:** npm scripts, POSIX shell for macOS local dev, Go service in `services/reference-api`, Expo environment variables.

---

## 배경

- Issue #19 is closed, but the local dev flow can still be mis-launched with Expo pointing at `http://<Mac-LAN-IP>:3000`.
- The Go reference API already serves `GET /healthz` and `POST /v1/reference-analysis` on default port `8787`.
- Root `.env.local` contains provider secrets and must only be loaded by the server-side Go process.

## 목표

- Start the Go reference API from the repo root with root `.env.local` loaded and `PARROTKIT_ALLOW_DEV_UNAUTH=true` scoped to local dev.
- Start Expo/mobile QA with `EXPO_PUBLIC_PARROTKIT_API_URL` pointing to the Go API port `8787`, not the Next port `3000`.
- Document the iPhone LAN launch path clearly without moving secrets into Expo env.

## 범위

- In scope: root/app npm scripts, env examples, Go service README, focused validation scripts/tests if the existing code layout supports them.
- Out of scope: provider adapter refactors, Next API revival, UI changes, production auth changes, GitHub issue updates, commits, pushes.

## 변경 파일

- Inspect before editing: `package.json`, `parrotkit-app/package.json`, `.env.local.example`, `parrotkit-app/.env.local.example`, `services/reference-api/README.md`, `services/reference-api/cmd/reference-api/main.go`, `services/reference-api/internal/config/config.go`, and Expo reference-generation env usage.
- Likely modify: `package.json`, `parrotkit-app/package.json`, `.env.local.example`, `parrotkit-app/.env.local.example`, `services/reference-api/README.md`.
- Create only if scripts are not already available: `scripts/dev-reference-api.sh`.

## 테스트

- `cd services/reference-api && go test ./...`
- Smoke-check modified npm scripts with help/dry-run style commands where possible, without printing `.env.local` values.
- Start `go run ./cmd/reference-api` through the local dev script, request `GET /healthz`, then stop it.
- `git diff --check`

## 롤백

- Remove any added script and revert npm script/env-example/README changes.
- No database, production env, or deploy changes are planned.

## 리스크

- LAN QA still requires the developer to substitute the current Mac LAN IP in the Expo command.
- If port `8787` is already occupied, the Go API must be stopped or run with an explicit alternate `PORT`, and the Expo URL must match.
- The smoke start must avoid logging raw `SUPERDATA_API_KEY` or `REPLICATE_API_TOKEN`.

## 실행 단계

- [x] Inspect the required package/env/Go/Expo files and latest relevant context.
- [x] Add the smallest script/docs changes that start Go with root `.env.local` and dev unauth enabled locally.
- [x] Add the smallest Expo/mobile script/docs changes that point LAN QA at `http://<Mac-LAN-IP>:8787`.
- [x] Add focused deterministic validation if an existing test/script pattern is available.
- [x] Run the required verification commands and record results.
- [x] Update this plan with completion notes and create a context record.

## 결과

- Added root `npm run dev:reference-api` via `scripts/dev-reference-api.cjs`.
  - Loads root `.env.local` without printing secret values.
  - Defaults `PORT=8787`.
  - Forces `PARROTKIT_ALLOW_DEV_UNAUTH=true` only for this local dev process.
- Added root `npm run dev:mobile:lan` and nested `npm run start:reference-api:lan`.
  - Sets `EXPO_PUBLIC_PARROTKIT_API_URL=http://<Mac-LAN-IP>:8787`.
  - Keeps provider secrets out of Expo env.
  - Refuses `EXPO_PUBLIC_PARROTKIT_API_URL` values using port `3000`.
- Updated env examples and docs with the two-terminal iPhone QA flow.
- Context record: `context/context_20260519_go_reference_api_dev_runtime.md`.

## 검증 결과

- PASS: `cd services/reference-api && go test ./...`
- PASS: `node --check scripts/dev-reference-api.cjs`
- PASS: `node --check parrotkit-app/scripts/start-expo-reference-lan.cjs`
- PASS: `npm run dev:reference-api -- --print-config`
- PASS: `PARROTKIT_LAN_IP=192.168.0.10 npm run dev:mobile:lan -- --print-config`
- PASS: `EXPO_PUBLIC_PARROTKIT_API_URL=http://192.168.0.10:3000 node parrotkit-app/scripts/start-expo-reference-lan.cjs --print-config` failed as expected with a `:3000` refusal.
- PASS: `npm run dev:reference-api` started the Go service; `curl -fsS http://localhost:8787/healthz` returned `{"ok":true}`; the process was stopped afterward.
