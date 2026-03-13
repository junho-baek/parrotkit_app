# Context - Recipes 카드 ⋯ 메뉴 Edit/Delete

## 작업 배경
- Recipes 카드 우상단 날짜 배지 대신 액션 진입점이 필요하다는 요청이 있었다.
- 사용자 요구: 점 세 개(`⋯`) 메뉴를 통해 `Edit`(제목 수정) / `Delete`(레시피 삭제) 제공.

## 변경 목표
- 날짜 배지를 메뉴 버튼으로 교체.
- 메뉴에서 제목 수정/삭제를 즉시 수행.
- 기존 카드 클릭/`View Recipe` 이동 플로우는 유지.

## 변경 내용
- 파일: `src/components/auth/DashboardContent.tsx` (`Recipes` 영역)
  - 상태 추가:
    - `openMenuRecipeId`: 현재 열린 카드 메뉴 ID
    - `processingRecipeId`: 수정/삭제 API 처리 중 카드 ID
  - 카드 우상단 `topRightBadge`를 날짜 뱃지에서 `⋯` 메뉴로 교체.
  - 메뉴 액션 추가:
    - `Edit title`: `prompt` 기반 제목 입력 -> PATCH API 호출 -> 성공 시 로컬 상태 업데이트
    - `Delete`: `confirm` 후 DELETE API 호출 -> 성공 시 카드 목록에서 제거
  - 클릭 전파 제어:
    - 메뉴/메뉴 아이템 클릭 시 preview 클릭으로 전파되지 않도록 `stopPropagation` 적용
  - 기존 카드 진입(`handleView`) 시 열린 메뉴 자동 닫힘 처리.

- 파일: `src/app/api/recipes/[id]/route.ts`
  - `PATCH` 핸들러 추가:
    - `title` 필수 검증(빈 문자열 400)
    - 레시피 소유권 확인(`recipes` + `user_id`)
    - `reference_id`가 있으면 `references.description` 업데이트
    - `reference_id`가 없으면 `references` 신규 생성 후 `recipes.reference_id` 연결
    - 성공 응답: `{ success: true, title }`

## Supabase 작업 기록
- 규칙에 따라 작업 시작 시 `npm run db:schema` 실행 시도.
- 결과: 실패 (`EHOSTUNREACH 0.0.0.34:5432`), 네트워크/DB 호스트 연결 불가로 스키마 스냅샷 갱신 불가.
- 스키마 레퍼런스 확인: `src/types/supabase.generated.ts` 및 최신 스냅샷 컨텍스트(`context_20260306_041050_supabase_schema_snapshot.md`).

## 검증
- `npm run build` 성공

## 결과
- Recipes 카드에서 날짜 배지 대신 `⋯` 메뉴를 통해 제목 수정/삭제 가능.
- 제목 수정은 즉시 카드 UI에 반영되고, 삭제는 목록에서 즉시 제거.
