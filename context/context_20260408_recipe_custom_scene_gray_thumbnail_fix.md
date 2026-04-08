# 작업 요약

- 레시피 리스트에서 custom scene에까지 적용되던 legacy YouTube thumbnail fallback을 reference scene 전용으로 제한했다.
- 이제 custom scene은 `sceneSupportsAnalysis(...)`가 false면 `scene.thumbnail`만 사용하고, 비어 있으면 회색 placeholder 카드가 그대로 보인다.

# 변경 파일

- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_custom_scene_gray_thumbnail_fix.md`

# 검증

- 자동 테스트 미실행
- 사용자 로컬 수동 확인 전 상태

# 메모

- 기존 reference scene fallback은 유지했다.
