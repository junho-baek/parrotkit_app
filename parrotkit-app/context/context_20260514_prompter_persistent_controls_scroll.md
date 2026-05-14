# 2026-05-14 Prompter Persistent Controls While Scrolling

## 작업

Sub-AC 15.3.2 범위로 Full script 본문을 스크롤하는 동안에도 핵심 프롬프터 컨트롤이 계속 접근 가능한 구조를 명시하고 UI를 정리했다.

## 변경

- `src/features/recipes/lib/prompter-display.ts`
  - `getPrompterControlsLayoutModel` helper를 추가해 prompter control groups가 `persistent-dock`에 있고 스크롤 영역은 `script-body-only`라는 계약을 표현했다.
- `src/features/recipes/lib/prompter-display.test.ts`
  - Full script mode에서 Card/Full switch와 manual scroll controls가 persistent dock에 포함되는지 검증했다.
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - Card/Full switch, text size, manual scroll buttons를 script `ScrollView` 밖의 `prompterPersistentControlDock`으로 분리했다.
  - Full script copy는 기존처럼 bounded `ScrollView` 안에서만 스크롤되며, 컨트롤 dock은 본문 스크롤과 독립적으로 유지된다.

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 `getPrompterControlsLayoutModel` missing export로 실패.
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과.
- Scoped TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과.
- Full TypeScript: `npm exec --offline -- tsc --noEmit` 실행을 시도했으나 장시간 출력 없이 반환되지 않아 검증 결과로 사용하지 않았다.

## 연결된 plan

- `plans/20260514_prompter_persistent_controls_scroll.md`
