# 작업 요약

- 레시피 상세 화면의 analysis/recipe drawer 헤더를 compact 형태로 정리했다.
- analysis drawer 상단에 `View Your Script` 액션을 추가해 recipe 탭 + script drawer로 바로 이어지게 했다.
- recipe drawer 상단에 `Edit with Parrot AI` 액션을 추가해 scene assistant drawer를 직접 열 수 있게 했다.
- recipe drawer 높이를 analysis와 동일하게 `50%` 수준으로 맞추고 backdrop을 drawer 톤에 맞게 정리했다.

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_drawer_top_toggles.md`

# 검증

- 자동 테스트 미실행
- 사용자 로컬 수동 확인 전 상태

# 메모

- analysis/recipe drawer 전환은 `setActiveTab(...)` + `setScriptSheetOpen(true)` 조합으로 처리했다.
- `Edit with Parrot AI`는 recipe 탭 기준으로 scene assistant drawer를 직접 여는 흐름으로 연결했다.
