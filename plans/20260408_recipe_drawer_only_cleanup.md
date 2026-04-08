# Recipe 탭 Drawer 중심 정리 계획

## 배경
`Recipe` 탭 하단에 script drawer가 이미 존재하는데도 상단 `Cut Goal` 카드와 `Recommended Script` 섹션이 남아 있어 정보가 중복되고 화면이 무겁습니다.

## 목표
`Recipe` 탭을 drawer + prompter cue 중심으로 단순화해, 본문에서는 중복되는 recipe summary와 script 리스트를 제거합니다.

## 범위
- `src/components/common/RecipeResult.tsx`에서 `Cut Goal` 상단 카드 제거
- `src/components/common/RecipeResult.tsx`에서 `Recommended Script` 섹션 제거
- 기존 drawer와 cue 편집 동작은 유지

## 변경 파일
- `plans/20260408_recipe_drawer_only_cleanup.md`
- `src/components/common/RecipeResult.tsx`
- `context/context_20260408_recipe_drawer_only_cleanup.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- `renderRecipeDetail()`의 상단 `Cut Goal` 카드와 `Recommended Script` 섹션 복원

## 리스크
- recipe 탭 본문 정보가 매우 간결해져, 일부 사용자는 상단 요약이 사라진 걸 허전하게 느낄 수 있습니다.

## 결과
- `Cut Goal` 상단 카드와 `Recommended Script` 섹션을 제거했습니다.
- `Recipe` 탭 본문은 cue 카드 중심으로 단순화됐고, script는 drawer에서만 확인하도록 정리했습니다.
- recipe 배경을 밝은 톤으로 전환하고, 큰 내부 박스를 제거했습니다.
- `+ Add cue` 추가와 legacy/system block dedupe 가드까지 포함해 cue board 중심 구조로 정리했습니다.
- 연결 context는 `context/context_20260408_recipe_drawer_only_cleanup.md`에 기록했습니다.
