# Context - Apply Update Script Drawer Restore

## 작업 요약
- `Apply Scene Update` 실행 후 chat sheet만 닫히던 흐름을 수정해, 결과를 바로 확인할 수 있도록 `recipe` 탭의 script drawer가 자동으로 열리게 했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_apply_update_script_drawer_restore.md`

## 구현 메모
- `applySceneUpdate()`에서 scene patch와 persistence는 그대로 두고, 후처리로 `closeChatAssistant()` 다음에 `setActiveTab('recipe')`, `setScriptSheetOpen(true)`를 추가했습니다.
- 이로써 apply 이후 updated creator script를 바로 drawer에서 확인할 수 있습니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- analysis/propmter 탭에서 apply한 경우에도 결과 확인을 위해 recipe 탭으로 이동합니다.
