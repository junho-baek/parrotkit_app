# Context 2026-05-14 Cut Card Editor Fields

## 작업

ParrotKit v1 컷 카드 편집 UI가 한 컷의 네 필수 편집 필드인 `Hook`, `Line to Say`, `Shot/Action`, `Note`를 모두 카드 섹션으로 표시하도록 정리했다.

## 변경

- `src/features/recipes/lib/cut-card-editor-fields.ts`
  - 컷 카드 editor field 정의 helper 추가
  - 필드 순서를 `hook`, `lineToSay`, `shotAction`, `note`로 고정
  - 각 필드가 `ShootBoardCutTextPatch`의 새 필드를 직접 업데이트하도록 `createPatch` 제공
  - 기존 컷에서 새 필드 값을 읽되 필요한 경우 레거시 필드로 fallback
- `src/features/recipes/lib/cut-card-editor-fields.test.ts`
  - 필드 순서, multiline 입력, patch 매핑, 값 읽기 smoke test 추가
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - 확장된 컷 카드 본문에 네 필수 필드를 모두 렌더링
  - 편집 상태에서 각 필드를 multiline `TextInput`으로 수정 가능
  - 기존 2필드 편집 구성보다 v1 컷 카드 필드를 우선 노출

## 검증

- `npm exec --offline -- tsc --noEmit` 통과.
- 별도 test runner는 package script에 없어 실행하지 않았다.
- 로컬 Expo runtime QA는 수행하지 않았다.

## 연결된 plan

- `plans/20260514_cut_card_editor_fields.md`
