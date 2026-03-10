# Event Contract And UTM Implementation Plan (2026-03-11)

## 배경
- 사용자는 기존 이벤트 운영 모델 문서를 바탕으로 표준 이벤트 v1 타입 계약과 UTM 저장 구현을 바로 진행하길 원한다.
- 현재 구조는 `dataLayer`와 `/api/events` 이중 적재 기반은 좋지만, 이벤트 타입 계약이 느슨하고 attribution 저장이 없다.

## 목표
- `logClientEvent()`에 표준 이벤트 v1 타입 계약을 도입한다.
- first-touch / latest-touch UTM 및 클릭 ID를 브라우저에 저장하고 주요 이벤트 payload에 자동 주입한다.
- 현재 핵심 이벤트 호출부가 새 타입 계약과 호환되도록 정리한다.
- 구현 완료 후 lint 검증과 결과 기록, 커밋/푸시까지 마친다.

## 범위
- 포함: 이벤트 타입 정의, attribution 유틸, 초기화 컴포넌트, 이벤트 허브 리팩터링, 호출부 정리, lint 검증
- 제외: 프로필/DB 레벨 attribution 영속화, GTM/Meta 콘솔 설정 변경, Lemon checkout UX 변경

## 변경 파일
- `plans/20260311_event_contract_and_utm_implementation.md`
- `src/lib/tracking/events.ts`
- `src/lib/tracking/attribution.ts`
- `src/components/common/TrackingInitializer.tsx`
- `src/components/common/index.ts`
- `src/app/layout.tsx`
- `src/lib/client-events.ts`
- 필요한 호출부 파일
- `context/context_20260311_*_event_contract_and_utm_implementation.md`

## 테스트
- `npm run lint`
- 핵심 이벤트 호출부 타입 체크
- attribution 초기화 컴포넌트가 브라우저 진입 시 실행되는지 코드 경로 검토

## 롤백
- 새 tracking 유틸과 이벤트 타입 계약 도입분을 제거하고 `src/lib/client-events.ts`를 이전 상태로 되돌리면 된다.

## 리스크
- 기존 이벤트 호출부가 새 타입 계약과 안 맞으면 lint 단계에서 다수 수정이 필요할 수 있다.
- attribution 필드 자동 주입은 payload 크기를 늘리므로 raw URL 같은 고카디널리티 필드와 함께 남용하지 않도록 주의해야 한다.

## 결과
- `logClientEvent()`에 `ClientEventName`/`ClientEventPayload` 기반 타입 계약을 도입했다.
- `src/lib/tracking/attribution.ts`를 추가해 first-touch/last-touch UTM 및 클릭 ID(`gclid`, `fbclid`, `ttclid`)를 로컬에 저장하고 이벤트 payload에 자동 주입되도록 연결했다.
- `TrackingInitializer`를 루트 레이아웃에 배치해 라우트/쿼리 변경 시 attribution 캡처가 실행되도록 구성했다.
- 호출부 타입 호환을 위해 하단 탭 이벤트 타입을 `ClientEventName`으로 정리했다.
- 검증:
  - `npx eslint src/lib/client-events.ts src/lib/tracking/events.ts src/lib/tracking/attribution.ts src/components/common/TrackingInitializer.tsx src/components/common/BottomTabBar.tsx src/app/layout.tsx` 통과
  - `npx tsc --noEmit --pretty false` 통과
- 연결 context: `context/context_20260311_060212_event_contract_and_utm_implementation.md`
