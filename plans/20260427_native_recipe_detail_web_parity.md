# 20260427 Native Recipe Detail Web Parity

## 배경
- 네이티브 레시피 상세는 큰 히어로, 장면 rail, 상단 탭이 한 화면에 섞여 웹 `RecipeResult`의 장면 리스트 중심 구조를 잃었다.
- 사용자는 웹의 레시피 오버뷰처럼 장면 리스트를 먼저 보여주고, 장면 안에서 분석/레시피/슈팅을 다루는 구조를 원한다.

## 목표
- 레시피 상세 첫 화면을 웹처럼 장면 카드 리스트로 바꾼다.
- 장면 선택 후 Analysis, Recipe, Shoot 탭을 제공한다.
- Recipe 탭은 프롬프터에 들어갈 cue ingredient 선택 보드가 되게 한다.
- Shoot 탭은 기존 네이티브 프롬프터 촬영 화면으로 연결한다.

## 범위
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- `parrotkit-app/src/features/recipes/components/recipe-scene-card.tsx`
- `parrotkit-app/src/features/recipes/lib/scene-strategy-meta.ts`
- `parrotkit-app/src/features/recipes/components/scene-recipe-panel.tsx`
- `parrotkit-app/src/features/recipes/components/prompter-block-card.tsx`
- `parrotkit-app/src/features/recipes/components/scene-analysis-panel.tsx`

## 변경 파일
- `docs/superpowers/plans/2026-04-27-parrotkit-native-recipe-detail-web-parity.md`
- `plans/20260427_native_recipe_detail_web_parity.md`
- `context/context_20260427_native_recipe_detail_web_parity.md`
- native app recipe files listed above

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- iOS dev-client recipe overview 수동 QA
- scene detail Analysis/Recipe/Shoot 수동 QA
- native prompter route 진입 QA

## 롤백
- 이번 작업 커밋들을 revert하면 기존 hero/rail/tabs 화면으로 복구된다.
- prompter camera 파일은 변경하지 않았으므로 촬영 기능 롤백 리스크는 낮다.

## 리스크
- 현재 mock data의 scene thumbnail이 동일 이미지라 overview card가 웹보다 반복적으로 보일 수 있다.
- `SceneSequenceRail`은 파일로 남아 있으나 `RecipeDetailScreen`에서는 더 이상 사용하지 않는다.

## 결과
- 레시피 상세 첫 화면을 장면 리스트 중심으로 재구성했다.
- 장면 진입 후 Analysis/Recipe/Shoot 탭으로 웹 `RecipeResult` 흐름을 맞췄다.
- Recipe 탭의 cue 보드를 크게 정리하고 운영 콘솔식 라벨을 제거했다.
- QA 중 발견한 overview thumbnail expansion과 scene detail safe-area 문제를 보정했다.
- 연결 context: `context/context_20260427_native_recipe_detail_web_parity.md`
