# 작업 기록: 레시피 direct video 버킷 통합

## 작업 요약
- 분석 API가 확보한 direct video를 Supabase Storage 공개 버킷 `recipe-source-videos`에 업로드하고, 그 public URL을 recipe playback 기준 URL로 사용하도록 정리했습니다.
- recipe 저장 시 `videoUrl`은 canonical playback URL로 저장하고, 원본 소셜 링크는 `sourceUrl`로 분리해 reference 쪽에 유지하도록 바꿨습니다.
- RecipeVideoPlayer는 Instagram/TikTok iframe embed fallback을 제거하고, YouTube 전용 fallback만 유지하도록 단순화했습니다.

## 변경 파일
- `src/app/api/analyze/route.ts`
- `src/components/auth/URLInputForm.tsx`
- `src/components/common/RecipeVideoPlayer.tsx`
- `src/app/api/recipes/route.ts`
- `plans/20260408_recipe_direct_video_bucket_unify.md`
- `context/context_20260408_recipe_direct_video_bucket_unify.md`

## 주요 변경
- `analyze` 응답에 `videoUrl`을 추가해 direct playback용 canonical URL을 내려주도록 변경했습니다.
- direct video 확보 시 `recipe-source-videos` 버킷으로 업로드를 시도하고, 실패하면 기존 direct video URL을 그대로 fallback으로 사용하도록 했습니다.
- `sourceMetadata`에 `originalSourceUrl`, `resolvedVideoUrl`, `playbackVideoUrl`, `storageBucket`, `storagePath`, `storageUploadError`를 남기도록 정리했습니다.
- recipe 생성 시 `videoUrl`과 `sourceUrl`을 분리해 `recipes.video_url`과 `references.source_url`의 역할을 나눴습니다.
- RecipeVideoPlayer는 direct video 또는 YouTube만 inline 재생하고, 그 외 플랫폼은 generic fallback panel만 노출하도록 정리했습니다.

## 검증
- 별도 실행 검증은 하지 않았습니다.
- 사용자 수동 확인 기준으로 버킷 생성 후 recipe 화면에서 direct playback 통일 여부를 확인하면 됩니다.

## 상태
- 로컬 코드 반영 완료
- 버킷 `recipe-source-videos` 생성 필요
