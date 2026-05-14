# 2026-05-14 Prompter Text Refresh State Preservation

## 배경

Sub-AC 16.3.3 requires the prompter copy to refresh immediately when the selected mode or card content changes, without resetting unrelated playback or navigation state. Existing selected cut routing can leave a stale `cutId` preferred over the active scene cut after in-prompter navigation.

## 목표

- Ensure current-cut card text follows the active card/scene when a stale selected cut id no longer matches the active scene.
- Keep full-script and mode state behavior unchanged.
- Preserve unrelated playback, scroll, text-size, and navigation state contracts.

## 범위

- Focused prompter display helper behavior.
- Minimal prompter screen integration only if the helper contract requires it.
- Local/mock v1 behavior only.

## 변경 파일

- `src/features/recipes/lib/prompter-display.ts`
- `src/features/recipes/lib/prompter-display.test.ts`
- `plans/20260514_prompter_text_refresh_state_preservation.md`
- `context/context_20260514_prompter_text_refresh_state_preservation.md`

## 테스트

- Red/green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`
- Focused TS: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json --pretty false`
- Broader TS if feasible without sibling-task failures.

## 롤백

- Remove the stale selected-cut guard and related test.
- Restore previous selected-cut-first resolution behavior.

## 리스크

- `recipe-prompter-camera-screen.tsx` is a high-overlap file. Prefer helper-only changes unless screen wiring is strictly necessary.
- Some sibling AC changes are already dirty in this worktree, so commit/push should be coordinated at aggregate level.

## 결과

- `getActiveRecipePrompterCutText`가 active `sceneId`와 맞지 않는 stale `selectedCutId`를 우선하지 않도록 보강했다.
- 프롬프터에서 cut/scene navigation 후 카드 모드 문구가 active scene cut으로 즉시 갱신되는 contract를 추가했다.
- screen-level playback, scroll, text size, route/navigation state wiring은 건드리지 않아 unrelated state reset을 유발하지 않도록 범위를 제한했다.
- 연결 context: `context/context_20260514_prompter_text_refresh_state_preservation.md`
- 검증: focused display/mode-state sucrase-node checks 및 `tsconfig.prompter-full-script-display-check.json` TypeScript check 통과. Broad `tsc --noEmit`는 sibling cut-card take viewer test의 `actionControls` 불일치로 실패.
