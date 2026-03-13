# Context - My Page 통계 카드 실데이터 연동

## 작업 일시
- 2026-03-13 Asia/Seoul

## 배경
- `/my` 화면 통계 카드가 하드코딩된 목데이터(12 / 8 / 2.5K)로 표시되고 있었음.
- 사용자 요청으로 계정별 실제 데이터 연동이 필요했음.

## 수행 내용
1. `GET /api/user/profile` 확장
   - 파일: `src/app/api/user/profile/route.ts`
   - 기존 `user` 응답 유지 + `stats` 추가:
     - `references`: `references` 테이블 사용자별 count
     - `recipes`: `recipes` 테이블 사용자별 count
     - `views`: `event_logs` 테이블 사용자별 `event_name like 'view_%'` count
   - 집계는 `Promise.all`로 병렬 실행, count 조회 오류 시 예외 처리.

2. My Page UI 연결
   - 파일: `src/components/auth/DashboardContent.tsx`
   - `Settings` 컴포넌트에 `stats` state 추가.
   - `/api/user/profile` 응답의 `stats`를 파싱(`parseStatCount`)해 카드에 반영.
   - 표시 포맷은 `Intl.NumberFormat(..., { notation: 'compact' })`로 통일해 `2.5K` 같은 형식 유지.

## 검증
- 실행: `npm run build`
- 결과: 성공 (build / TypeScript / prerender 통과)

## 메모
- 이번 변경은 DB schema 변경 없이 기존 테이블 count 조회만 추가했으므로 `npm run db:schema` 대상 아님.
- `views` 정의는 현재 제품 기준으로 `view_*` 이벤트 발생 수임. 지표 정의 변경 시 해당 쿼리만 조정하면 됨.
