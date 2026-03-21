# Transcript First Scene Building

## 작업 개요
- YouTube 다운로드/컷 추출이 실패해도 transcript가 있으면 장면과 스크립트가 완전히 균등 분할 mock처럼 보이지 않도록 transcript 중심 scene builder를 추가했다.

## 주요 변경
- `src/app/api/analyze/route.ts`
  - transcript segment의 word balance와 timestamp를 이용해 4~6개 scene start를 계산하는 `buildTranscriptGuidedDetections` 추가
  - video detection 결과가 없고 transcript가 있으면 `transcript_guided` 메서드로 scene 구성
  - detection thumbnail이 없을 경우 page media image 또는 placeholder thumbnail 사용
- `src/lib/video-analyzer.ts`
  - `VideoAnalysisResult.method`에 `transcript_guided` 추가

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit` 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/app/api/analyze/route.ts src/lib/video-analyzer.ts` 통과

## 메모
- 이제 analyze 우선순위는:
  - FFmpeg/direct video 기반 detection
  - transcript guided scene building
  - 최종 fixed fallback
- transcript가 없는 유튜브는 여전히 기존 fallback 품질 한계가 남아 있다.
