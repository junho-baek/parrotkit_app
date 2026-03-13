# Recipes 카드 메뉴(⋯) 기반 Edit/Delete 추가

## 배경
- Recipes 카드 우상단 날짜 배지는 정보 전달 대비 액션 가치가 낮다.
- 사용자 요청: 우상단에 점 세 개 메뉴를 두고 `Edit` / `Delete` 액션을 제공.

## 목표
- 날짜 배지 대신 `⋯` 메뉴 UI를 제공한다.
- 메뉴에서 레시피 제목 수정(Edit)과 삭제(Delete)를 수행한다.
- 기존 카드 재생/열기(View Recipe) 동작은 유지한다.

## 범위
- Recipes 카드 UI 메뉴 추가
- 레시피 제목 수정 API(PATCH) 추가
- 레시피 삭제 UI 액션 연결
- 빌드 검증

## 변경 파일
- `src/components/auth/DashboardContent.tsx`
- `src/app/api/recipes/[id]/route.ts`
- `context/context_20260314_*.md`

## 테스트
- `npm run build`

## 롤백
- 카드 우상단 메뉴 제거 후 기존 날짜 배지 렌더링 복원
- PATCH 핸들러 제거
- 메뉴 액션 상태 로직 제거

## 리스크
- 카드 오버레이 안의 메뉴 클릭 이벤트가 preview 클릭으로 전파될 수 있음.
- 제목 미입력/긴 문자열 처리 UX가 명확하지 않으면 사용성 저하 가능.

## 결과
- 완료
- Recipes 카드 우상단을 날짜 배지에서 `⋯` 메뉴로 교체
- 메뉴 액션 `Edit title` / `Delete` 구현 완료
- API: `/api/recipes/[id]`에 `PATCH` 추가(제목 수정)
- 검증: `npm run build` 통과
- 연결 context: `context/context_20260314_042241_recipe_card_menu_edit_delete.md`
