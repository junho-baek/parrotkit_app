# Recipe 카드 제목 개선 + Paste Title 필수화

## 배경
- Recipes 카드에 URL이 제목으로 노출되어 시각적으로 거칠고 가독성이 떨어진다.
- 사용자가 레시피 제목을 직접 입력할 수 없어서 카드 식별성이 낮다.

## 목표
- Recipes 카드에서 URL 노출 제거.
- `/paste` 화면에서 레시피 제목(`title`)을 필수 입력으로 받는다.
- 저장된 레시피 목록에서 입력된 제목을 표시한다.

## 범위
- Paste 입력 폼(`URLInputForm`) 필드/검증 변경
- Recipes API 저장/조회 응답에 title 연결
- Recipes 카드 타이틀 렌더링 로직 정리(URL 제거)
- 빌드 검증

## 변경 파일
- `src/components/auth/URLInputForm.tsx`
- `src/app/api/recipes/route.ts`
- `src/components/auth/DashboardContent.tsx`
- `context/context_20260314_*.md`

## 테스트
- `npm run build`

## 롤백
- 타이틀 필수 검증 제거 후 기존 URL 기반 렌더링 복원
- API 조회/저장에서 title 관련 변경 제거
- 필요 시 `git revert <commit>`

## 리스크
- 기존 레시피에는 title 데이터가 없을 수 있어 fallback 문구가 노출된다.
- `references.description`을 title 저장 용도로 사용하므로 기존 description 의미와 혼용될 수 있다.

## 결과
- 완료
- Recipes 카드에서 URL 텍스트 제목 노출 제거
- Paste에서 `Recipe Title *` 필수 입력 적용
- `/api/recipes` 저장/조회에 title 연결
- 검증: `npm run build` 통과
- 연결 context: `context/context_20260314_040955_recipe_title_required_paste.md`
