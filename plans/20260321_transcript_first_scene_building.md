# Transcript First Scene Building

## 배경
- YouTube 다운로드가 차단되면 컷 추출이 실패하고, 현재는 균등 분할 fallback으로 내려간다.
- 사용자는 우선 컷보다 대본/스크립트 중심으로 더 맞는 결과를 원한다.

## 목표
- scene detection이 실패해도 transcript가 있으면 transcript 기반으로 씬 타이밍을 먼저 구성한다.
- 균등 분할 fallback은 transcript도 없을 때만 마지막 수단으로 남긴다.

## 범위
- `src/app/api/analyze/route.ts`
- 작업 기록 문서 업데이트

## 변경 파일
- `plans/20260321_transcript_first_scene_building.md`
- `src/app/api/analyze/route.ts`
- `context/context_20260321_*_transcript_first_scene_building.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint
- transcript 존재/부재 케이스 analyze route smoke 검증

## 롤백
- transcript 기반 scene builder를 제거하고 기존 detection/fixed fallback만 유지한다.

## 리스크
- transcript 타임스탬프가 부정확한 플랫폼에서는 씬 경계가 다소 어색할 수 있다.
- transcript가 매우 짧거나 한 덩어리인 경우에는 장면 분할 정보가 제한적이다.

## 결과
- 완료
- 요약:
  - video scene detection이 실패해도 transcript가 있으면 transcript timestamp/word balance를 기준으로 4~6개 scene start를 구성하도록 했다.
  - transcript 기반 scene은 `sceneDetectionMethod = transcript_guided`로 응답에 표시된다.
  - detection thumbnail이 비어 있는 경우 page media 또는 placeholder thumbnail을 사용하도록 보완했다.

## 연결 Context
- `context/context_20260321_202000_transcript_first_scene_building.md`
