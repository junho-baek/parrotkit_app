# Analyze Pipeline Korean Logging

## 배경
- `/api/analyze` 실패 시 현재 Vercel 서버 로그가 영어 위주이거나 단계 구분이 약해, RapidAPI / Gemini / frame diff / YouTube fallback / transcript fallback 중 어디서 문제가 났는지 빠르게 파악하기 어렵다.
- 특히 YouTube fallback에서 `Sign in to confirm you’re not a bot` 같은 오류가 떠도, 그 전에 RapidAPI와 Gemini가 왜 실패했는지 로그만 보고 추적하기가 답답하다.

## 목표
- `/api/analyze`의 주요 분기와 fallback 사유를 한국어 서버 로그로 명확히 남긴다.
- Vercel 로그에서 요청 단위로 흐름을 따라갈 수 있도록 request id와 핵심 메타데이터를 함께 찍는다.
- 브라우저 로그가 아니라 서버 로그만으로도 원인을 충분히 좁힐 수 있게 만든다.

## 범위
- `src/app/api/analyze/route.ts`에 요청 시작, 외부 소스 조회, 각 분석 단계 성공/실패, fallback 전환, 최종 응답 요약 로그 추가
- 필요 시 경량 로그 헬퍼 추가
- 로컬 dev 환경에서 `/api/analyze` 호출을 한 번 태워 로그 형식을 확인

## 변경 파일
- `plans/20260405_analyze_pipeline_korean_logging.md`
- `src/app/api/analyze/route.ts`
- `src/lib/video-analyzer.ts`
- `context/context_20260405_*_analyze_pipeline_korean_logging.md`

## 테스트
- `npx eslint src/app/api/analyze/route.ts`
- `npm run dev` 기준 로컬 `/api/analyze` 호출 또는 기존 dev 서버에서 요청 재현
- 서버 콘솔 출력에서 한국어 단계 로그와 fallback 사유 확인

## 롤백
- 추가한 로그 헬퍼 및 `console.info/warn/error` 블록 제거
- 기존 영문 최소 로그 상태로 복귀

## 리스크
- 로그가 과해지면 한 요청당 출력량이 커질 수 있다.
- URL 전체를 그대로 남기면 로그 노이즈가 커질 수 있어, 필요 최소한의 식별자만 남기도록 조정해야 한다.

## 결과
- 완료
- `/api/analyze`에 request id 기반 한국어 서버 로그를 추가해 요청 시작, 외부 소스 조회, Gemini 시도, frame diff 시도, YouTube fallback 전환, transcript fallback, 최종 응답 반환까지 흐름이 보이도록 정리했다.
- 기존 영어 위주 서버 로그 일부도 한국어로 바꿨다. 특히 YouTube fallback 다운로드/장면 분석 로그를 한국어로 바꿔 Vercel 로그에서 더 읽기 쉽게 만들었다.
- 로컬에서는 `npx eslint src/app/api/analyze/route.ts src/lib/video-analyzer.ts`를 통과했고, `curl`로 `/api/analyze`를 호출해 응답 구조와 `metadata` 키 존재를 확인했다.

## 연결 Context
- `context/context_20260405_064734_analyze_pipeline_korean_logging.md`
