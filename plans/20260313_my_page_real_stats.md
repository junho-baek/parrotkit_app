# My Page 통계 카드 실제 데이터 연동

## 배경
- `/my` 화면의 통계 카드(References/Recipes/Views)가 하드코딩된 목데이터(12/8/2.5K)로 표시되고 있음.
- 사용자는 계정별 실제 데이터 연동을 요청함.

## 목표
- My Page 통계 카드를 사용자별 실데이터로 교체.

## 범위
- `GET /api/user/profile` 응답에 통계 필드 추가:
  - references: `references` 테이블 사용자별 count
  - recipes: `recipes` 테이블 사용자별 count
  - views: `event_logs` 테이블 사용자별 `view_*` 이벤트 count
- `Settings`(My Page) UI가 해당 통계를 표시하도록 변경.

## 변경 파일
- `src/app/api/user/profile/route.ts`
- `src/components/auth/DashboardContent.tsx`
- `plans/20260313_my_page_real_stats.md`
- `context/context_20260313_*.md` (작업 후 기록)

## 테스트
- `npm run build`
- 수동 확인:
  - `/my` 진입 시 카드 숫자가 고정값이 아닌 계정별 값으로 노출되는지 확인

## 롤백
- 위 파일 변경 revert 시 기존 목데이터 표시로 즉시 복구 가능.

## 리스크
- `views` 지표 정의를 `view_*` 이벤트 수로 두기 때문에, 추후 분석 정의가 바뀌면 기준 변경이 필요할 수 있음.

## 결과
- 구현 완료:
  - `/api/user/profile`에 `stats` 집계 응답 추가
    - `references` = references count
    - `recipes` = recipes count
    - `views` = event_logs 중 `view_*` 이벤트 count
  - `Settings`(My Page) 카드가 목데이터 대신 실데이터 렌더링하도록 변경
  - 숫자는 compact 포맷(`1.2K`)으로 표시
- 검증 결과:
  - `npm run build` 통과
- 연결 context:
  - `context/context_20260313_171030_my_page_real_stats_integration.md`
