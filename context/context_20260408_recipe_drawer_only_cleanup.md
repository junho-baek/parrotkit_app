# Context - Recipe Drawer Only Cleanup

## 작업 요약
- `Recipe` 탭에서 하단 drawer와 중복되던 상단 `Cut Goal` 카드와 `Recommended Script` 섹션을 제거했습니다.
- 결과적으로 본문은 prompter cue 카드 중심으로 남고, script 내용은 drawer에서만 확인하도록 정리됐습니다.
- recipe 본문 배경을 밝게 바꾸고, 큰 내부 박스를 걷어내고, `+ Add cue`로 사용자가 직접 cue를 추가할 수 있게 했습니다.
- cue 카드는 타입 텍스트 대신 ParrotKit 계열 색상으로 구분하고, legacy/system block은 UI에서 다시 숨기도록 가드했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_recipe_drawer_only_cleanup.md`

## 구현 메모
- `renderRecipeDetail()`의 hero-style recipe summary block 제거
- `Recommended Script` section 제거
- cue 카드는 color-coded tile로 재구성하고, 더블클릭 inline edit는 유지
- `+ Add cue` 버튼으로 custom keyword cue를 바로 추가 가능
- 오래된 fallback block / 중복 content는 `recipe-scene` + UI 양쪽에서 정리

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- recipe 탭 상단 정보가 거의 사라져서 첫 인상은 더 단순하지만, 장면 맥락을 본문에서 바로 읽기는 어려워질 수 있습니다.
