# 관리자 KPI 대시보드 구축

## 배경
- 퍼포먼스 마케팅 및 UI/UX 개선을 위해 전환율/이탈률 중심의 관리자용 KPI 화면이 필요함.
- 현재 `/dashboard`는 `/home`으로 리다이렉트되고 있어 운영 지표를 한 곳에서 볼 수 없음.

## 목표
- 관리자 전용 대시보드에서 핵심 KPI를 조회 가능하게 한다.
- 전환율, 이탈률, 온보딩 완주율 등 퍼널 지표를 계산/표시한다.

## 범위
- 서버 API: `GET /api/admin/kpi`
  - 기간 파라미터(`days`) 기반 집계
  - 사용자/온보딩/레퍼런스/레시피/결제/이벤트 기반 KPI 계산
  - 퍼널(가입→온보딩 완료→레퍼런스 생성→레시피 생성→구매)
  - 트래픽 소스(UTM source) 분포
- UI: `/dashboard`
  - 기존 리다이렉트 제거
  - KPI 카드/퍼널/소스 분포/해석 인사이트 렌더링
- 접근제어
  - 로그인 사용자 중 관리자 이메일 허용 목록 기반 접근 제한

## 변경 파일
- `src/app/api/admin/kpi/route.ts` (신규)
- `src/app/dashboard/page.tsx`
- `plans/20260326_admin_marketing_dashboard.md`
- `context/context_20260326_*` (작업 후 기록)

## 테스트
- `npm run dev` 실행 상태에서 `/dashboard` 로딩 확인
- API 수동 확인: `/api/admin/kpi?days=7`, `/api/admin/kpi?days=30`
- 타입/린트 확인: `npm run lint`

## 롤백
- 신규 API 라우트 삭제 및 `/dashboard`를 기존 리다이렉트 구현으로 복원하면 즉시 롤백 가능.

## 리스크
- 이벤트 로깅 누락 구간에서는 퍼널 수치가 실제보다 낮게 보일 수 있음.
- 관리자 이메일 환경변수 미설정 시 접근이 차단될 수 있음.

## 결과
- 구현 완료:
  - `GET /api/admin/kpi` 신규 추가
  - `/dashboard`를 관리자 KPI 대시보드로 교체
  - 관리자 이메일 allow-list 접근 제어 적용
- 검증 결과:
  - `npm run lint -- src/app/api/admin/kpi/route.ts src/app/dashboard/page.tsx` 통과
  - 변경 파일 타입/문법 오류 없음 확인
- 연결 context:
  - `context/context_20260326_121500_admin_kpi_dashboard.md`
