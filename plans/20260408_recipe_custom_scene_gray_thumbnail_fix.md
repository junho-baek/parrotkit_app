# 배경

레시피 리스트에서 custom scene은 썸네일이 비어 있어도 legacy YouTube thumbnail fallback이 같이 적용되어, 의도와 다르게 임의 유튜브 썸네일이 노출되고 있었다.

# 목표

- custom scene에서는 legacy YouTube thumbnail fallback을 적용하지 않는다.
- reference scene만 기존 fallback을 유지하고, custom scene은 썸네일이 없으면 회색 placeholder를 보여준다.

# 범위

- 레시피 리스트 카드의 legacy YouTube thumbnail fallback 조건

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_custom_scene_gray_thumbnail_fix.md`
- `context/context_20260408_recipe_custom_scene_gray_thumbnail_fix.md`

# 테스트

- 로컬 수동 확인 예정
- `build` 미실행

# 롤백

- `RecipeResult.tsx`의 card thumbnail fallback 조건을 이전 상태로 되돌리면 된다.

# 리스크

- reference scene 판별 기준이 `sceneSupportsAnalysis(...)`에 의존하므로, analysis가 비정상적으로 비어 있는 오래된 recipe는 fallback이 줄어들 수 있다.

# 결과

- custom scene에는 legacy YouTube 썸네일이 더 이상 자동 적용되지 않음
- 연결 context: `context/context_20260408_recipe_custom_scene_gray_thumbnail_fix.md`
