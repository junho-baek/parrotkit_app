# 작업 요약

- 레시피 리스트에서 썸네일이 없는 custom scene은 그라데이션 대신 회색 placeholder 카드로 보이게 바꿨다.
- 새 custom scene은 빈 time range로 생성되게 바꿔, 리스트에서 타임라인이 기본 노출되지 않도록 정리했다.
- 리스트 카드의 `Recipe only · no reference` 보조 카피를 제거했다.
- 타임라인은 실제로 start/end가 있고 reference scene이거나 start/end가 다를 때만 보이게 했다.

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_list_custom_scene_placeholder.md`

# 검증

- 자동 테스트 미실행
- 사용자 로컬 수동 확인 전 상태

# 메모

- 이미지 로드 실패 시에도 카드 배경 `bg-gray-100`이 그대로 남아 placeholder처럼 보이도록 유지했다.
