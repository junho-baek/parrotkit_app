# YouTube Storyboard Scene Detection

## 배경
- 사용자가 유튜브 영상도 컷 단위가 아니라 5초 균등 분할로 내려온다고 제보했다.
- 현재 구현은 유튜브에서 FFmpeg scene detection을 먼저 시도하지만, 실제 다운로드 경로가 자주 실패해 고정 5초 fallback으로 내려가고 있다.

## 목표
- 유튜브 URL에서 storyboard 기반 프레임 diff scene detection을 추가한다.
- 기존 FFmpeg 다운로드/scene detection은 보조 경로로 유지한다.
- API 응답 metadata에 실제 scene detection method와 fallback reason을 남긴다.

## 범위
- `src/lib/video-analyzer.ts`
- `src/app/api/analyze/route.ts`
- 작업 기록 문서 업데이트

## 변경 파일
- `plans/20260318_youtube_storyboard_scene_detection.md`
- `src/lib/video-analyzer.ts`
- `src/app/api/analyze/route.ts`
- `context/context_20260318_*_youtube_storyboard_scene_detection.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint 확인
- `npx tsx` 기반 유튜브 analyzer smoke test
- 필요 시 로컬 `/api/analyze` 확인

## 롤백
- storyboard 분석 로직과 metadata 필드를 제거하고 기존 FFmpeg + 균등 분할 경로로 되돌린다.

## 리스크
- 모든 유튜브 영상에 storyboard가 제공되는 것은 아니다.
- storyboard frame interval은 실제 컷 경계보다 거칠 수 있어 “정확한 컷”보다는 “컷에 가까운 변화 지점” 수준일 수 있다.

## 결과
- 완료
- 요약:
  - 유튜브 분석 경로에 storyboard diff 기반 `youtube_storyboard_diff` scene detection을 추가했다.
  - storyboard가 있는 유튜브는 5초 균등 분할 대신 컷 변화 기반 timestamps를 반환한다.
  - storyboard/다운로드 모두 실패하는 경우에도 `sceneDetectionFallbackReason`으로 원인을 확인할 수 있게 했다.
  - AI 스크립트 생성은 malformed JSON 시 repair pass를 추가해 기본 목 대본으로 떨어지는 빈도를 줄였다.
- 연결 context: `context/context_20260318_185032_youtube_storyboard_scene_detection.md`
