# Apply Update 후 Script Drawer 복원 계획

## 배경
scene planner에서 `Apply Scene Update`를 누른 뒤, 예전에는 수정된 script drawer가 바로 열려 결과를 확인할 수 있었는데 현재는 chat sheet만 닫히고 끝납니다.

## 목표
`Apply Scene Update` 완료 직후 `recipe` 탭의 script drawer가 자동으로 열리도록 복원합니다.

## 범위
- `src/components/common/RecipeResult.tsx`의 `applySceneUpdate()` 후처리만 조정
- 기존 저장/persist/chat 동작은 유지

## 변경 파일
- `plans/20260408_apply_update_script_drawer_restore.md`
- `src/components/common/RecipeResult.tsx`
- `context/context_20260408_apply_update_script_drawer_restore.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- `applySceneUpdate()`의 `setActiveTab('recipe')` / `setScriptSheetOpen(true)` 후처리 제거

## 리스크
- 사용자가 다른 탭에서 apply해도 결과 확인을 위해 `recipe` 탭으로 이동하게 되어, 일부 상황에서는 탭 전환이 다소 갑작스럽게 느껴질 수 있습니다.

## 결과
- `Apply Scene Update` 후 자동으로 `recipe` 탭의 script drawer가 열리도록 복원했습니다.
- 연결 context는 `context/context_20260408_apply_update_script_drawer_restore.md`에 기록했습니다.
