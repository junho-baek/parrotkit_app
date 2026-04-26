# ParrotKit App Web Recipe Parity Plan

## 배경
- 사용자가 현재 앱의 recipe 화면이 운영 콘솔처럼 보이고, 웹사이트의 실제 recipe 제작 흐름을 제대로 구현하지 못했다고 지적했다.
- 웹의 실제 제품 흐름은 `원본 분석 -> 실행 레시피 -> 촬영 프롬프터`이며, 장면 카드 리스트와 장면별 Recipe 탭에서 촬영 중 띄울 요소를 고르는 구조다.
- 이번 작업은 구현 착수 전, 웹 기능을 상세 분석하고 앱 구현 플랜을 작성하는 것이다.

## 목표
- 웹 `RecipeResult`/`RecipeScene` 구조를 분석한다.
- 현재 앱 recipe/prompter 구현의 차이를 정리한다.
- 앱에 웹 기능을 그대로 이식하기 위한 실행 가능한 세부 플랜을 작성한다.

## 범위
- 분석 대상: `src/types/recipe.ts`, `src/lib/recipe-scene.ts`, `src/components/common/RecipeResult.tsx`, `src/components/common/CameraShooting.tsx`, `src/app/api/analyze/route.ts`.
- 앱 대상: `parrotkit-app/src/core/mocks/parrotkit-data.ts`, `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`, `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`, `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`.
- 이번 턴에서는 코드 구현 없이 플랜 문서 작성까지만 수행한다.

## 변경 파일
- `docs/superpowers/plans/2026-04-26-parrotkit-app-web-recipe-parity.md`
- `plans/20260426_parrotkit_app_web_recipe_parity_plan.md`
- `context/context_20260426_parrotkit_app_web_recipe_parity_plan.md`

## 테스트
- 문서 작성 작업이므로 앱 빌드/시뮬레이터 검증은 수행하지 않는다.
- 플랜 내부에 구현 단계별 `npx tsc --noEmit` 및 iOS dev-client 수동 QA 절차를 포함한다.

## 롤백
- 문서 변경만 되돌리면 된다.
- 필요 시 `git revert`로 이번 플랜 커밋을 되돌린다.

## 리스크
- 실제 구현 시 현재 mock data와 web payload 사이의 타입 차이가 커서 단계별 마이그레이션이 필요하다.
- 네이티브 카메라에서 web `CameraShooting`의 drag/resize/edit 기능까지 한 번에 옮기면 범위가 커지므로 첫 패스는 선택된 cue 표시와 scene switching에 집중해야 한다.

## 결과
- 웹 recipe 기능과 앱 격차 분석을 포함한 상세 구현 플랜을 작성했다.
- 연결 플랜: `docs/superpowers/plans/2026-04-26-parrotkit-app-web-recipe-parity.md`

## 연결 context
- `context/context_20260426_parrotkit_app_web_recipe_parity_plan.md`
