# Context - Shooting UI 정리 및 진짜 인라인 편집

## 작업 요약
- `Recipe`와 `Prompter` cue 편집 모두 더블클릭 시 기존 카드 폭/높이를 유지한 채 같은 자리에서 바로 수정되도록 바꿨습니다.
- `Prompter` 탭 이름을 `Shooting`으로 바꾸고, shooting 탭에서는 agent FAB가 뜨지 않도록 정리했습니다.
- shooting 화면 내부의 `Back` 버튼과 `Prompter` badge, 가이드 선/원 오버레이를 제거했습니다.
- shooting에서는 cue 최소 scale을 더 낮췄고, 드래그 중 trash zone으로 보내 custom cue 삭제 또는 기본 cue 숨김이 가능해졌습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `src/lib/recipe-scene.ts`
- `plans/20260408_shooting_ui_cleanup_and_true_inline_edit.md`

## 구현 메모
- 편집 중에는 기존 텍스트를 투명하게 유지하고 동일 위치에 absolute textarea를 덮어 카드 크기 변형을 막았습니다.
- recipe 상단 tab label은 internal key 대신 display label helper로 렌더링하게 바꿨습니다.
- shooting 탭에서만 chat agent FAB를 숨기도록 조건을 추가했습니다.
- trash zone drop은 custom block이면 remove, 기본 block이면 visible false로 처리했습니다.
- scale clamp는 UI와 normalize 단계 모두 `0.35`까지 허용하도록 맞췄습니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- 아주 작은 cue를 많이 만든 뒤 겹쳐서 배치하면 다시 찾기 어려울 수 있어, 이후에는 reset/reveal all 같은 보조 동작이 있으면 더 좋아질 수 있습니다.
