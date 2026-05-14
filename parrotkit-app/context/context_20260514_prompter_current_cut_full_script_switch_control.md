# 2026-05-14 Prompter Current Cut / Full Script Switch Control

## 작업

Sub-AC 16.2 범위로 프롬프터 UI의 모드 전환 컨트롤을 현재 컷 모드와 전체 스크립트 모드가 명확히 드러나도록 정리했다.

## 변경

- `src/features/recipes/lib/prompter-display.ts`
  - `PrompterDisplayModeOption.label`을 `Current cut` / `Full script`로 변경
  - 기존 mode 값(`card`, `full-script`)과 full-script disabled fallback 유지
- `src/features/recipes/lib/prompter-display.test.ts`
  - switch option 순서와 사용자 노출 label을 함께 검증
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - accessibility label이 option label을 그대로 사용하도록 정리

## 검증

- Red check: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 기존 label로 실패
- Green check: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- Focused TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과

## 연결된 plan

- `plans/20260514_prompter_current_cut_full_script_switch_control.md`

## Retry 2 확인

- 현재 공유 워크스페이스 상태에서 프롬프터 UI가 `Current cut` / `Full script` 전환 컨트롤을 persistent dock에 표시하는 것을 재확인했다.
- `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과
- `npm exec --offline -- tsc --noEmit` 통과
