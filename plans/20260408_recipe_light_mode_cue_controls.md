# Recipe 라이트 모드 Cue 컨트롤 개편 계획

## 배경
현재 `Recipe` 탭은 cue 편집 중심으로 많이 단순화됐지만, 선택 체크 아이콘과 `+ Add cue` 카피, 어두운 상단 크롬 때문에 아직 creator-facing 화면치고는 시스템 UI 느낌이 남아 있습니다. 사용자는 `Recipe`/`Analysis`는 완전한 밝은 모드, `Prompter`만 어두운 모드로 분리하고, cue 색상도 직접 바꾸길 원합니다.

## 목표
`Recipe` 탭을 완전한 화이트 베이스 cue board로 정리하고, 선택 상태는 카드 자체 스타일로만 표현하며, cue 색상을 직접 바꿀 수 있는 creator-friendly 편집 흐름을 제공합니다.

## 범위
- `src/components/common/RecipeResult.tsx`에서 scene detail 상단 크롬을 탭별 라이트/다크 톤으로 분리
- `src/components/common/RecipeResult.tsx`에서 recipe cue 카드의 체크 아이콘 제거 및 활성 카드 스타일 재정의
- `src/components/common/RecipeResult.tsx`에서 cue dot 클릭 시 accent color 순환/변경 지원
- `src/components/common/RecipeResult.tsx`에서 `+ Add cue` 버튼을 `+` 단일 버튼으로 축소
- `src/lib/recipe-scene.ts`, `src/types/recipe.ts`에서 cue accent color persistence 지원

## 변경 파일
- `plans/20260408_recipe_light_mode_cue_controls.md`
- `src/components/common/RecipeResult.tsx`
- `src/lib/recipe-scene.ts`
- `src/types/recipe.ts`
- `context/context_20260408_recipe_light_mode_cue_controls.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- recipe cue board의 색상 picker / 라이트 상단 크롬 / 단일 `+` 버튼 변경 이전 상태로 복원

## 리스크
- cue 색상 변경을 빠르게 순환시키는 방식은 직관적이지만, 사용자가 정확한 색상 의미를 처음엔 탐색해야 할 수 있습니다.

## 결과
- `Analysis`/`Recipe` 상단 크롬을 light mode로 전환하고, `Prompter`만 dark mode로 유지했습니다.
- recipe cue 카드는 체크 아이콘 없이 카드 surface만으로 active state를 보여주게 바꿨습니다.
- cue dot 클릭 시 accent color가 순환되며, 이 색상은 scene persistence에도 저장되게 했습니다.
- `+ Add cue`를 `+` 단일 버튼으로 축소하고, recipe 배경을 완전한 흰색으로 정리했습니다.
- 연결 context는 `context/context_20260408_recipe_light_mode_cue_controls.md`에 기록했습니다.
