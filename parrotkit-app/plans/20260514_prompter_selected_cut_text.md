# 2026-05-14 Prompter Selected Cut Text

## 배경

Sub-AC 16.1.1은 프롬프터가 선택된 레시피/컷 카드 데이터에서 현재 컷 문구와 전체 레시피 스크립트를 파생해야 한다.

## 목표

- 프롬프터 카드 모드의 현재 컷 문구를 URL query가 아니라 저장된 컷 카드 데이터에서 우선 파생한다.
- 저장된 컷 카드가 없을 때는 기존 활성 scene 기반 fallback을 유지한다.
- 전체 스크립트 파생 경로는 기존 컷 카드 기반 동작을 유지한다.

## 범위

- prompter display 순수 helper/test 보강
- prompter camera screen 연결부 수정
- 작업 결과 context 기록

## 변경 파일

- `src/features/recipes/lib/prompter-display.ts`
- `src/features/recipes/lib/prompter-display.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_prompter_selected_cut_text.md`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`
- 가능한 경우 focused TypeScript 또는 전체 TypeScript 검증

## 롤백

- 추가 helper/test와 prompter screen 호출부 변경을 되돌려 기존 query-param 기반 표시로 복구한다.

## 리스크

- `recipe-prompter-camera-screen.tsx`는 manual scroll, text size, saved-take 작업이 겹친 고충돌 파일이므로 표시 데이터 연결부만 최소 수정한다.

## 결과

- `getActiveRecipePrompterCutText`를 추가해 프롬프터 카드 모드가 선택된 컷 카드의 편집된 `lineToSay`/`shotAction`을 우선 표시하도록 했다.
- `recipe-prompter-camera-screen.tsx`에서 URL query의 `lineToSay`/`shootingGuideline` 표시 의존을 제거하고 저장된 board 또는 활성 scene 데이터에서 현재 컷 문구를 파생하도록 연결했다.
- 연결 context: `context/context_20260514_prompter_selected_cut_text.md`

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 누락된 helper export로 실패
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- Focused TS: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과
