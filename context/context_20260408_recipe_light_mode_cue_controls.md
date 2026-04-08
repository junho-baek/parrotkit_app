# Context - Recipe 라이트 모드 Cue 컨트롤 개편

## 작업 요약
- scene detail 상단 크롬을 탭별로 나눠서 `Analysis`/`Recipe`는 밝은 모드, `Prompter`만 어두운 모드로 유지했습니다.
- `Recipe` 탭 cue 카드는 체크 아이콘을 제거하고, 활성 여부를 카드 배경/보더/그림자만으로 표현하도록 정리했습니다.
- cue 좌측 dot을 누르면 ParrotKit 계열 accent color가 순환되도록 추가했고, 이 색상은 scene persistence에도 같이 저장되게 했습니다.
- `+ Add cue`는 단일 `+` 버튼으로 축소했고, recipe 배경은 완전한 `bg-white`로 정리했습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `src/lib/recipe-scene.ts`
- `src/types/recipe.ts`
- `plans/20260408_recipe_light_mode_cue_controls.md`

## 구현 메모
- `PrompterBlock.accentColor`를 추가해 creator가 고른 recipe cue 색을 유지할 수 있게 했습니다.
- fallback/default prompter block도 기본 accent color를 가지도록 맞췄습니다.
- navigation chrome, tab pills, floating script button은 light surface 기준으로 재정의했습니다.
- cue card 내부의 dot은 direct edit보다 빠른 컬러 전환용 컨트롤로 사용합니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- cue 색상 변경이 dot 클릭 순환 방식이라, 특정 색을 바로 고르는 palette보다는 한 단계 더 탐색이 필요할 수 있습니다.
