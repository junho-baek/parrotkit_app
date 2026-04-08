# 작업 요약

- 레시피 목록의 `+` 버튼이 상세 진입 대신 하단 create drawer를 열도록 바꿨다.
- create drawer 안에서 제목을 입력하고 `Add Scene`으로 custom scene을 추가하도록 정리했다.
- 새 custom scene은 기본적으로 `New cue` prompter block 하나를 포함한다.
- create drawer가 열린 동안에는 중앙 `+` FAB와 우측 chat FAB를 숨겨 하단 액션 충돌을 줄였다.

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_add_scene_drawer.md`

# 검증

- 자동 테스트 미실행
- 사용자 로컬 수동 확인 전 상태

# 메모

- 새 scene 생성은 `confirmAddScene(...)`에서 처리한다.
- custom scene 생성 helper는 `createCustomRecipeScene(sceneId, startTime, title?)` 형태로 확장했다.
