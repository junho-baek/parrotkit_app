# 2026-05-14 Prompter Full Script Display

## 작업

Sub-AC 15.1.2 범위로 활성 레시피의 컷 카드에서 파생된 연속 전체 스크립트가 프롬프터 UI 본문에 표시되도록 정리했다.

## 변경

- `src/features/recipes/lib/prompter-display.ts`
  - `getPrompterDisplayModel` 추가
  - `fullScript`가 있으면 `FULL SCRIPT` 라벨과 trim된 연속 스크립트 1개를 반환
  - `fullScript`가 없으면 기존 scene/cut fallback lines를 trim/filter해 `LINE TO SAY`로 반환
- `src/features/recipes/lib/prompter-display.test.ts`
  - 전체 스크립트가 fallback line보다 우선 표시되는지 검증
  - 빈 전체 스크립트일 때 기존 컷 단위 문구로 fallback되는지 검증
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - 저장된 editor board에서 파생된 `fullScript`를 display model에 전달
  - 프롬프터 라벨을 `FULL SCRIPT` 또는 `LINE TO SAY`로 표시
  - manual scroll 및 text-size controls는 기존 배치를 유지

## 검증

- Red check: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 `Cannot find module './prompter-display'`로 실패하는 것을 확인
- Green check: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- Focused TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과 후 임시 tsconfig 삭제
- Full TypeScript: `npm exec --offline -- tsc --noEmit`는 unrelated sibling 파일 `src/features/recipes/lib/cut-card-media-slots.test.ts`가 없는 `@/features/recipes/lib/cut-card-media-slots` 모듈을 참조해 실패

## 연결된 plan

- `plans/20260514_prompter_full_script_display.md`

## 재시도 업데이트

Retry 1에서 저장된 editor board가 없는 직접 프롬프터 진입도 활성 레시피 기준 연속 전체 스크립트를 표시하도록 보완했다.

### 추가 변경

- `src/features/recipes/lib/prompter-display.ts`
  - `getActiveRecipePrompterFullScript` 추가
  - 저장된 cut-card board가 있으면 `order` 기준으로 `lineToSay`/`speakingLine`을 연속 본문으로 사용
  - board가 없으면 활성 recipe scene의 `recipe.keyLine`, `recipe.scriptLines[0]`, `prompterLines[0]` 순서로 fallback해 연속 본문 생성
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - 프롬프터 본문 source를 `getActiveRecipePrompterFullScript({ recipe, shootBoard })`로 교체

### 재검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 누락된 `getActiveRecipePrompterFullScript`로 실패
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- Scoped TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과
- Full TypeScript: `npm exec --offline -- tsc --noEmit` 통과
