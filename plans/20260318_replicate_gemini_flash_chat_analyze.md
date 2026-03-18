# Replicate Gemini Flash Chat Analyze

## 배경
- 사용자가 `REPLICATE_API_TOKEN`을 `.env.local`에 저장해두었고, 챗봇 및 레시피 스크립트 생성 경로를 Replicate `google/gemini-2.5-flash`로 빠르게 전환하길 요청했다.
- 이번 작업은 Notion 업로드 없이 코드 변경, dev 기준 검증, git push까지 수행한다.

## 목표
- `/api/chat`을 Replicate `google/gemini-2.5-flash` 기반으로 전환한다.
- `/api/analyze`의 스크립트/scene description 생성 경로를 같은 모델로 전환한다.
- 기존 응답 파싱 계약을 유지해 UI 변경 없이 동작하도록 만든다.

## 범위
- Replicate server helper 추가
- `src/app/api/chat/route.ts`
- `src/app/api/analyze/route.ts`
- 작업 기록 문서 업데이트

## 변경 파일
- `src/lib/replicate.ts`
- `src/app/api/chat/route.ts`
- `src/app/api/analyze/route.ts`
- `plans/20260318_replicate_gemini_flash_chat_analyze.md`
- `context/context_20260318_*_replicate_gemini_flash_chat_analyze.md`

## 테스트
- `npx tsc --noEmit`
- 대상 파일 ESLint 확인
- `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- 로컬 API smoke test

## 롤백
- Replicate helper와 두 API route를 이전 Gemini SDK 구현으로 되돌린다.

## 리스크
- Replicate prediction sync 응답이 60초를 넘기면 polling 처리 안정성이 필요하다.
- 응답 형식이 배열 문자열이라 파싱 로직이 느슨하면 JSON extraction이 깨질 수 있다.

## 결과
- 완료
- 요약:
  - `google/gemini-2.5-flash` Replicate helper를 추가하고 `/api/chat`, `/api/analyze`의 AI 생성 경로를 전환했다.
  - dev 환경에서 `/api/chat`과 `/api/analyze` smoke test를 실행해 실제 Replicate 응답을 확인했다.
  - 현재 FFmpeg scene detection은 YouTube 계열에서만 시도되며, 실패/저신뢰 상황에서는 fallback 분할로 내려간다는 점을 문서화했다.
- 연결 context: `context/context_20260318_181739_replicate_gemini_flash_chat_analyze.md`
