# 2026-05-14 Prompter Full Script Readability Scroll

## 작업

Sub-AC 15.3.1 범위로 Full script view가 긴 스크립트를 읽기 좋은 문단 단위와 세로 스크롤 영역으로 렌더링되도록 보강했다.

## 변경

- `src/features/recipes/lib/prompter-display.ts`
  - full-script mode에서 전체 스크립트를 `\n\n` 기준 문단으로 나누고 빈 문단을 제거하도록 변경했다.
- `src/features/recipes/lib/prompter-display.test.ts`
  - full-script display model이 긴 스크립트를 문단 배열로 반환하는지 검증했다.
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - Full script ScrollView에 더 큰 maxHeight와 content bottom padding을 적용했다.
  - Full script 문단 사이 간격을 Card mode보다 넓게 설정했다.
  - Card mode의 secondary line dimming은 유지하고 Full script mode 문단은 모두 primary typography로 렌더링되도록 했다.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 full-script 문단 분리 기대값으로 실패.
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과.
- Scoped TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과.
- Full TypeScript: `npm exec --offline -- tsc --noEmit` 통과.

## 연결된 plan

- `plans/20260514_prompter_full_script_readability_scroll.md`
