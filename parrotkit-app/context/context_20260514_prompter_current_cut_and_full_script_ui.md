# 2026-05-14 Prompter Current Cut and Full Script UI

## 작업

Sub-AC 16.1.2 범위로 프롬프터 UI가 선택된 현재 컷 카드 문구와 전체 레시피 스크립트 문구를 같은 표시 경로에서 다루도록 정리했다.

## 변경

- `src/features/recipes/lib/prompter-display.ts`
  - `PrompterUiTextRenderModel` 타입 추가
  - `getPrompterUiTextRenderModel` 추가
  - 카드 모드용 `cardDisplay`, 전체 스크립트용 `fullScriptDisplay`, 현재 선택된 `activeDisplay`, Card/Full 옵션을 함께 반환
- `src/features/recipes/lib/prompter-display.test.ts`
  - 통합 UI text render model이 현재 컷 카드 문구와 전체 레시피 스크립트를 동시에 보존하는지 검증
  - full-script 모드 요청 시 실제 스크립트가 있으면 `activeDisplay`가 full-script display를 선택하는지 검증
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - `CameraCoachOverlay`가 `getPrompterUiTextRenderModel`을 사용하도록 연결
  - 기존 manual scroll, text-size, saved take 연결은 유지

## 검증

- Red check: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 누락된 `getPrompterUiTextRenderModel` export로 실패
- Green check: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- Focused TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과
- Full TypeScript: `npm exec --offline -- tsc --noEmit` 통과

## 연결된 plan

- `plans/20260514_prompter_current_cut_and_full_script_ui.md`
