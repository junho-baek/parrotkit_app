# Context: Vercel Build Fix - TrackingInitializer Suspense Boundary (2026-03-11 14:25 KST)

## 목적
- Vercel `dev` 배포에서 `/_not-found` prerender 중 발생한 `useSearchParams()` Suspense 경계 오류를 복구.

## 원인
- `src/components/common/TrackingInitializer.tsx`가 `useSearchParams()`를 사용한다.
- 이 컴포넌트가 `src/app/layout.tsx`에서 직접 렌더링되고 있었고, Next.js 16 prerender 규칙상 `Suspense` 경계 없이 `/_not-found` 페이지 렌더 경로에 포함되면서 빌드가 실패했다.

## 변경 내용
- `src/app/layout.tsx`
  - `Suspense`를 `react`에서 import
  - `<TrackingInitializer />`를 `<Suspense fallback={null}>...</Suspense>`로 감쌈

## 검증
- 실행: `npm run build`
- 결과: 성공
- 확인 포인트:
  - `/_not-found` 정적 페이지 생성 성공
  - 전체 app route 빌드 완료

## 판단
- attribution 캡처 로직은 유지하면서 빌드 오류만 최소 범위로 해결했다.
- 이번 수정은 runtime 이벤트 설계나 UTM 저장 동작에는 영향을 주지 않는다.

## 다음 액션
- 현재 커밋을 `dev`에 push한 뒤 Vercel 재배포 확인
- 재배포 후 동일 커밋 기준 build log가 통과하는지 확인
