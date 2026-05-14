# Context 2026-05-14 Collapsed Cut Card Body Preview

## 작업

Sub-AC 11.2 범위로 접힌 컷 카드 본문에서 Hook, Line to Say, Shot/Action을 바로 확인할 수 있도록 미리보기 row를 추가했다.

## 변경

- `src/features/recipes/lib/cut-card-body-preview.ts`
  - `getCutCardBodyPreviewRows` helper 추가
  - Hook, Line to Say, Shot/Action 순서로 preview row 반환
  - Hook/Shot은 1줄, Line to Say는 2줄 제한으로 반환
  - 비어 있는 v1 필드는 기존 `instruction`, `speakingLine`, `shootingGuideline`으로 fallback
- `src/features/recipes/lib/cut-card-body-preview.test.ts`
  - 영어/한국어 라벨, 필드 우선순위, fallback, 1-2줄 제한 smoke test 추가
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - 접힌 상태에서 Hook, Line to Say, Shot/Action preview row 렌더링
  - 확장 상태에서는 기존 instruction 및 편집 영역 동작 유지

## 검증

- Red: `npm exec --offline -- tsc --noEmit`가 `cut-card-body-preview` 모듈 없음으로 실패하는 것을 확인.
- Green: `npm exec --offline -- tsc --noEmit` 통과.
- 별도 test runner가 없는 프로젝트라 `.test.ts` 직접 실행은 생략했다.

## 연결된 plan

- `plans/20260514_collapsed_cut_card_body_preview.md`
