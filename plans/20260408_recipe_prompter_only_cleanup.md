# Recipe 탭 Prompter 중심 정리 계획

## 배경
creator가 보는 `Recipe` 탭에서 `Must Include / Must Avoid`와 `Prompter Picks / 2 visible` 같은 시스템 용어가 남아 있어 화면이 복잡하고 제작자 관점과 어긋납니다.

## 목표
`Recipe` 탭을 prompter cue 중심으로 단순화하고, cue 카드를 더블클릭해서 바로 수정할 수 있게 만듭니다.

## 범위
- `src/components/common/RecipeResult.tsx`의 recipe detail 섹션 정리
- `Must Include / Must Avoid` 제거
- prompter cue 카드의 creator-facing 보조 카피 제거
- prompter cue 카드 더블클릭 편집 추가

## 변경 파일
- `plans/20260408_recipe_prompter_only_cleanup.md`
- `src/components/common/RecipeResult.tsx`
- `context/context_20260408_recipe_prompter_only_cleanup.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- recipe detail의 `Must Include / Must Avoid` 섹션 복원
- prompter cue card의 더블클릭 편집 상태 제거

## 리스크
- cue card 단일 클릭 토글과 더블클릭 편집을 함께 지원하므로, 사용자가 처음엔 상호작용 방식을 한 번 익혀야 할 수 있습니다.

## 결과
- `Recipe` 탭에서 `Must Include / Must Avoid`를 제거하고 cue 카드만 남겼습니다.
- `Prompter Picks` 계열 시스템 용어를 제거했고, cue 카드는 더블클릭으로 inline 수정할 수 있게 했습니다.
- legacy/system block이 현재 세션에 남아 있어도 UI에서 다시 보이지 않도록 필터 가드를 추가했습니다.
- 연결 context는 `context/context_20260408_recipe_prompter_only_cleanup.md`에 기록했습니다.
