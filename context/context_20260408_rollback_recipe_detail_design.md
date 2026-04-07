# 롤백 기록: 레시피 상세 디자인 복귀

## 작업 요약
- 사용자 피드백(과도한 박스/카피) 반영으로 `a17e723`을 되돌렸습니다.
- 롤백으로 `RecipeResult`, `RecipeVideoPlayer`, `CameraShooting`의 최근 디자인 변경을 취소했습니다.
- 기존에 적용된 프롬프터 저장 안정성 개선(`cc35abf` 기반) 자체는 유지됩니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx` (복귀)
- `src/components/common/RecipeVideoPlayer.tsx` (복귀)
- `src/components/common/CameraShooting.tsx` (복귀)
- `plans/20260408_recipe_detail_design_review.md` (삭제)
- `plans/20260408_rollback_recipe_detail_design.md` (신규)

## 주요 변경
- `git revert a17e723 --no-edit` 실행
- 컨텍스트 충돌 파일은 유지하면서 충돌 해결 (`context/context_20260408_050508_recipe_detail_design_review.md`)
- 새 작업 플랜 문서 추가

## 검증
- `git log --oneline --max-count=5`로 커밋 흐름 확인
- 현재 브랜치 상태: `dcbaaca`가 최신 커밋, 이전 `a17e723`의 디자인 변경이 되돌아간 상태

## 상태
- 배포 검증은 사용자 요청 시에 실행
