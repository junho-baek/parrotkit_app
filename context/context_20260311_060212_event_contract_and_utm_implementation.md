# Context: Event Contract v1 + UTM 저장 구현 (2026-03-11 06:02 KST)

## 작업 배경
- 사용자 요청: 이벤트 운영 모델 문서를 기반으로 표준 이벤트 v1 타입 계약과 UTM 저장을 코드에 바로 반영.
- 목표: GTM/GA4/Meta 운영을 위한 이벤트 계약을 코드 레벨에서 안정화하고, attribution(UTM/클릭ID) 자동 주입 기반을 마련.

## 변경 사항

### 1) 표준 이벤트 타입 계약 도입
- 파일: `src/lib/tracking/events.ts`
- 내용:
  - `ClientEventPayloadMap` 추가
  - `ClientEventName`, `ClientEventPayload<T>`, `ClientEventPayloadWithContext<T>` 타입 추가
  - 운영 이벤트 이름 상수(`STANDARD_EVENT_NAMES`)와 검사 함수(`isClientEventName`) 추가

### 2) UTM/클릭 ID attribution 저장 유틸 추가
- 파일: `src/lib/tracking/attribution.ts`
- 내용:
  - first-touch 키: `parrotkit_tracking_first_touch_v1`
  - last-touch 키: `parrotkit_tracking_last_touch_v1`
  - 저장 파라미터: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `fbclid`, `ttclid`
  - 이벤트 자동 주입 컨텍스트 생성 함수: `getTrackingAutoContext()`

### 3) 루트에서 attribution 초기화 연결
- 파일: `src/components/common/TrackingInitializer.tsx`
- 파일: `src/components/common/index.ts`
- 파일: `src/app/layout.tsx`
- 내용:
  - 라우트/쿼리 변경 시 `captureMarketingAttribution()` 실행
  - `RootLayout`에 `TrackingInitializer` 삽입

### 4) 이벤트 허브 타입화
- 파일: `src/lib/client-events.ts`
- 내용:
  - `logClientEvent()`를 제네릭 시그니처로 변경
  - payload 빌드 시 attribution + `page_path` + `auth_user_id` 자동 병합

### 5) 호출부 타입 정리
- 파일: `src/components/common/BottomTabBar.tsx`
- 내용:
  - 하단 탭 이벤트명을 `ClientEventName`으로 타입 고정

## 검증
- 실행: `npx eslint src/lib/client-events.ts src/lib/tracking/events.ts src/lib/tracking/attribution.ts src/components/common/TrackingInitializer.tsx src/components/common/BottomTabBar.tsx src/app/layout.tsx`
- 결과: 통과
- 실행: `npx tsc --noEmit --pretty false`
- 결과: 통과

## 메모
- 이번 턴은 코드 구현/타입 안정화 범위만 반영.
- GTM/GA4/Meta 콘솔 publish와 Lemon 구독 라이프사이클 UX(업그레이드/취소/환불)는 운영 설계/후속 구현 범위로 유지.

## 연계 문서
- plan: `plans/20260311_event_contract_and_utm_implementation.md`
