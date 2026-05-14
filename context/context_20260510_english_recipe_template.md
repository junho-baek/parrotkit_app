# English Recipe Template Context

## 시점
- 2026-05-10 KST

## 배경
- 사용자가 한국어 레시피 템플릿을 패럿킷 앱의 레시피 탐색과 레시피 실행 흐름에서 쓸 수 있는 영어 버전으로 추가하길 요청했다.
- 현재 앱은 mock seed의 `exploreRecipeSeeds`로 탐색 카드를 만들고, `recipesSeed`를 정규화해 Shoot Board/Prompter 실행 경로에 연결한다.

## 변경 요약
- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
  - 영어 템플릿 공통 hook/save/warning 문구와 `createEnglishExpertShortcutScenes()`를 추가했다.
  - 실행 가능한 레시피 seed로 `recipe-english-expert-shortcut`을 추가했다.
  - 탐색용 레시피 seed로 `market-recipe-english-expert-shortcut`을 추가했다.
  - 사용자 템플릿을 4개 scene으로 분리했다:
    - expert/place와 cost/time 기반 hook
    - common tool/free alternative와 hidden cause 설명
    - three-step walkthrough
    - expected effect와 warning close
- `parrotkit-app/src/core/mocks/parrotkit-data.test.ts`
  - Explore seed와 runnable seed에 영어 템플릿이 모두 있는지 확인한다.
  - 첫 hook/save/warning 문구가 보존되는지 확인한다.
  - runnable seed가 Shoot Board로 변환될 때 첫 `Line to say`와 warning scene이 실행 흐름에 노출되는지 확인한다.
- `plans/20260510_english_recipe_template.md`
  - 작업 계획과 결과를 기록했다.

## 검증
- `cd parrotkit-app && npx tsx src/core/mocks/parrotkit-data.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 메모
- `npm` 실행 시 현재 로컬 조합에서 `npm v11.3.0`과 `Node.js v20.15.0` 지원 범위 경고가 출력되지만, 실행과 검증은 모두 성공했다.
- 별도 locale 필드가 없어서 영어 버전은 독립 레시피 카드로 추가했다.
