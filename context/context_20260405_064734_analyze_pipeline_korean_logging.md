# Analyze Pipeline Korean Logging

## 작업 요약
- `/api/analyze` 서버 로그를 request id 기반 한국어 로그로 정리했다.
- 한 요청 안에서 `분석 요청 시작 -> 외부 소스 조회 완료 -> Gemini 비디오 분석 -> 프레임 차이 분석 -> YouTube fallback -> transcript fallback -> 응답 반환` 순서가 Vercel 로그만으로 보이도록 했다.
- RapidAPI와 Supadata를 실제로 먼저 시도하고도 왜 YouTube fallback으로 내려갔는지, 각 단계의 실패 사유를 `reason` 필드로 남기도록 정리했다.
- 기존 영어 위주 서버 로그 일부도 한국어로 바꿨다. 특히 `src/lib/video-analyzer.ts`의 YouTube fallback 다운로드/장면 분석 로그를 한국어로 바꿔 Vercel 로그에서 원인 읽기가 쉬워졌다.

## 변경 파일
- `src/app/api/analyze/route.ts`
- `src/lib/video-analyzer.ts`
- `plans/20260405_analyze_pipeline_korean_logging.md`

## 검증
- `npx eslint src/app/api/analyze/route.ts src/lib/video-analyzer.ts`
  - 통과
- 로컬 `curl` 호출
  - `POST http://127.0.0.1:3000/api/analyze`
  - 샘플 URL: `https://www.youtube.com/shorts/hXPdqTRADms`
  - 응답 최상위 키 확인:
    - `success`
    - `videoId`
    - `url`
    - `scenes`
    - `transcript`
    - `metadata`
  - `metadata` 내부 키 확인:
    - `mediaSource`
    - `mediaFallbackReason`
    - `sceneDetectionMethod`
    - `sceneDetectionFallbackReason`
    - `transcriptSource`
    - `transcriptFallbackReason`
    - 그 외 duration/platform/scriptSource 등
- 참고
  - 현재 로컬에는 기존 `next dev` 인스턴스가 이미 떠 있어서 별도 포트에서 새 dev 인스턴스를 띄우는 건 `.next/dev/lock` 때문에 실패했다.
  - 대신 기존 dev 서버를 대상으로 응답 구조 확인을 진행했다.

## 새 로그 예시
- `[분석][analyze_xxx] 분석 요청을 시작합니다.`
- `[분석][analyze_xxx] 외부 소스 조회를 마쳤습니다.`
- `[분석][analyze_xxx] 직접 비디오 URL을 확보해 Gemini 비디오 분석을 시도합니다.`
- `[분석][analyze_xxx] Gemini 비디오 분석이 실패해 다음 단계로 넘어갑니다.`
- `[분석][analyze_xxx] 직접 비디오 분석이 성립하지 않아 YouTube 전용 fallback으로 전환합니다.`
- `[분석][analyze_xxx] YouTube 전용 fallback도 실패했습니다.`
- `[분석][analyze_xxx] 영상 기반 장면 감지가 실패해 대본 기반 분할을 사용합니다.`
- `[분석][analyze_xxx] 분석 응답을 반환합니다.`
- `[유튜브 장면 분석] 비디오 다운로드를 시작합니다.`
- `[유튜브 장면 분석] 비디오 메타데이터를 가져왔습니다.`
- `[유튜브 장면 분석] 분석 중 오류가 발생했습니다.`

## 메모
- URL 전체 query string은 로그 노이즈를 줄이기 위해 origin + pathname 정도만 남기도록 정리했다.
- 응답 `metadata`가 이미 충분히 상세하므로, 이후 Vercel 로그와 함께 보면 “어느 단계에서 왜 fallback 했는지”를 꽤 빠르게 좁힐 수 있다.
