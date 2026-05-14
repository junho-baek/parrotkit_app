# 배경

Sub-AC 9.3은 레시피 생성, 저장, 다시 불러오기 경로에서 컷 카드의 네 필수 필드 `Hook`, `Line to Say`, `Shot/Action`, `Note`가 손실되지 않는지 확인해야 한다.

# 목표

- blank/shoot-board 레시피 생성 시 네 컷 카드 필드를 모두 포함한다.
- 레시피 저장 경로가 네 필드를 기존/신규 레시피 상태에 보존한다.
- 저장된 레시피를 Home/My 또는 상세 화면에서 다시 열 때 네 필드가 그대로 로드된다.

# 범위

- local/mock recipe creation/save/load 데이터 변환 경로 점검 및 보강
- 네 필드 보존 회귀 테스트 추가
- 작업 결과 context 문서 추가

# 변경 파일

- 예정: `src/features/recipes/lib/recipe-editor-state.test.ts`
- 예정: `src/features/recipes/lib/recipe-editor-state.ts`
- 예정: `src/core/providers/mock-workspace-provider.tsx`
- 예정: 관련 screen/provider 파일은 필요 시 최소 변경
- 예정: `context/context_20260514_recipe_creation_save_load_cut_fields.md`

# 테스트

- 관련 TypeScript smoke test를 red/green으로 확인
- `npm exec --offline -- tsc --noEmit`

# 롤백

- 이번 변경 파일의 필드 보존 helper/test 변경을 되돌리면 이전 세션 저장 동작으로 복귀한다.

# 리스크

- 앱 재시작 후 영구 저장은 v1 범위 밖이며 이번 작업도 local/mock 세션 상태만 다룬다.
- 기존 mock 데이터에 레거시 필드가 섞여 있을 수 있어 변환 경로에서 fallback을 유지해야 한다.

# 결과

- 완료: `copyRecipeEditorBoard` helper를 추가해 저장/다운로드처럼 레시피 id가 바뀌는 경로에서도 기존 editor board를 새 recipe id로 복사할 수 있게 했다.
- 완료: 복사된 board가 `Hook`, `Line to Say`, `Shot/Action`, `Note` 값을 그대로 유지하는 smoke test를 추가했다.
- 완료: `downloadRecipe`가 Explore/source recipe를 `downloaded-*` id로 저장할 때 기존 local/mock editor board를 함께 복사하도록 연결했다.
- Red 확인: `npm exec --offline -- tsc --noEmit`가 `copyRecipeEditorBoard` 미구현 export 오류로 실패함을 확인했다.
- Green 확인: 구현 후 `npm exec --offline -- tsc --noEmit` 통과.
- 연결 context: `context/context_20260514_recipe_creation_save_load_cut_fields.md`
