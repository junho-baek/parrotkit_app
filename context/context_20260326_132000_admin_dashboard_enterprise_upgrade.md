# Admin Dashboard 실무형 업그레이드

## 작업 개요
- 관리자 대시보드를 실무 의사결정용으로 확장해 퍼널/전환/이탈/활성/소스 성과를 한 화면에서 확인 가능하게 개선.

## 주요 변경
- API 고도화: `src/app/api/admin/kpi/route.ts`
  - 기존 KPI 유지 + 확장
    - paid user ratio
    - DAU/WAU/MAU
    - stickiness(DAU/MAU)
    - returning users/rate (30d proxy)
    - avg events per active user (30d)
    - references/recipes per new user
  - 퍼널 유지: Signup → Onboarding → Reference → Recipe → Paid
  - source 성과 추가: source별 사용자 수, 유료 전환율, 레시피 활성화율
  - top events 추가: 기간 내 event_name 상위 집계
  - trend 확장: signups/purchases + activeUsers/recipes 일별 시계열
  - insight 강화: severity(positive/warning/critical) 포함 운영 인사이트 제공

- UI 고도화: `src/app/dashboard/page.tsx`
  - Executive KPI 카드 확장(전환/이탈/활성/효율)
  - Funnel 블록 + Traffic Sources + Action Insights 유지/강화
  - Source Performance 테이블 추가
  - Top Events 카드 추가
  - Daily Trend 차트 확장(4지표 동시 표시)

- 계획 문서 추가
  - `plans/20260326_admin_dashboard_enterprise_upgrade.md`

## 검증
- `npm run lint -- src/app/api/admin/kpi/route.ts src/app/dashboard/page.tsx` 통과
- 변경 파일 `get_errors` 결과 오류 없음
- `npm run dev` 부팅 확인 (Next.js ready)

## 운영 메모
- 관리자 접근은 기존과 동일하게 `ADMIN_DASHBOARD_EMAILS`(또는 `ADMIN_EMAILS`) 기반.
- source/리텐션 지표는 event payload 및 event_logs 품질에 영향을 받는 운영 프록시 지표임.
