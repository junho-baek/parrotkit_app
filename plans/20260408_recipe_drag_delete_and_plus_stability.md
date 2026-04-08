# Recipe drag delete 및 plus 안정화

## 배경
- Shooting에는 cue 삭제 흐름이 있었는데, 최근 eye-off visibility panel이 들어가면서 삭제 affordance를 유지할지 다시 정리할 필요가 생겼다.
- Recipe 탭의 cue 보드에서도 드래그로 cue를 끌어 삭제/비활성화하는 제스처가 있으면 작업 흐름이 더 빨라진다.
- Recipe 탭의 plus 버튼은 편집 중 blur/re-render와 겹치면 가끔 클릭이 씹히는 느낌이 있었다.

## 목표
- Shooting의 drag delete affordance를 유지한다.
- Recipe 탭 cue 카드에도 drag-and-drop 삭제를 추가한다.
- Recipe 탭 plus 버튼이 편집 중에도 안정적으로 새 cue를 추가하도록 보강한다.

## 범위
- Shooting drag delete affordance 복원
- Recipe cue board drag delete 추가
- Recipe cue add button 안정화
- 문서화 및 dev 반영

## 변경 파일
- src/components/common/CameraShooting.tsx
- src/components/common/RecipeResult.tsx
- plans/20260408_recipe_drag_delete_and_plus_stability.md
- context/context_20260408_recipe_drag_delete_and_plus_stability.md

## 테스트
- 사용자 요청에 따라 별도 build/test는 수행하지 않음

## 롤백
- Shooting trash affordance와 Recipe cue drag/delete, plus 안정화 관련 커밋만 되돌리면 된다.

## 리스크
- Recipe drag-and-drop은 모바일보다 데스크톱 웹에서 더 자연스럽다.
- default cue는 완전 삭제 대신 inactive 처리라 사용자 기대와 다를 수 있다.

## 결과
- Shooting trash affordance 복원
- Recipe cue drag-and-drop delete 추가
- Recipe plus 안정화
- context: context/context_20260408_recipe_drag_delete_and_plus_stability.md
