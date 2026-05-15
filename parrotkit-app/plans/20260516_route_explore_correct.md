# route_explore_correct

## 배경

Issue 6 restores the five-slot bottom navigation. AC 5 specifically requires the Explore tab to open Explore and Home to return to the canonical Home route from Explore.

## 목표

- Explore bottom tab maps to `/explore`.
- `/explore` renders `ExploreScreen`.
- Home bottom tab maps to `/`.
- `/` renders `HomeScreen`.

## 범위

- Root tab route contract tests only, unless implementation inspection shows a broken route.
- No QA screenshots or local artifacts in commits.

## 변경 파일

- `src/core/navigation/root-tab-config.test.ts`
- `plans/20260516_route_explore_correct.md`
- `context/context_20260516_route_explore_correct.md`

## 테스트

- `npx tsc -p tsconfig.root-tabs-check.json`
- Focused root tab contract execution if needed.

## 롤백

- Remove the AC 5 contract assertions and this plan/context note.

## 리스크

- Shared worktree contains concurrent sibling-agent edits; avoid unrelated navigation rewrites.

## 결과

- `root-tab-config.test.ts` now explicitly guards Explore/Home route separation.
- Explore bottom tab href remains `/explore`.
- Home bottom tab href remains `/`.
- `/explore` renders `ExploreScreen`.
- `/` renders `HomeScreen`.
- 연결 context: `context/context_20260516_route_explore_correct.md`

## 검증

- `npx tsc -p tsconfig.root-tabs-check.json` 통과.
- `npx tsc -p tsconfig.json --noEmit` 통과.
- Focused Node route contract check 통과.
- DESIGN.md forbidden user-facing copy check 통과; only internal identifier false positives were seen in broader scans.
