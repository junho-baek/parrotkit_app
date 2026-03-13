# Context - Recipe 카드 URL 제거 + Paste Title 필수화

## 작업 배경
- Recipes 카드 제목에 URL 전체가 노출되어 가독성과 완성도가 떨어지는 UX 이슈가 있었다.
- 사용자 요청으로 `/paste` 화면에서 레시피 제목 입력을 필수화하고, 카드에는 입력한 제목을 표시하도록 개선이 필요했다.

## 변경 목표
- Recipes 카드에서 URL 기반 타이틀 제거.
- `/paste`에서 `Recipe Title`을 필수 입력으로 받기.
- 저장/조회 API 경로에서 title을 카드 표시까지 연결하기.

## 변경 내용
- 파일: `src/components/auth/URLInputForm.tsx`
  - `title` 상태 추가.
  - 제출 전 `title` 필수 검증 추가.
  - 폼에 `Recipe Title *` 입력 필드 추가 (`maxLength=80`, required).
  - 제출 버튼 비활성 조건에 `title` 공백 체크 추가.
  - `/api/recipes` 저장 payload에 `title` 전달.

- 파일: `src/app/api/recipes/route.ts`
  - `POST`에서 `title` 필수 검증 추가 (없으면 `400`).
  - 레시피 생성 시 참조(`references`)의 `description` 컬럼에 title 저장.
  - `GET`에서 `references(description)` 조인 조회 후 응답에 `title` 필드로 평탄화하여 반환.

- 파일: `src/components/auth/DashboardContent.tsx` (`Recipes` 영역)
  - `RecipeApiItem`에 `title?: string | null` 추가.
  - 카드 타이틀을 `recipe.title` 우선으로 표시하고, 없으면 `scene title`/`Untitled Recipe` fallback 사용.
  - 서브타이틀을 `Saved {date}` 또는 짧은 recipe id로 표시.
  - URL(`video_url`) 텍스트는 카드 본문에 직접 노출하지 않도록 제거.

## 검증
- `npm run build` 성공

## 결과
- 신규 생성 레시피는 Paste에서 입력한 title이 Recipes 카드에 표시된다.
- 기존 레시피(타이틀 미보유)는 fallback 타이틀로 렌더링되어 URL이 카드 제목에 그대로 노출되지 않는다.

## 메모
- 이번 작업은 DB 마이그레이션 없이 기존 `references.description` 컬럼을 title 저장 용도로 사용했다.
