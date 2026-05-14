# Saved Take Reload Validation

## 작업 시간

- 2026-05-14

## 범위

- Sub-AC 17.2.4: focused validation coverage for saving a take and reloading its recipe/card metadata.
- Local/mock-only saved recipe take state.

## 변경 요약

- Added `src/features/recipes/lib/saved-take-reload.test.ts`.
- Added `tsconfig.saved-take-reload-check.json`.
- The validation covers:
  - saving a prompter take from an explicit active cut card
  - reloading saved takes by recipe id
  - reloading saved takes by recipe id and scene id
  - preserving recording URI, recipe title/id, scene title/id, card id, hook, line to say, shot action, and note
  - keeping saved card metadata stable after later board edits

## 검증

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-reload-check.json`
  - Passed.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - Passed.

## 리스크 / 후속

- The project has no package-level test script, so this follows the existing focused TypeScript validation pattern.
- This does not add device persistence; v1 saved-take state remains local/mock as required.
