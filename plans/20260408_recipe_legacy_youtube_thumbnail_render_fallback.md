# Recipe Legacy YouTube Thumbnail Render Fallback

## 배경
- 기존에 저장된 YouTube recipe는 scene thumbnail이 모두 같은 값으로 남아 있어 카드가 구분되지 않습니다.
- AI/ffmpeg 재분석 없이, 기존 YouTube recipe에 한해서 렌더 시점 fallback으로 유튜브 정적 썸네일 세트를 적용하면 비용 없이 개선할 수 있습니다.

## 목표
- 기존 YouTube recipe에서 scene thumbnail이 사실상 하나만 반복될 때 카드 썸네일을 유튜브 정적 썸네일로 분기합니다.
- 새로 저장된 direct-video recipe와 이미 개별 thumbnail이 있는 recipe는 그대로 유지합니다.

## 범위
- `src/components/common/RecipeResult.tsx`
- `context/context_20260408_recipe_legacy_youtube_thumbnail_render_fallback.md`

## 변경 파일
- `plans/20260408_recipe_legacy_youtube_thumbnail_render_fallback.md` (신규)
- `src/components/common/RecipeResult.tsx` (수정 예정)
- `context/context_20260408_recipe_legacy_youtube_thumbnail_render_fallback.md` (작성 예정)

## 테스트
- 기존 YouTube recipe 화면에서 카드 썸네일이 정적 썸네일 세트로 갈라지는지 수동 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- RecipeResult의 legacy YouTube thumbnail fallback 분기를 제거하고 `scene.thumbnail` 그대로 렌더하도록 되돌림

## 리스크
- 유튜브 정적 썸네일은 실제 scene 시작 프레임이 아니므로 정확도는 제한적입니다.
- 일부 영상은 정적 썸네일 품질/가용성이 낮을 수 있습니다.
