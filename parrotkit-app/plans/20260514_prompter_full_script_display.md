# 2026-05-14 Prompter Full Script Display

## 배경

Sub-AC 15.1.2는 활성 레시피의 컷 카드에서 파생된 연속 전체 스크립트가 프롬프터 UI에 표시되어야 한다.

## 목표

- 저장된 레시피 편집 보드가 있으면 컷 카드 기반 전체 스크립트를 프롬프터 본문에 표시한다.
- 전체 스크립트가 없을 때는 기존 활성 컷/씬 기반 프롬프터 문구로 안전하게 fallback한다.
- UI 문구가 현재 표시 중인 본문이 전체 스크립트임을 드러내도록 한다.

## 범위

- 프롬프터 화면의 본문 표시 모델 정리
- 전체 스크립트 우선 표시 동작의 focused test 추가
- 작업 결과 context 기록

## 변경 파일

- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `src/features/recipes/lib/prompter-display.ts`
- `src/features/recipes/lib/prompter-display.test.ts`
- `context/context_20260514_prompter_full_script_display.md`

## 테스트

- focused TypeScript 검증
- 가능한 경우 `npm exec --offline -- tsc --noEmit`

## 롤백

- 추가한 prompter display helper/test/context를 제거하고 prompter screen 호출부를 기존 scene 기반 표시로 되돌린다.

## 리스크

- prompter screen은 sibling 작업으로 manual scroll과 text size control이 함께 수정되어 있어 header/control 배치를 건드릴 때 충돌 가능성이 있다.

## 결과

- `getPrompterDisplayModel`을 추가해 전체 스크립트가 있으면 `FULL SCRIPT` 라벨과 연속 본문 1개를 반환하고, 없으면 기존 컷 단위 `LINE TO SAY` 문구로 fallback하도록 했다.
- `recipe-prompter-camera-screen.tsx`의 프롬프터 본문과 라벨을 display model로 연결해 활성 레시피의 저장된 컷 카드 전체 스크립트가 UI에 표시되도록 했다.
- 연결 context: `context/context_20260514_prompter_full_script_display.md`

## 재시도 결과

- 저장된 editor board가 아직 없는 활성 레시피도 프롬프터에서 연속 전체 스크립트를 표시하도록 `getActiveRecipePrompterFullScript`를 추가했다.
- 저장된 컷 카드 보드가 있으면 편집된 `lineToSay`를 우선하고, 없으면 활성 레시피의 scene script/prompter line에서 연속 본문을 파생한다.
- 검증:
  - Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 누락된 helper로 실패
  - Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
  - Scoped TS: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과
  - Full TS: `npm exec --offline -- tsc --noEmit` 통과
