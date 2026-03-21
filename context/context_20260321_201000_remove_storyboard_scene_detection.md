# Remove Storyboard Scene Detection

## 작업 개요
- YouTube/Shorts 분석에서 storyboard 경로를 전부 제거했다.
- 서버리스 배포 환경에서 임시 파일 경로가 `/var/task/temp`로 잡히던 문제를 `/tmp/parrotkit/...` 경로로 정리했다.

## 주요 변경
- `src/lib/video-analyzer.ts`
  - `youtube_storyboard_diff` 메서드 제거
  - storyboard spec 파싱, storyboard sheet fetch, storyboard frame extraction helper 제거
  - 내부 프레임 타입을 generic `FrameSample`로 정리
  - YouTube 분석은 FFmpeg 다운로드 기반만 사용
  - generic frame diff 분석 임시 경로를 `/tmp/parrotkit/frame-candidates/...`로 변경
  - YouTube 다운로드 분석 임시 경로를 `/tmp/parrotkit/youtube-analysis/...`로 변경

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit` 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/lib/video-analyzer.ts src/app/api/analyze/route.ts` 통과

## 메모
- 현재 analyze 응답의 `sceneDetectionMethod`는 `ffmpeg_video_download`, `frame_diff_ai_confirmed`, `fixed_5s_fallback`만 남게 된다.
- YouTube 자체가 봇 차단으로 다운로드 경로를 막는 경우에는 storyboard 우회 없이 바로 fallback으로 내려갈 수 있다.
