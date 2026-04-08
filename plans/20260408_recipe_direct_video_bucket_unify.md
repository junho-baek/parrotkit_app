# Recipe Direct Video Bucket Unify

## 배경
- 현재 레시피 분석 후 저장 단계에서 원본 소셜 URL을 그대로 `recipe.videoUrl`로 저장하고 있습니다.
- 이 구조 때문에 YouTube / Reels / TikTok이 동일한 direct video 플레이어를 쓰지 못하고, 일부 플랫폼은 iframe/embed fallback으로 갈라집니다.
- 목표는 장면 개수를 고정하지 않으면서도, 가능한 경우 플랫폼과 무관하게 다운로드한 직접 재생용 영상을 기준으로 동일한 UI를 보여주는 것입니다.

## 목표
- 분석 단계에서 확보한 direct video를 Supabase Storage 버킷에 저장합니다.
- 레시피 저장 시 원본 URL 대신 버킷 public URL을 canonical playback URL로 사용합니다.
- Recipe 화면 플레이어에서 Instagram/TikTok iframe fallback을 제거하고, YouTube 전용 fallback만 유지합니다.

## 범위
- `src/app/api/analyze/route.ts`
- `src/components/auth/URLInputForm.tsx`
- `src/components/common/RecipeVideoPlayer.tsx`
- `src/app/api/recipes/route.ts`
- `context/context_20260408_recipe_direct_video_bucket_unify.md`

## 변경 파일
- `plans/20260408_recipe_direct_video_bucket_unify.md` (신규)
- `src/app/api/analyze/route.ts` (수정 예정)
- `src/components/auth/URLInputForm.tsx` (수정 예정)
- `src/components/common/RecipeVideoPlayer.tsx` (수정 예정)
- `src/app/api/recipes/route.ts` (수정 예정)
- `context/context_20260408_recipe_direct_video_bucket_unify.md` (작성 예정)

## 테스트
- 사용자 수동 확인 기준으로 로컬 recipe 라우트에서 direct video 재생 흐름 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- analyze 응답에서 버킷 playback URL 주입을 제거하고 원본 소셜 URL 저장 방식으로 되돌림
- RecipeVideoPlayer에서 비YouTube iframe/embed 분기를 복구

## 리스크
- 버킷이 없거나 public 설정이 다르면 direct playback URL 발급이 실패할 수 있음
- 외부 소셜 direct video가 다운로드 차단되면 Instagram/TikTok은 inline 재생이 아닌 안내 상태로 보일 수 있음

## 결과
- 완료
- analyze 응답에 Supabase Storage 기반 canonical playback URL을 추가했습니다.
- recipe 저장 시 canonical playback URL과 original source URL을 분리해 저장하도록 정리했습니다.
- RecipeVideoPlayer에서 Instagram/TikTok iframe fallback을 제거하고, YouTube 전용 fallback만 남겼습니다.

## 연결 context
- `context/context_20260408_recipe_direct_video_bucket_unify.md`
