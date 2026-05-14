# 배경

ParrotKit v1 레시피 제작 흐름은 컷 카드를 편집 단위로 사용한다. 이전 작업에서 모델에는 `hook`, `lineToSay`, `shotAction`, `note` 필드가 추가되었지만, 확장된 컷 카드 UI는 아직 네 필드를 모두 직접 편집하는 형태가 아니다.

# 목표

- 컷 카드 편집 UI가 한 컷을 카드 섹션으로 보여주고 네 필수 필드를 모두 노출한다.
- 필수 필드: Hook, Line to Say, Shot/Action, Note.
- 기존 레거시 필드와 동기화되는 `ShootBoardCutTextPatch` 경로를 유지한다.

# 범위

- 컷 카드 editor field 정의 helper 추가
- `ShootBoardSceneCard` 확장 영역의 편집 필드 구성 업데이트
- 관련 TypeScript smoke test 추가
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/cut-card-editor-fields.ts`
- 예정: `src/features/recipes/lib/cut-card-editor-fields.test.ts`
- 예정: `src/features/recipes/components/shoot-board-scene-card.tsx`
- 예정: `context/context_20260514_cut_card_editor_fields.md`

# 테스트

- `npm exec --offline -- tsc --noEmit`
- 가능한 경우 추가한 smoke test의 타입/실행 가능성 확인

# 롤백

- 추가 helper/test와 `ShootBoardSceneCard`의 필드 구성 변경을 되돌리면 기존 2필드 편집 UI로 복귀한다.

# 리스크

- 현재 별도 test runner가 없으므로 검증은 TypeScript 컴파일과 smoke test 파일 중심으로 제한될 수 있다.
- 체크리스트는 v1 기본 컷 카드 화면에서 제외되는 방향이므로, 기존 체크리스트 UI를 제거하지 않더라도 기본 편집 필드보다 덜 우선되도록 정리해야 한다.

# 결과

- 완료: 컷 카드 editor field 정의 helper를 추가하고 네 필드 순서를 `Hook`, `Line to Say`, `Shot/Action`, `Note`로 고정했다.
- 완료: `ShootBoardSceneCard` 확장 영역에서 네 필드를 카드 섹션 형태로 렌더링하고 `ShootBoardCutTextPatch`로 새 필드를 직접 업데이트하도록 연결했다.
- 완료: smoke test로 필드 순서, multiline 입력, patch 매핑, cut 값 읽기를 검증했다.
- 검증: `npm exec --offline -- tsc --noEmit` 통과.
- 연결 context: `context/context_20260514_cut_card_editor_fields.md`
