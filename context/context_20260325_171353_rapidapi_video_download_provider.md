# RapidAPI Video Download Provider

## 작업 개요
- RapidAPI 기반 social media video downloader provider를 추가해 YouTube, Instagram, TikTok, Facebook 링크에서 direct/proxied video URL을 우선 확보하도록 분석 파이프라인을 보강했다.
- 기존 `ytdl-core` YouTube 다운로드와 page meta 스크래핑은 fallback으로 유지했다.

## 주요 변경
- `src/lib/social-video-downloader.ts`
  - RapidAPI provider 모듈 추가
  - env 우선순위:
    - `RAPIDAPI_SMVD_KEY` 또는 `RAPIDAPI_KEY`
    - `RAPIDAPI_SMVD_HOST` 또는 `RAPIDAPI_HOST`
    - optional `RAPIDAPI_SMVD_BASE_URL`
  - 플랫폼별 endpoint 매핑:
    - YouTube: `/youtube/v3/video/details?videoId=...&urlAccess=proxied`
    - Instagram: `/instagram/v3/media/post/details?shortcode=...`
    - TikTok: `/tiktok/v3/post/details?url=...`
    - Facebook: `/facebook/v3/post/details?url=...`
  - 응답에서 `contents[].videos`를 보수적으로 파싱해 분석용으로 가장 무난한 video URL을 선택
- `src/app/api/analyze/route.ts`
  - `fetchSocialVideoDownload(url)`를 `fetchPageMedia(url)` 및 `fetchSupadataTranscript(url)`와 병렬 호출
  - `resolvedMedia`를 만들어 RapidAPI video URL이 있으면 그것을 우선 사용
  - 컷 추출은 `analyzeVideoFrameCandidates(resolvedMedia.videoUrl)`를 먼저 타고, YouTube는 그 뒤에만 `analyzeYouTubeVideo(url)` fallback 수행
  - 응답 metadata에 `mediaSource`, `mediaFallbackReason` 추가

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/lib/social-video-downloader.ts src/app/api/analyze/route.ts`
  - 통과

## 메모
- `.env.local` 기준 RapidAPI 관련 env는 아직 없었다. 따라서 이번 작업에서는 live endpoint smoke test는 수행하지 못했고, provider는 env 미설정 시 자동으로 `source: none` fallback 하도록 구현했다.
- renderable video WebSocket execution flow는 이번 범위에서 제외했다. 현재는 direct/proxied `videos[]`만 분석용 URL로 사용한다.
- recipe 저장 시 `video_url`은 기존처럼 원본 SNS URL을 유지하고, RapidAPI에서 받은 direct URL은 분석 시점 transient URL로만 사용한다.
