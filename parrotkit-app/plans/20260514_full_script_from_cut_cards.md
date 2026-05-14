# 2026-05-14 Full Script From Cut Cards

## 배경

Sub-AC 15.1.1은 레시피의 카드 기반 컷 카드들을 재생/보드 순서대로 정렬한 뒤 각 카드의 script text를 이어붙인 연속 전체 스크립트 문자열이 필요하다.

## 목표

- 컷 카드의 `order` 기준으로 전체 스크립트를 만든다.
- 각 컷의 v1 script text는 `lineToSay`를 우선 사용하고 기존 `speakingLine`은 fallback으로 유지한다.
- 빈 컷 문장은 전체 스크립트에서 제외한다.

## 범위

- `shoot-board-model`에 순수 helper 추가
- 관련 smoke test 추가
- 필요 시 promp터 화면에서 전체 스크립트 문자열을 사용할 수 있게 연결

## 변경 파일

- `src/features/recipes/lib/shoot-board-model.ts`
- `src/features/recipes/lib/shoot-board-model.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_full_script_from_cut_cards.md`

## 테스트

- `npm exec --offline -- tsc --noEmit`

## 롤백

- helper export와 호출부, test/context 변경을 되돌린다.

## 리스크

- 기존 prompter가 scene 기반 normalized recipe copy와 board 기반 cut card copy를 함께 사용하므로, fallback 순서를 명확히 유지해야 한다.

## 결과

- `getShootBoardFullScript` helper를 추가해 컷 카드를 `order` 기준으로 정렬하고 `lineToSay` 우선, `speakingLine` fallback으로 전체 스크립트를 생성했다.
- prompter camera screen은 저장된 editor board가 있으면 해당 board의 전체 컷 카드 스크립트를 우선 표시한다.
- 연결 context: `context/context_20260514_full_script_from_cut_cards.md`
