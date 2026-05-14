# Mobile Reference Generation Timeout Plan

## 배경
- iPhone Release 로컬 번들에서 YouTube URL paste 후 `AI Breakdown` 화면에 오래 머물고 레시피 보드가 열리지 않는 증상이 발생했다.
- 로컬 Next API 로그상 `/api/mobile/reference-recipe`는 `200`을 반환하지만 응답 시간이 30초 이상 걸린다.
- 모바일 데모 UX에서는 서버 분석이 느려도 촬영 가능한 레시피 보드로 빠르게 이동해야 한다.

## 목표
- Link mode 생성 화면이 API 응답 지연 때문에 멈춰 보이지 않게 한다.
- API가 빠르게 응답하면 기존 생성 결과를 사용한다.
- API가 느리거나 예외가 나면 로컬 fallback 레시피로 Recipe Board를 연다.
- 생성 결과 ready 상태에서 수동으로 보드를 여는 안전장치를 둔다.

## 범위
- In scope:
  - RN reference generation fallback helper export
  - Recipe create screen timeout/race 처리
  - ready splash 수동 CTA
  - targeted validation
- Out of scope:
  - 서버 분석 품질 개선
  - Supadata/Replicate latency 최적화
  - persisted backend save

## 변경 파일
- `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`
- `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- `context/context_20260510_mobile_reference_generation_timeout.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/lib/reference-recipe-generation.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- iPhone Release 재설치 후 YouTube paste smoke

## 롤백
- timeout race와 ready CTA를 제거하고 기존 `Promise.all([generationPromise, animationPromise])` 흐름으로 되돌린다.
- fallback helper export를 내부 함수로 되돌린다.

## 리스크
- API가 10초보다 늦게 성공하면 앱은 fallback 레시피를 먼저 연다.
- 데모 즉시성은 좋아지지만 느린 서버 생성 결과를 UI에 반영하는 후속 업데이트는 이번 범위에 포함하지 않는다.

## 결과
- RN Link mode generation에서 API 응답과 10초 fallback을 race하도록 수정했다.
- ready 상태에 `Open recipe board` 버튼을 추가해 자동 이동 실패 시에도 수동으로 열 수 있게 했다.
- 생성 draft에 `videoUrl`을 전달해 YouTube platform/source가 보존되도록 했다.
- iPhone 13 Pro (3)에 Release 로컬 번들을 재설치하고 앱 실행까지 완료했다.
- 연결 context: `context/context_20260510_mobile_reference_generation_timeout.md`
