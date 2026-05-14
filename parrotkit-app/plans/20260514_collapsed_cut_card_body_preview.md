# 배경

ParrotKit v1 컷보드는 접힌 카드 상태에서도 촬영에 필요한 핵심 정보가 바로 보여야 한다. Sub-AC 11.2는 접힌 컷 카드 본문에 Hook, Line to Say, Shot/Action 미리보기를 제공해야 한다.

# 목표

- 접힌 컷 카드 본문에서 Hook, Line to Say, Shot/Action을 각각 표시한다.
- 각 미리보기는 긴 텍스트가 카드 레이아웃을 밀지 않도록 1줄 또는 1-2줄로 제한한다.
- 확장 상태의 기존 편집 필드와 촬영/테이크 동작은 유지한다.

# 범위

- 컷 카드 미리보기 helper 및 smoke test 추가
- `ShootBoardSceneCard` 접힌 상태 본문 렌더링 변경
- TypeScript 검증
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-body-preview.ts`
- 예정: `src/features/recipes/lib/cut-card-body-preview.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `context/context_20260514_collapsed_cut_card_body_preview.md`

# 테스트

- Red: `npm exec --offline -- tsc --noEmit`로 helper 미구현 실패 확인
- Green: `npm exec --offline -- tsc --noEmit`

# 롤백

- 추가 helper/test/context 파일을 제거하고 `ShootBoardSceneCard`의 접힌 본문을 기존 instruction 텍스트 출력으로 되돌린다.

# 리스크

- 현재 프로젝트에는 별도 test runner가 없어 실행 검증은 TypeScript 컴파일 중심이다.
- 카드 정보량이 늘어나므로 접힌 상태의 높이가 증가한다. 레이아웃은 각 row의 줄 수 제한으로 통제한다.

# 결과

- 완료: `getCutCardBodyPreviewRows` helper를 추가해 Hook, Line to Say, Shot/Action preview row와 1-2줄 제한 정보를 제공했다.
- 완료: 접힌 `ShootBoardSceneCard` 본문이 세 preview row를 표시하고, 확장 상태의 기존 instruction/편집 영역은 유지하도록 분기했다.
- 완료: 영어/한국어 라벨, 필드 우선순위, legacy fallback, 줄 수 제한 smoke test를 추가했다.
- 검증: Red `npm exec --offline -- tsc --noEmit`에서 신규 helper 미구현 오류 확인.
- 검증: Green `npm exec --offline -- tsc --noEmit` 통과.
- 연결 context: `context/context_20260514_collapsed_cut_card_body_preview.md`
