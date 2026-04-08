# 작업 요약

- 레시피 목록 하단 중앙에 새 장면을 추가하는 `+` 플로팅 버튼을 추가했다.
- 새로 만든 scene은 빈 reference analysis를 가진 custom scene으로 만들고, 상세 화면에서 `Recipe / Shooting`만 노출되게 했다.
- 기존 scene과 새 scene 모두 카드와 상세 헤더에서 제목을 수정할 수 있게 했다.
- 카드 헤딩은 전략 라벨 대신 사용자 제목을 메인으로 보여주고, reference scene에만 전략 메타를 보조 정보로 남겼다.

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_scene_add_and_rename.md`

# 검증

- 자동 테스트 미실행
- 사용자 로컬 수동 확인 전 상태

# 메모

- 새 scene은 `createCustomRecipeScene(...)`으로 생성한다.
- 구조 저장은 `saveSceneStructure(...)`로 통일해 sessionStorage와 recipe PATCH를 함께 태운다.
- custom scene은 `sceneSupportsAnalysis(...)`가 false가 되도록 빈 analysis payload를 가진다.
