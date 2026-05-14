# 2026-05-14 Prompter Persistent Controls While Scrolling

## 배경

Sub-AC 15.3.2는 Full script 내용이 스크롤되는 동안에도 핵심 프롬프터 컨트롤이 계속 접근 가능해야 한다.

## 목표

- Full script 본문만 스크롤되고 Card/Full switch, 텍스트 크기, 수동 스크롤 컨트롤은 고정 영역에 남도록 명시한다.
- 긴 전체 스크립트에서 컨트롤이 본문 스크롤 영역 안으로 들어가지 않도록 helper/test 계약을 추가한다.
- 기존 manual scroll, text size, take recording 흐름을 유지한다.

## 범위

- 프롬프터 display helper에 layout contract 추가
- 프롬프터 카메라 화면의 컨트롤 영역을 scroll body와 분리된 persistent dock으로 정리
- focused helper test 및 TypeScript 검증
- 작업 결과 context 기록

## 변경 파일

- `src/features/recipes/lib/prompter-display.ts`
- `src/features/recipes/lib/prompter-display.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `plans/20260514_prompter_persistent_controls_scroll.md`
- `context/context_20260514_prompter_persistent_controls_scroll.md`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`
- `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json`
- 가능한 경우 `npm exec --offline -- tsc --noEmit`

## 롤백

- 추가한 layout helper/test를 제거하고 프롬프터 화면의 control dock 스타일 변경을 기존 header controls 구조로 되돌린다.

## 리스크

- 프롬프터 상단에는 switch, text size, scroll controls가 모두 있어 작은 화면에서 줄바꿈/간격 충돌이 생길 수 있다.
- sibling AC 변경이 같은 prompter screen을 수정하고 있으므로 변경 범위를 control dock과 display helper로 제한한다.

## 결과

- `getPrompterControlsLayoutModel` helper로 Full script scroll 영역과 persistent control dock의 분리 계약을 추가했다.
- 프롬프터 화면에서 Card/Full switch, text size controls, manual scroll controls를 `ScrollView` 밖의 `prompterPersistentControlDock`으로 배치했다.
- Full script 본문은 bounded `ScrollView` 안에서만 스크롤되고 핵심 controls는 계속 접근 가능하다.
- 연결 context: `context/context_20260514_prompter_persistent_controls_scroll.md`

## 검증 결과

- Red: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`가 missing export로 실패.
- Green: `./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts` 통과.
- Scoped TypeScript: `npm exec --offline -- tsc --noEmit -p tsconfig.prompter-full-script-display-check.json` 통과.
- Full TypeScript: `npm exec --offline -- tsc --noEmit`은 장시간 반환되지 않아 중단 가능한 결과를 얻지 못했다.
