# 배경

ParrotKit v1 컷보드는 접힌 컷 카드에서도 촬영 레시피의 핵심 상태를 바로 확인해야 한다. Sub-AC 11.3은 접힌 컷 카드 미디어 영역에 Reference와 My Take 슬롯을 보여줘야 한다.

# 목표

- 접힌 컷 카드에서 Reference 슬롯과 My Take 슬롯을 함께 표시한다.
- Reference는 기존 레퍼런스 썸네일을 사용하고, My Take는 저장/최종/재촬영/비어 있음 상태를 즉시 드러낸다.
- 확장 상태의 기존 미디어 슬롯, 촬영, 테이크 동작은 유지한다.

# 범위

- 접힌 카드 미디어 슬롯 상태 helper 및 smoke test 추가
- `ShootBoardSceneCard` 접힌 상태 렌더링 변경
- TypeScript 검증
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-media-slots.ts`
- 예정: `src/features/recipes/lib/cut-card-media-slots.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `plans/20260514_collapsed_cut_card_media_slots.md`
- 예정: `context/context_20260514_collapsed_cut_card_media_slots.md`

# 테스트

- Red: `npm exec --offline -- tsc --noEmit`로 helper 미구현 실패 확인
- Green: `npm exec --offline -- tsc --noEmit`

# 롤백

- 추가 helper/test/context 파일을 제거하고 `ShootBoardSceneCard`의 접힌 상태를 기존 텍스트 미리보기만 표시하도록 되돌린다.

# 리스크

- 접힌 카드 높이가 증가할 수 있다. 미디어 슬롯은 작은 고정 크기로 유지하고 기존 본문 미리보기 아래에 배치한다.
- 현재 프로젝트에는 별도 test runner가 없어 실행 검증은 TypeScript 컴파일 중심이다.

# 결과

- `getCutCardMediaSlots` helper를 추가해 Reference/My Take 슬롯 라벨, 썸네일, saved/final/needs-reshoot/empty 상태를 컷 데이터에서 계산하도록 했다.
- `ShootBoardSceneCard` 접힌 상태에서 본문 미리보기 아래 Reference와 My Take 슬롯을 렌더링하도록 연결했다.
- 확장 상태의 기존 미디어 슬롯도 같은 helper를 사용하게 정리해 상태 계산을 중복하지 않도록 했다.
- 연결 context: `context/context_20260514_collapsed_cut_card_media_slots.md`

# 검증 결과

- Red: `npm exec --offline -- tsc --noEmit` 실패 확인
  - 원인: `src/features/recipes/lib/cut-card-media-slots` 모듈 없음
- Green: `npm exec --offline -- tsc --noEmit` 통과
