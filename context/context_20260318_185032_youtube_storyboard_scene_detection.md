# YouTube Storyboard Scene Detection

## 작업 개요
- 사용자가 유튜브 영상도 컷 단위가 아니라 5초 균등 분할로 나온다고 제보해 YouTube 분석 경로를 점검했다.
- 원인 확인 결과 기존 유튜브 경로는 `@distube/ytdl-core` 기반 다운로드/FFmpeg 감지가 자주 실패했고, 그 경우 조용히 5초 fallback으로 내려가고 있었다.

## 주요 변경
- `src/lib/video-analyzer.ts`
  - YouTube storyboard spec(`playerStoryboardSpecRenderer.spec`) 파싱 추가
  - storyboard sprite를 `sharp`로 잘라 프레임별 diff score를 계산하는 `youtube_storyboard_diff` 경로 추가
  - storyboard가 있으면 실제 비디오 다운로드 없이 6개 컷 포인트를 추정해 썸네일까지 반환하도록 변경
  - 기존 FFmpeg video download 경로는 보조 경로로 유지
  - 결과 metadata를 위해 `method`, `fallbackReason` 필드 추가
- `src/app/api/analyze/route.ts`
  - `metadata.sceneDetectionMethod`, `metadata.sceneDetectionFallbackReason` 추가
  - AI 스크립트 생성에서 malformed JSON이 나오면 한 번 더 JSON repair 프롬프트로 복구하도록 변경
  - 생성 temperature를 0.4로 낮춰 JSON 안정성을 높임

## 확인한 원인
- `@distube/ytdl-core`는 일부 YouTube URL에서 `Failed to find any playable formats`로 실패했다.
- storyboard가 있는 YouTube 영상은 다운로드 없이도 컷 추정이 가능했고, 이 경로는 실제로 5초 fallback을 대체했다.
- storyboard가 없고 다운로드도 실패하는 영상은 여전히 5초 fallback으로 내려가지만, 이제 metadata에서 원인을 확인할 수 있다.

## 검증
- `npx tsc --noEmit` 통과
- `npx eslint src/lib/video-analyzer.ts src/app/api/analyze/route.ts` 통과
- `npx tsx` analyzer smoke test
  - `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
    - 결과: `method: youtube_storyboard_diff`, `sceneCount: 6`, timestamps `0, 10, 24, 56, 84, 124`
  - `https://www.youtube.com/watch?v=jNQXAC9IVRw`
    - 결과: storyboard 없음 + 다운로드 실패
    - `fallbackReason: youtube_scene_detection_failed`
- local dev API smoke test
  - `POST /api/analyze` with `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
  - 결과:
    - `sceneDetectionMethod: youtube_storyboard_diff`
    - timestamps `00:00, 00:10, 00:24, 00:56, 01:24, 02:04`
    - AI script lines generated successfully after JSON repair path 추가
  - `POST /api/analyze` with `https://www.youtube.com/watch?v=jNQXAC9IVRw`
    - 결과:
      - `sceneDetectionMethod: fixed_5s_fallback`
      - `sceneDetectionFallbackReason: youtube_scene_detection_failed`

## 메모
- storyboard frame interval은 실제 컷 경계보다 거칠 수 있어 “정확한 장면 전환 시점”보다는 “컷에 가까운 변화 지점” 추정에 가깝다.
- YouTube 전반의 SABR/format 이슈 때문에 storyboard가 없는 영상까지 완전히 커버하려면 별도 다운로드 전략이나 외부 extractor 보강이 추가로 필요하다.
