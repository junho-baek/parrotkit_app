# 2026-05-14 Prompter Current Cut and Full Script UI

## 배경

Sub-AC 16.1.2는 프롬프터 UI가 선택된 현재 컷에서 파생한 카드 문구와 전체 레시피 스크립트 문구를 모두 표시 경로에 올려야 한다.

## 목표

- 선택된 컷 카드의 `lineToSay`/`shotAction`이 프롬프터 카드 모드 본문과 촬영 가이드로 파생되는지 확인한다.
- 전체 레시피 스크립트가 컷 카드 순서 기반으로 프롬프터 전체 스크립트 모드에 표시되는지 확인한다.
- 기존 manual scroll, text-size, saved take 흐름을 건드리지 않는다.

## 범위

- 프롬프터 표시 모델 및 화면 연결 확인
- focused prompter display test 보강
- 작업 결과 context 기록

## 변경 파일

- `src/features/recipes/lib/prompter-display.test.ts`
- `context/context_20260514_prompter_current_cut_and_full_script_ui.md`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`
- `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json`

## 롤백

- 추가한 테스트와 context 문서를 제거한다.

## 리스크

- `recipe-prompter-camera-screen.tsx`는 여러 sibling AC가 공유 수정한 파일이므로, 필요한 경우가 아니면 UI 파일 직접 수정은 피한다.

## 결과

- `getPrompterUiTextRenderModel`을 추가해 프롬프터 UI 데이터 경로가 카드 모드용 현재 컷 문구와 전체 스크립트 모드용 레시피 스크립트를 동시에 보존하도록 했다.
- `CameraCoachOverlay`가 개별 display helper 대신 이 통합 render model의 `activeDisplay`와 `modeOptions`를 사용하도록 연결했다.
- 연결 context: `context/context_20260514_prompter_current_cut_and_full_script_ui.md`

## 검증

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 누락된 `getPrompterUiTextRenderModel` export로 실패
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과
- Focused TS: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과
- Full TS: `npm exec --offline -- tsc --noEmit` 통과
