# Context 2026-05-14 Collapsed Cut Card Media Slots

## 작업

Sub-AC 11.3 범위로 접힌 컷 카드에서도 Reference와 My Take 슬롯을 바로 확인할 수 있도록 미디어 슬롯 영역을 추가했다.

## 변경

- `src/features/recipes/lib/cut-card-media-slots.ts`
  - `getCutCardMediaSlots` helper 추가
  - Reference 슬롯은 기존 reference thumbnail을 `saved` 상태로 노출
  - My Take 슬롯은 take 저장 여부와 `takeStatus`에 따라 `empty`, `saved`, `final`, `needs_reshoot` 상태로 노출
- `src/features/recipes/lib/cut-card-media-slots.test.ts`
  - 기존 smoke test가 helper 계약을 검증하도록 유지
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - 접힌 상태 본문 preview 아래 Reference/My Take 슬롯 렌더링 추가
  - 확장 상태 미디어 슬롯도 동일 helper를 사용하도록 정리

## 검증

- Red: `npm exec --offline -- tsc --noEmit`가 `cut-card-media-slots` 모듈 없음으로 실패하는 것을 확인.
- Green: `npm exec --offline -- tsc --noEmit` 통과.
- 별도 test runner가 없는 프로젝트라 `.test.ts` 직접 실행은 생략했다.

## 연결된 plan

- `plans/20260514_collapsed_cut_card_media_slots.md`
