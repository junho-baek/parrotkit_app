# Context 2026-05-14 Collapsed Cut Card Action Status

## 작업

Sub-AC 11.4 범위로 접힌 컷 카드의 action/status 영역에 촬영 CTA와 현재 take status를 추가했다.

## 변경

- `src/features/recipes/lib/cut-card-action-status.ts`
  - `getCutCardActionStatus` helper 추가
  - `none/saved/final/needs_reshoot` 상태를 empty/saved/final/needs-retake UI tone과 CTA/status/take count copy로 변환
  - 한국어/영어 label 지원
- `src/features/recipes/lib/cut-card-action-status.test.ts`
  - no take, saved take, final take, retake-needed 상태 계약을 smoke test로 고정
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - 접힌 카드에서 Reference/My Take 미디어 슬롯 옆에 status pill, take count, 촬영 CTA 렌더링
  - CTA는 기존 `onShoot` 경로를 사용해 해당 컷 prompter 촬영 흐름으로 이동

## 검증

- Red: `npm exec --offline -- tsc --noEmit`가 `cut-card-action-status` 모듈 없음으로 실패하는 것을 확인.
- Green: `npm exec --offline -- tsc --noEmit --pretty false` 통과.
- 별도 test runner가 없는 프로젝트라 `.test.ts` 직접 실행은 생략했다.

## 연결된 plan

- `plans/20260514_collapsed_cut_card_action_status.md`
