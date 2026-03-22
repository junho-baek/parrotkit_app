# Instagram Recipe Video Preview

## 배경
- 레시피 상세의 영상 플레이어가 YouTube 중심으로 구현되어 있어 Instagram 소스에서도 `Segment preview is not available for this platform.` fallback만 노출된다.
- 사용자는 Instagram 레시피에서도 원본 영상을 보고 싶어 한다.

## 목표
- Recipe video player가 플랫폼별로 적절한 재생/임베드 경로를 사용하도록 개선한다.
- Instagram 소스에서 가능한 경우 직접 미리보기를 제공하고, fallback 문구/CTA도 플랫폼에 맞게 정리한다.

## 범위
- `src/components/common/RecipeVideoPlayer.tsx`
- 필요 시 관련 URL 판별 보조 로직 추가
- 작업 기록 문서 작성

## 변경 파일
- `plans/20260322_instagram_recipe_video_preview.md`
- `src/components/common/RecipeVideoPlayer.tsx`
- `context/context_20260322_*_instagram_recipe_video_preview.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint
- 플랫폼별 URL 분기 수동 검토

## 롤백
- 기존 YouTube 전용 플레이어 및 공통 fallback UI로 복구

## 리스크
- Instagram/TikTok의 public embed 정책에 따라 일부 URL은 브라우저에서 임베드가 차단될 수 있다.
- 임베드 URL 변환 규칙이 플랫폼 URL 변형을 모두 커버하지 못할 수 있다.

## 결과
- 완료
- 요약:
  - `RecipeVideoPlayer`에 플랫폼 판별을 추가해 YouTube, Instagram, TikTok, direct video URL을 각각 다른 재생 경로로 처리하도록 변경했다.
  - Instagram/TikTok은 embed iframe으로 원본 영상을 바로 볼 수 있게 했고, direct video URL은 native video로 재생되도록 추가했다.
  - fallback CTA도 플랫폼별 문구로 바꿔 더 자연스럽게 원본 소스로 이동할 수 있게 정리했다.

## 연결 Context
- `context/context_20260322_093700_instagram_recipe_video_preview.md`
