# Instagram Recipe Video Preview

## 작업 개요
- 레시피 상세의 비디오 플레이어가 YouTube 전용 구조라 Instagram 소스에서 항상 fallback UI만 보이던 문제를 수정했다.
- 플랫폼별로 재생 방식을 분기해 Instagram/TikTok 원본도 상세 화면에서 바로 볼 수 있게 했다.

## 주요 변경
- `src/components/common/RecipeVideoPlayer.tsx`
  - 플랫폼 판별 로직 추가: `youtube`, `instagram`, `tiktok`, `direct-video`, `other`
  - Instagram URL은 `/embed/captioned/` iframe으로 변환해 상세 화면에서 직접 표시
  - TikTok URL은 `embed/v2` iframe으로 변환해 직접 표시
  - direct video URL(`.mp4`, `.webm`, `.mov`, `.m4v`)은 native `<video>`로 재생
  - direct video는 씬 시작/종료 시점을 기준으로 loop 재생되도록 보강
  - fallback CTA를 `Watch on YouTube` 고정 문구 대신 플랫폼별 `Open on Instagram`, `Open on TikTok`, `Open source video`로 변경
  - 상단 badge도 platform에 따라 `Segment` 또는 `Source video`로 다르게 노출

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit` 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/common/RecipeVideoPlayer.tsx`
  - 에러 없음
  - 기존 `@next/next/no-img-element` warning만 유지

## 메모
- Instagram/TikTok iframe embed는 플랫폼 정책에 따라 일부 공개 범위 영상에서만 동작할 수 있다.
- 그래도 기존처럼 무조건 “platform not available”로 버리지 않고, 가능한 경우에는 상세 화면에서 바로 볼 수 있는 방향으로 개선했다.
