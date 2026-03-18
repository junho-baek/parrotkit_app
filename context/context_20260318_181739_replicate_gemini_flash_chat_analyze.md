# Replicate Gemini Flash Chat Analyze

## 작업 개요
- 사용자의 요청에 따라 챗봇과 레시피 스크립트 생성 경로를 Replicate `google/gemini-2.5-flash`로 빠르게 전환했다.
- 이번 작업에서는 Notion 업로드를 수행하지 않았다.

## 주요 변경
- `src/lib/replicate.ts`
  - Replicate official model prediction helper 추가
  - `POST /v1/models/{owner}/{name}/predictions` 호출 후 `Prefer: wait` + polling 처리
  - 배열/string 형태 output을 텍스트로 합치는 `replicateOutputToText` 추가
- `src/app/api/chat/route.ts`
  - 기존 Google Gemini SDK 제거
  - scene context / current script context를 `systemInstruction`으로 넘기고, 전체 대화 transcript를 `prompt`로 전달하도록 변경
- `src/app/api/analyze/route.ts`
  - 기존 Google Gemini SDK 제거
  - scene descriptions / scripts JSON 생성 경로를 Replicate Gemini Flash로 변경
  - 기존 JSON regex 파싱 계약은 유지

## 검증
- 정적 검사
  - `npx tsc --noEmit` 통과
  - `npx eslint src/lib/replicate.ts src/app/api/chat/route.ts src/app/api/analyze/route.ts` 통과
- dev 서버
  - `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- API smoke test
  - `/api/chat`
    - 요청: 한국어 Hook 스크립트 요청 + currentScene context 포함
    - 결과: `message` 문자열 정상 응답
    - preview:
      - `네, 알겠습니다. "Hook" 장면을 위한 새로운 스크립트입니다: ...`
  - `/api/analyze`
    - 요청: `https://example.com/video` + niche/goal/description
    - 결과: `success: true`, `sceneCount: 6`, `firstScene: Hook`, `analyzedWithFFmpeg: false`
    - 첫 스크립트 예시:
      - `What if I told you your expensive moisturizer might not be working as hard as it could be?`

## FFmpeg scene detection 메모
- 현재 FFmpeg path는 YouTube / YouTube Shorts일 때만 시도된다.
  - `src/app/api/analyze/route.ts`
- 동작 후에도 장면 수를 안정화하려고 후처리가 많이 들어가 있다.
  - 2초 미만 간격 컷은 제거
  - 장면 수가 8개 초과면 6~8개 수준으로 다운샘플링
  - 장면 수가 4개 미만이면 균등 분할 fallback
- 그래서 체감상 “어떨 때 진짜 컷 감지로 됐고, 어떨 때 fallback이 됐는지”가 헷갈릴 수 있다.
- 현재 API 응답에는 `metadata.analyzedWithFFmpeg`만 있고, 실패 이유나 fallback 단계는 구체적으로 노출되지 않는다.

## 다음 개선 후보
- `metadata.sceneDetectionMethod` / `metadata.sceneDetectionFallbackReason`를 추가해서 UI나 로그에서 바로 확인 가능하게 만들기
- Instagram/TikTok/fallback 경로에 frame extractor + diff scoring 기반 컷 감지를 별도 보강하기
