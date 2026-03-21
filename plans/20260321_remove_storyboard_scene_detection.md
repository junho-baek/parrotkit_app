# Remove Storyboard Scene Detection

## 배경
- 배포 로그에서 YouTube/Shorts 분석 시 storyboard 경로가 먼저 실행되며 봇 차단 에러가 발생했다.
- 사용자는 Shorts에 storyboard 경로 자체가 불필요하다고 판단했고, 관련 로직을 전부 제거해 달라고 요청했다.
- 배포 환경에서는 임시 파일 경로가 `/var/task/temp`로 잡혀 `ENOENT`가 발생하고 있었다.

## 목표
- YouTube/Shorts storyboard scene detection 로직을 제거한다.
- YouTube/Shorts는 다운로드 기반 scene detection만 사용하도록 단순화한다.
- 임시 파일 경로를 서버리스 친화적인 `/tmp` 기반으로 변경한다.

## 범위
- `src/lib/video-analyzer.ts`
- `src/app/api/analyze/route.ts`
- 작업 기록 문서 업데이트

## 변경 파일
- `plans/20260321_remove_storyboard_scene_detection.md`
- `src/lib/video-analyzer.ts`
- `src/app/api/analyze/route.ts`
- `context/context_20260321_*_remove_storyboard_scene_detection.md`

## 테스트
- `npx tsc --noEmit`
- 변경 파일 ESLint
- 필요 시 analyze route smoke 확인

## 롤백
- storyboard 관련 helper와 `youtube_storyboard_diff` 메서드 값을 복구한다.

## 리스크
- YouTube 다운로드가 막히는 경우 바로 fallback으로 내려갈 수 있다.
- 기존 storyboard 경로가 잡아주던 일부 URL은 더 빨리 fallback될 수 있다.

## 결과
- 완료
- 요약:
  - YouTube/Shorts storyboard scene detection helper와 관련 타입/메서드 값을 제거했다.
  - YouTube/Shorts는 FFmpeg 다운로드 기반 scene detection만 사용하도록 단순화했다.
  - generic frame diff 분석과 YouTube 다운로드 분석 임시 경로를 `/tmp/parrotkit/...`로 변경해 서버리스 환경에서 `/var/task/temp` 오류가 나지 않도록 했다.

## 연결 Context
- `context/context_20260321_201000_remove_storyboard_scene_detection.md`
