# English Recipe Template Plan

## 배경
- 사용자가 한국어 숏폼 레시피 템플릿을 패럿킷 앱의 레시피 탐색과 레시피 실행 흐름에서 쓸 수 있는 영어 버전으로 추가하길 요청했다.
- 현재 mock recipe 데이터는 `recipesSeed`와 `exploreRecipeSeeds`로 나뉘며, 실행 화면은 recipe scene 데이터를 정규화해 Shoot Board/Prompter에 노출한다.

## 목표
- 사용자가 준 템플릿의 의미와 placeholder 구조를 유지한 영어 버전 레시피를 추가한다.
- 레시피 탐색에서도 보이고, 저장/실행 가능한 레시피 목록에서도 촬영 보드로 실행 가능하게 한다.
- 회귀 방지를 위해 seed 데이터와 Shoot Board 변환 경로를 확인하는 테스트를 먼저 추가한다.

## 범위
- In scope:
  - 영어 템플릿 mock recipe seed 추가
  - 탐색 seed와 실행 seed 노출 확인 테스트 추가
  - 최소 타입 체크/데이터 테스트
- Out of scope:
  - 다국어 런타임 토글
  - 서버 저장/동기화
  - 새 이미지/영상 asset 제작

## 변경 파일
- Add/Modify: `parrotkit-app/src/core/mocks/parrotkit-data.test.ts`
- Modify: `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- Add/Modify: `context/context_20260510_english_recipe_template.md`

## 테스트
- `cd parrotkit-app && npx tsx src/core/mocks/parrotkit-data.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- 추가된 영어 레시피 seed와 해당 테스트를 제거하면 기존 mock recipe 상태로 돌아간다.

## 리스크
- 현재 mock 데이터에는 locale 필드가 없어 영어 버전은 별도 레시피 카드로 노출된다.
- 새 미디어 asset 없이 기존 bundled mock media를 재사용하므로 시각 자료는 범용적으로 매칭된다.

## 결과
- `recipesSeed`에 `recipe-english-expert-shortcut`을 추가해 레시피 실행/Shoot Board 경로에서 영어 템플릿을 사용할 수 있게 했다.
- `exploreRecipeSeeds`에 `market-recipe-english-expert-shortcut`을 추가해 레시피 탐색에서 같은 영어 템플릿을 확인할 수 있게 했다.
- 사용자 제공 한국어 템플릿을 placeholder 구조를 유지한 영어 4-scene 촬영 레시피로 구성했다.
- Seed 데이터와 Shoot Board 변환 경로를 확인하는 `parrotkit-data.test.ts`를 추가했다.
- 연결 context: `context/context_20260510_english_recipe_template.md`
