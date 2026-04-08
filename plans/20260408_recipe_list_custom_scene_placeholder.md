# 배경

레시피 리스트에서 custom scene은 썸네일이 없을 때도 강한 그라데이션 카드와 보조 카피가 노출되어, reference scene과 섞여 보이고 화면이 다소 시끄러웠다. 타임라인이 비어 있거나 사실상 미지정인 scene도 불필요한 시간 정보가 보였다.

# 목표

- 썸네일이 없는 custom scene은 기본 회색 카드로 보이게 한다.
- 타임라인이 지정되지 않은 custom scene은 시간 줄을 숨긴다.
- `Recipe only · no reference` 같은 보조 카피를 리스트 카드에서 제거한다.

# 범위

- 레시피 리스트 카드의 썸네일 placeholder
- 타임라인 노출 조건
- custom scene 보조 카피 제거

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_list_custom_scene_placeholder.md`
- `context/context_20260408_recipe_list_custom_scene_placeholder.md`

# 테스트

- 로컬 수동 확인 예정
- `build` 미실행

# 롤백

- `RecipeResult.tsx`의 custom scene thumbnail/timeline/card meta 조건을 되돌리면 된다.

# 리스크

- 기존 custom scene 중 start/end가 같게 저장된 항목도 타임라인이 숨겨질 수 있다.
- 이미지 로드 실패 시 gray placeholder가 의도대로 보이는지 브라우저별 차이가 있을 수 있다.

# 결과

- custom scene 기본 thumbnail 영역을 gray placeholder로 정리
- 새 custom scene은 빈 time range로 생성
- 리스트 카드에서 custom scene 보조 카피 제거
- 연결 context: `context/context_20260408_recipe_list_custom_scene_placeholder.md`
