# Fix FAQ Tracking Build

## 배경
- Vercel 배포가 `src/app/faq/page.tsx`의 `view_faq` 이벤트 타입 누락으로 실패했다.
- 현재 FAQ 작업 관련 변경이 워킹트리에 섞여 있어, 이번에는 빌드 실패 원인만 최소 수정으로 해결해야 한다.

## 목표
- `view_faq`를 클라이언트 이벤트 타입 맵과 표준 이벤트 목록에 추가해 배포 타입 에러를 해소한다.

## 범위
- `src/lib/tracking/events.ts`
- 작업 기록 문서 작성

## 변경 파일
- `plans/20260322_fix_faq_tracking_build.md`
- `src/lib/tracking/events.ts`
- `context/context_20260322_*_fix_faq_tracking_build.md`

## 테스트
- `npx tsc --noEmit`
- 필요 시 대상 파일 ESLint

## 롤백
- `view_faq` 이벤트 정의 제거

## 리스크
- FAQ 페이지 payload shape와 이벤트 타입 정의가 맞지 않으면 다른 타입 에러가 이어질 수 있다.

## 결과
- 완료
- 요약:
  - `view_faq` 이벤트를 `ClientEventPayloadMap`과 `STANDARD_EVENT_NAMES`에 추가했다.
  - FAQ 페이지의 `logClientEvent('view_faq', ...)` 호출이 타입과 맞춰져 배포 빌드 blocker를 제거했다.

## 연결 Context
- `context/context_20260322_231200_fix_faq_tracking_build.md`
