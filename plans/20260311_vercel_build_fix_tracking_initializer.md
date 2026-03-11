# Vercel Build Fix: TrackingInitializer Suspense Boundary (2026-03-11)

## 배경
- Vercel `dev` 배포 빌드가 `/_not-found` 프리렌더 단계에서 실패했다.
- 오류는 `useSearchParams() should be wrapped in a suspense boundary at page "/404"`이며, 최근 `layout`에 추가된 `TrackingInitializer`가 원인으로 보인다.

## 목표
- `TrackingInitializer`의 현재 UTM 캡처 동작은 유지하면서 Next.js prerender 빌드 오류를 제거한다.
- 로컬 `npm run build`로 동일 오류가 재현되지 않는지 확인한다.

## 범위
- 포함: `layout`의 렌더 구조 수정, 로컬 프로덕션 빌드 검증, context 기록, git push
- 제외: 이벤트 계약/UTM 로직 자체 변경, GTM/GA4 설정 변경, QA 리포트 생성

## 변경 파일
- `plans/20260311_vercel_build_fix_tracking_initializer.md`
- `src/app/layout.tsx`
- `context/context_20260311_*_vercel_build_fix_tracking_initializer.md`

## 테스트
- `npm run build`

## 롤백
- `TrackingInitializer`를 감싼 `Suspense` 경계를 제거하면 원복 가능하다.

## 리스크
- `useSearchParams()`를 `layout` 트리 전역에서 사용하고 있어 Next.js 빌드 규칙에 민감하다.
- `Suspense`로 감싸도 런타임 동작 차이가 없는지 빌드 기준으로 우선 확인이 필요하다.

## 결과
- `src/app/layout.tsx`에서 `TrackingInitializer`를 `Suspense` 경계로 감싸 prerender 빌드 오류를 해결했다.
- `npm run build` 기준 `/_not-found` 정적 생성 포함 전체 프로덕션 빌드가 성공했다.
- 연결 context: `context/context_20260311_142559_vercel_build_fix_tracking_initializer.md`
