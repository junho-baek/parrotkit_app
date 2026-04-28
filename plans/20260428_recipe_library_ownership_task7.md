# 20260428 Recipe Library Ownership Task 7

## 배경
- Shoot-first recipe ownership plan의 Task 7은 Recipes 탭을 일반 목록에서 owned/saved/remixed recipe library로 바꾸는 작업이다.
- Home/Explore는 이미 `ShootableRecipeCard`와 ownership metadata 중심으로 정리되어 있다.

## 목표
- Recipes 화면에서 ownership filter를 제공한다.
- 필터된 recipe를 shared `ShootableRecipeCard` 2-column grid로 표시한다.
- Shoot는 prompter, Open은 recipe detail로 이동한다.
- 빈 필터 결과는 Explore로 이어지는 CTA를 제공한다.

## 범위
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx` 구현 변경.
- 프로젝트 작업 규칙 준수를 위한 plan/context 기록.

## 변경 파일
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- `context/context_20260428_recipe_library_ownership_task7.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- Recipes 화면을 이전 `MediaTileCard` 기반 목록으로 되돌린다.
- 추가한 plan/context 기록만 제거한다.

## 리스크
- `ShootableRecipeCard`의 현재 API가 `size="compact"`를 지원하지 않으므로, card 파일을 건드리지 않기 위해 현재 grid/default compact surface를 사용해야 할 수 있다.
- mock ownership 값에만 의존하므로 실제 서버 소유권과 연결될 때 filter contract 재확인이 필요하다.

## 결과
- Recipes 화면에 `All`, `Owned`, `Saved`, `Remixes` ownership filter를 추가했다.
- 필터 결과를 shared `ShootableRecipeCard` grid로 렌더링하고 `Shoot`/`Open` 라우팅을 연결했다.
- 빈 필터 상태는 Explore 이동 CTA로 연결했다.
- 연결 context: `context/context_20260428_recipe_library_ownership_task7.md`
