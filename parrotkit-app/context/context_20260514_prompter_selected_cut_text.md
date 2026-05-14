# 2026-05-14 Prompter Selected Cut Text

## 작업

Sub-AC 16.1.1 범위로 프롬프터의 카드 모드 현재 컷 문구가 선택된 레시피/컷 카드 데이터에서 파생되도록 정리했다.

## 변경

- `src/features/recipes/lib/prompter-display.ts`
  - `getActiveRecipePrompterCutText` 추가
  - `selectedCutId`로 저장된 컷 카드를 먼저 찾고, 없으면 활성 `sceneId`에 연결된 컷 카드로 fallback
  - 현재 컷 문구는 `lineToSay` 우선, `speakingLine` fallback
  - 촬영 가이드는 `shotAction` 우선, `shootingGuideline` fallback
  - 컷 카드가 없으면 활성 scene 기반 fallback 문구 유지
- `src/features/recipes/lib/prompter-display.test.ts`
  - stale query fallback보다 선택된 저장 컷 카드 문구를 우선하는지 검증
  - cut id가 없을 때 활성 scene의 컷 카드 문구를 사용하는지 검증
  - 컷 카드가 없을 때 scene fallback을 유지하는지 검증
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - 카드 모드의 `lineToSay`/`shootingGuideline` 표시 source를 query param에서 `getActiveRecipePrompterCutText`로 교체
  - 기존 full-script, manual scroll, text-size, take-save 연결은 유지

## 검증

- Red check: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 누락된 `getActiveRecipePrompterCutText` export로 실패
- Green check: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- Focused TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과

## 연결된 plan

- `plans/20260514_prompter_selected_cut_text.md`
