# 배경

Sub-AC 9.2.3은 컷 카드의 각 필드 편집이 레시피 편집 세션 상태에 연결되어, 편집 중 화면 전환이나 재진입 후에도 값이 유지되는지 확인해야 한다.

# 목표

- Hook, Line to Say, Shot/Action, Note 편집이 현재 `RecipeDetailScreen` local state에만 머물지 않게 한다.
- mock workspace provider의 로컬/세션 상태에 편집 중인 shoot-board recipe를 저장한다.
- 기존 local/mock-only 범위를 유지하고 서버 저장, 로그인, 동기화는 추가하지 않는다.

# 범위

- recipe editor board state helper 및 smoke test 추가
- `MockWorkspaceProvider`에 recipe editor board state getter/updater 추가
- `RecipeDetailScreen`의 컷 필드 편집 경로를 provider state와 동기화
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/recipe-editor-state.ts`
- 예정: `src/features/recipes/lib/recipe-editor-state.test.ts`
- 예정: `src/core/providers/mock-workspace-provider.tsx`
- 예정: `src/features/recipes/screens/recipe-detail-screen.tsx`
- 예정: `context/context_20260514_cut_card_field_edit_state.md`

# 테스트

- `npm exec --offline -- tsc --noEmit`

# 롤백

- provider의 recipe editor board state와 `RecipeDetailScreen` 동기화 변경을 되돌리면 기존 화면-local 편집 상태로 복귀한다.

# 리스크

- 세션 상태는 앱 실행 중 mock state에만 남고 앱 재시작 후 영구 저장되지 않는다.
- 이번 범위는 필드 편집 지속성에 집중하며, drag reorder/add/reset의 장기 세션 지속성은 필요한 최소 범위에서만 같이 맞춘다.

# 결과

- 완료: `RecipeEditorBoardState` helper를 추가해 레시피별 `ShootBoardRecipe` 편집 상태를 local/mock 세션 상태로 저장/조회/업데이트할 수 있게 했다.
- 완료: `MockWorkspaceProvider`에 recipe editor board state를 추가하고 getter/setter/updater를 노출했다.
- 완료: `RecipeDetailScreen` 초기화 시 기존 세션 board가 있으면 재사용하고, 컷 카드 필드 편집 경로가 provider state에도 write-through 되도록 연결했다.
- 완료: 빠른 연속 필드 편집이 render closure에 묶이지 않도록 최신 board ref를 기준으로 업데이트한다.
- 검증: `npm exec --offline -- tsc --noEmit` 통과.
- 연결 context: `context/context_20260514_cut_card_field_edit_state.md`
