# Fix FAQ Tracking Build

## 작업 개요
- Vercel 배포가 FAQ 페이지의 `view_faq` 이벤트 타입 누락으로 실패하고 있어, 트래킹 타입 정의만 최소 수정으로 보강했다.

## 주요 변경
- `src/lib/tracking/events.ts`
  - `ClientEventPayloadMap`에 `view_faq` 추가
  - payload shape: `event_category?`, `page_title`, `faq_count`
  - `STANDARD_EVENT_NAMES`에 `view_faq` 추가

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/lib/tracking/events.ts src/app/faq/page.tsx`
  - 통과

## 메모
- 현재 워킹트리에는 FAQ/마이페이지 관련 다른 변경도 남아 있지만, 이번 커밋에는 빌드 blocker 해소를 위한 이벤트 타입 정의만 포함한다.
