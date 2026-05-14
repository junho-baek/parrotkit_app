# 2026-05-14 Prompter Current Cut / Full Script Switch Control

## 배경

Sub-AC 16.2는 프롬프터 UI가 현재 컷 모드와 전체 스크립트 모드를 명확한 컨트롤로 전환할 수 있어야 한다.

## 목표

- 프롬프터 모드 전환 컨트롤의 사용자 노출 문구를 현재 컷 / 전체 스크립트로 명확히 한다.
- 기존 full-script fallback, manual scroll, text-size controls, saved-take 흐름을 유지한다.

## 범위

- 프롬프터 표시 모드 option label 정리
- 접근성 label 문구 정리
- focused test 및 TypeScript 검증
- 작업 결과 context 기록

## 변경 파일

- `src/features/recipes/lib/prompter-display.ts`
- `src/features/recipes/lib/prompter-display.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_prompter_current_cut_full_script_switch_control.md`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`
- `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json`

## 롤백

- 모드 option label과 접근성 문구를 이전 Card / Full 표현으로 되돌린다.

## 리스크

- 프롬프터 헤더는 이미 scroll/text-size controls와 공유되므로 긴 label이 좁은 화면에서 부담이 될 수 있다. 필요한 경우 button minWidth와 padding을 함께 조정한다.

## 결과

- 프롬프터 mode option label을 `Current cut` / `Full script`로 변경해 컨트롤 목적을 명확히 했다.
- 접근성 label도 선택 option 문구를 그대로 반영하도록 정리했다.
- 기존 full-script 비활성화 fallback, manual scroll, text-size controls는 유지했다.
- 연결 context: `context/context_20260514_prompter_current_cut_full_script_switch_control.md`

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 기존 `Card` / `Full` label 때문에 실패
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- Focused TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과

## Retry 2 확인

- 기존 구현이 `Current cut` / `Full script` segmented control을 프롬프터 persistent dock에 노출하고 있음을 재확인했다.
- `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 재실행 통과
- `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 재실행 통과
- `npm exec --offline -- tsc --noEmit` 재실행 통과
