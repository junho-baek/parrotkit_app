# Context 2026-05-14 Prompter Text Refresh State Preservation

## 작업

Sub-AC 16.3.3: selected mode/card content 변경 시 프롬프터 표시 문구가 즉시 갱신되고, playback/navigation 등 unrelated state를 reset하지 않도록 stale selected cut 우선순위를 정리했다.

## 변경

- `src/features/recipes/lib/prompter-display.ts`
  - `getActiveRecipePrompterCutText`에서 `selectedCutId`가 active `sceneId`와 다른 cut을 가리키면 active scene cut을 우선 사용하도록 변경
  - `sceneId`가 없거나 selected cut에 scene linkage가 없는 기존 경로는 selected cut 우선 fallback 유지
- `src/features/recipes/lib/prompter-display.test.ts`
  - stale `selectedCutId`가 남아 있어도 active scene의 cut card 문구와 촬영 동작으로 refresh되는 contract 추가
- `plans/20260514_prompter_text_refresh_state_preservation.md`
  - Sub-AC 16.3.3 계획과 결과 기록

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 stale selected cut 문구를 반환해 실패
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- Regression: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-mode-state.test.ts` 통과
- Focused TS: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json --pretty false` 통과
- Broad TS: `npm exec --offline -- tsc --noEmit --pretty false`는 sibling task의 `src/features/recipes/lib/cut-card-take-viewer-section.test.ts`가 `actionControls` 필드를 기대하는 기존 불일치로 실패했다.

## 참고

- `recipe-prompter-camera-screen.tsx`는 수정하지 않았다. 기존 mode/playback/scroll/text-size/navigation state 연결을 그대로 두고 표시 텍스트 선택 helper만 보강했다.
- 서버, 로그인, cloud sync, persistent storage는 추가하지 않았다.
