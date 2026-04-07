# 롤백 계획

## 배경
최근 `polish(recipe): redesign detail analysis and prompter flow` 커밋(`a17e723`)에서 분석/레시피/프롬프터 화면이 과하게 복잡해졌고 카피량이 늘어났다는 피드백이 들어왔습니다.

## 목표
기존 버전의 레이아웃/카피 감각으로 되돌려 사용자 체감 피로도를 낮추고, 기존에 이미 해결된 프롬프터 저장 안정성은 유지합니다.

## 범위
- `a17e723` 커밋 되돌리기
- 영향 파일:
  - `src/components/common/RecipeResult.tsx`
  - `src/components/common/RecipeVideoPlayer.tsx`
  - `src/components/common/CameraShooting.tsx`
- 동일 작업으로 함께 변경된 작업 문서 변경도 되돌려 일치성 유지

## 변경 파일
- `plans/20260408_rollback_recipe_detail_design.md` (신규)
- `context/context_20260408_rollback_recipe_detail_design.md` (작성 예정)
- Git `revert`로 `a17e723` 결과 반영

## 테스트
- 기본 검증은 `dev`에서 화면 진입 흐름을 확인
- 추가 빌드/테스트는 사용자 요청 시 실행

## 롤백
- `git revert a17e723`

## 리스크
- `d8e105d`의 문서 기록은 유지될 수 있어 기록의 가독성은 약간 떨어질 수 있음
- 롤백으로 복잡한 레이아웃은 사라지지만 최신 화보성 스타일도 함께 사라짐
