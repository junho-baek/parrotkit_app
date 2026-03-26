# Admin KPI Dashboard 구축

## 작업 개요
- 관리자 대시보드(`/dashboard`)를 리다이렉트 페이지에서 실데이터 기반 KPI 화면으로 전환.
- 퍼포먼스 마케팅/UX 개선을 위한 핵심 지표(전환율, 이탈률, 퍼널, UTM 소스 분포, 일별 추이)를 조회 가능하도록 API와 UI를 추가.

## 주요 변경
- 신규 API: `GET /api/admin/kpi`
  - 파일: `src/app/api/admin/kpi/route.ts`
  - 기능:
    - 기간 파라미터 `days` 지원(1~90일, 기본 30일)
    - `profiles`, `references`, `recipes`, `event_logs` 집계
    - 핵심 KPI:
      - Signup→Paid 전환율
      - Churn rate(기간 내 churn 이벤트 기반)
      - Onboarding 완료율
      - Reference/Recipe 활성화율
    - 퍼널 단계:
      - Signup → Onboarding Completed → Reference Created → Recipe Created → Paid Conversion
    - UTM source 분포 상위 5개
    - 일별 Signups/Purchases 추이
  - 접근 제어:
    - 로그인 사용자 + `ADMIN_DASHBOARD_EMAILS`(또는 `ADMIN_EMAILS`) 이메일 allow-list 기반
    - 미허용 시 403 반환

- 대시보드 UI 교체
  - 파일: `src/app/dashboard/page.tsx`
  - 기능:
    - 기간 토글(7/30/90일)
    - KPI 카드
    - 퍼널 단계별 conversion/drop-off
    - 트래픽 소스 분포 바
    - 액션 인사이트 카드
    - 일별 Signups vs Purchases 미니 차트

- 작업 계획 문서 추가
  - `plans/20260326_admin_marketing_dashboard.md`

## 검증
- `npm run lint -- src/app/api/admin/kpi/route.ts src/app/dashboard/page.tsx`
  - 통과
- `get_errors` 기준 변경 파일 타입/문법 오류 없음 확인

## 운영 메모
- 관리자 접근을 위해 `.env.local`에 아래 중 하나 설정 필요:
  - `ADMIN_DASHBOARD_EMAILS=user1@example.com,user2@example.com`
  - 또는 `ADMIN_EMAILS=...`
- 현재 churn은 이벤트 기반 추정치이며, 결제 시스템의 정확한 구독 lifecycle 정의가 확정되면 계산식을 세분화 가능.
