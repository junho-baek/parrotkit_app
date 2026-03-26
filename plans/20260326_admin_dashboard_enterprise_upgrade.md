# 관리자 대시보드 실무형 업그레이드

## 배경
- 기존 관리자 대시보드는 기본 KPI/퍼널/소스/트렌드 수준으로 동작하지만, 실무 마케팅/UX 의사결정에 필요한 세그먼트/활성/리텐션/소스별 성과 지표가 부족함.

## 목표
- 한 화면에서 핵심 KPI를 우선순위대로 빠르게 파악할 수 있게 한다.
- 퍼널 분석과 함께 소스별 전환, 활성도, 이탈 리스크를 동시에 읽을 수 있게 한다.

## 범위
- `GET /api/admin/kpi` 고도화
  - KPI 확장: DAU/WAU/MAU, stickiness, returning rate, avg events/active user, paid ratio
  - 퍼널 유지 + 구간별 개선 포인트 계산
  - 소스 성과: source별 유입 사용자 수, 유료 전환율, 레시피 활성화율
  - 이벤트 Top 목록
  - 일별 트렌드 확장(signups/purchases/active users/recipes)
- `/dashboard` UI 고도화
  - Executive KPI 보드
  - 퍼널 상세 + 소스별 성과 표 + 이벤트 Top + 트렌드 복합 차트
  - 인사이트/알람 카드 강화

## 변경 파일
- `src/app/api/admin/kpi/route.ts`
- `src/app/dashboard/page.tsx`
- `plans/20260326_admin_dashboard_enterprise_upgrade.md`
- `context/context_20260326_*` (작업 후 기록)

## 테스트
- `npm run lint -- src/app/api/admin/kpi/route.ts src/app/dashboard/page.tsx`
- `get_errors`로 변경 파일 오류 점검
- `npm run dev` 부팅 확인

## 롤백
- 해당 두 파일을 이전 커밋으로 리버트하면 기존 대시보드로 즉시 복귀 가능.

## 리스크
- source 성과는 event payload의 `utm_source` 기록 품질에 따라 편차가 생김.
- returning rate는 현재 이벤트 로그 기준 프록시 지표이며 제품 정의와 완전히 일치하지 않을 수 있음.

## 결과
- 구현 완료:
  - `GET /api/admin/kpi` 응답을 실무형 KPI 구조로 확장
  - `/dashboard`를 KPI/퍼널/소스성과/이벤트/트렌드 통합 분석 화면으로 고도화
- 검증 결과:
  - `npm run lint -- src/app/api/admin/kpi/route.ts src/app/dashboard/page.tsx` 통과
  - `get_errors` 기준 변경 파일 오류 없음
  - `npm run dev` 부팅 Ready 확인
- 연결 context:
  - `context/context_20260326_132000_admin_dashboard_enterprise_upgrade.md`
