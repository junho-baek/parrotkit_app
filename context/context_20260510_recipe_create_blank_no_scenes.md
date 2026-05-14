# Recipe Create Blank No Scenes Context

## 배경
- 사용자는 recipe create drawer에서 niche 사진이 어색하다고 피드백했다.
- 단, goal card는 사진이 유지되어야 한다.
- Blank 생성은 기본 scene을 자동으로 만들지 않고, shoot board에서 사용자가 직접 scene을 추가하는 흐름이어야 한다.

## 변경 사항
- `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
  - Niche option의 `imageSource` 필드를 제거했다.
  - `getRecipeCreateInitialScenes()`를 추가해 manual/Blank 모드는 빈 scene 배열을 반환하고 Link/Brand는 기존 seeding을 유지한다.
- `parrotkit-app/src/features/recipes/lib/recipe-create-visuals.ts`
  - Goal image는 local bundled `require()`를 먼저 사용하도록 변경했다.
  - Node/test 환경에서는 fallback URI로 내려가도록 `try/catch` 처리했다.
- `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
  - Niche chip에서 thumbnail/fallback image 렌더링을 제거했다.
  - Blank 생성 시 `scenes: []`를 draft 생성에 전달한다.
  - Goal card는 `ImageBackground` 기반 사진 렌더링을 유지한다.
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
  - `createRecipeDraft`가 optional `scenes` override를 받도록 확장했다.
  - `totalSceneCount`는 실제 scene 배열 길이와 동기화한다.
- `parrotkit-app/assets/recipe-create/`
  - 더 이상 쓰지 않는 generated niche JPG asset을 제거했다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- iOS Simulator + Metro reload:
  - Home `+`에서 New recipe drawer를 열어 niche chip이 사진 없이 텍스트로만 보이는 것을 확인했다.
  - Goal card는 local generated photo가 표시되는 것을 확인했다.
  - Blank에서 `Open shoot board`를 눌렀을 때 `0 cuts · 0s · 0 / 0 shot` 보드가 열리고, 기본 scene 카드 없이 `Add scene` 버튼만 노출되는 것을 확인했다.

## 리스크
- Blank recipe는 scene이 없으므로 prompter/camera 진입은 scene 추가 후에만 가능하다.
- Goal asset이 유지되므로 앱 번들에는 generated goal JPG 6개가 남는다.
