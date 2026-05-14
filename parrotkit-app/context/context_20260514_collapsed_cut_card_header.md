# Context 2026-05-14 Collapsed Cut Card Header

## 작업

Sub-AC 11.1 범위로 접힌 컷 카드 헤더에서 컷 번호와 역할이 명확히 분리되어 보이도록 정리했다.

## 변경

- `src/features/recipes/lib/cut-card-header.ts`
  - `getCutCardHeaderParts` helper 추가
  - `Cut #n`/`컷 #n` 번호 라벨과 역할 라벨을 분리해 반환
  - 빈 직접 구성 컷의 역할 fallback을 `Custom`/`직접 구성`으로 제공
- `src/features/recipes/lib/cut-card-header.test.ts`
  - 영어/한국어 컷 번호 라벨, 역할 라벨, 빈 커스텀 컷 fallback smoke test 추가
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - 기존 preformatted title 출력 대신 번호 배지와 역할 텍스트를 별도 렌더링
  - 기존 duration, collapse/expand, completion, edit/take/shoot 동작은 유지

## 검증

- Red check: `npm exec --offline -- tsc --noEmit`가 `cut-card-header` 모듈 없음으로 실패하는 것을 확인.
- Green check: `npm exec --offline -- tsc --noEmit` 통과.
- 이 worktree에는 `tsx`/`ts-node` 실행기가 없어 개별 `.test.ts` 직접 실행은 생략했다.

## 연결된 plan

- `plans/20260514_collapsed_cut_card_header.md`
