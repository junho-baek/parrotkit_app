# 배경

ParrotKit v1 컷 카드는 확장 상태에서 Hook, Line to Say, Shot/Action, Note를 보여줘야 한다. 기존 확장 UI는 네 필드를 렌더링하지만 값이 비어 있을 때 읽기 상태에서 빈 공간으로 보일 수 있다.

# 목표

- 확장 컷 카드 상세가 Hook, Line to Say, Shot/Action, Note를 모두 렌더링한다.
- 읽기 상태에서 값이 비어 있으면 필드별 빈 상태 문구를 보여준다.
- 편집 상태에서는 기존 placeholder와 실제 값 업데이트 동작을 유지한다.

# 범위

- 컷 카드 editor field 정의에 read-only 빈 상태 문구 추가
- 확장 컷 카드 상세 read-only 렌더링에서 빈 상태 표시
- 관련 smoke test 추가/갱신
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-editor-fields.ts`
- 예정: `src/features/recipes/lib/cut-card-editor-fields.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `context/context_20260514_expanded_cut_card_detail_empty_states.md`

# 테스트

- Red: 관련 smoke test가 `emptyText` 계약 부재로 실패하는지 확인
- Green: `npm exec --offline -- tsc --noEmit`
- 가능하면 `node`/`tsx` 직접 실행 경로 확인

# 롤백

- `emptyText` 필드와 `DetailInput` empty-state 렌더링 변경을 되돌리면 기존 확장 상세 표시로 복귀한다.

# 리스크

- 현재 공유 worktree에 sibling AC 변경이 많으므로 커밋/푸시는 aggregate 조율 전에는 수행하지 않는다.
- 프로젝트에 test script가 없어 검증은 TypeScript 컴파일 중심으로 제한될 수 있다.
