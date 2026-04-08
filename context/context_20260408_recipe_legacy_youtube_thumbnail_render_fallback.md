# 작업 기록: 레거시 유튜브 썸네일 렌더 fallback

## 작업 요약
- 기존 YouTube recipe에서 scene thumbnail이 모두 같은 값으로 저장된 경우, 렌더 시점에만 유튜브 정적 썸네일 세트를 적용하도록 변경했습니다.
- 새로 저장된 direct-video recipe와 개별 thumbnail이 이미 있는 recipe는 건드리지 않습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_legacy_youtube_thumbnail_render_fallback.md`
- `context/context_20260408_recipe_legacy_youtube_thumbnail_render_fallback.md`

## 주요 변경
- `videoUrl`이 YouTube 원본 URL인지 검사하는 helper를 추가했습니다.
- `recipeScenes`의 thumbnail이 사실상 하나만 반복될 때만 `shouldUseLegacyYouTubeCardThumbnails`를 켜도록 했습니다.
- 카드 렌더에서만 scene index 기반 유튜브 정적 썸네일 URL(`1.jpg`, `2.jpg`, `3.jpg`, `0.jpg` 순환)을 사용하도록 했습니다.

## 검증
- 별도 build/test는 수행하지 않았습니다.
- 렌더 시점 fallback만 적용되므로 기존 DB 데이터는 변경하지 않습니다.

## 상태
- 로컬 코드 반영 완료
