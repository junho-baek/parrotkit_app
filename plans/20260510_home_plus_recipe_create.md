# Home Plus Recipe Create Plan

## 배경
- Recipes 탭의 `+`는 새 recipe-create drawer의 manual 기본 모드로 변경됐다.
- 홈 화면의 전역 `+`는 아직 `/source-actions`를 열고 있어 같은 생성 흐름과 다르다.

## 목표
- 홈 화면 `+`도 `Start new recipe` drawer의 manual 모드로 연결한다.
- 전역 `+`의 표시/접근성 문구도 source가 아니라 recipe 생성 의미로 맞춘다.
- 기존 Source 탭 내부의 source action 진입점은 유지한다.

## 범위
- In scope:
  - recipe-create href helper/test 추가
  - `GlobalSourceCta` 진입 route 변경
  - `sourceCta` copy를 recipe 생성 의미로 조정
- Out of scope:
  - 전역 CTA 컴포넌트 이름 리네이밍
  - Source 탭 내부 form 변경
  - 실제 Pro 권한 처리

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-flow.test.ts`
- Modify: `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- Modify: `parrotkit-app/src/core/i18n/app-language.tsx`
- Add/Modify: `context/context_20260510_home_plus_recipe_create.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- `GlobalSourceCta` route를 `/source-actions`로 되돌리고, recipe-create href helper/test와 copy 변경을 되돌린다.

## 리스크
- 전역 CTA가 홈 외의 화면에서도 보이는 경우 그 화면에서도 recipe-create drawer로 열린다. 기존 동작과 다르지만 현재 CTA는 이미 Source/Explore/Recipes에서 숨겨진다.

## 결과
- 홈 화면 전역 `+` CTA를 `/recipe-create?mode=manual`로 연결했다.
- 전역 CTA의 영어/한국어 label과 accessibility copy를 recipe 시작 의미로 바꿨다.
- Recipes FAB와 홈 전역 CTA가 같은 `getRecipeCreateHref` helper를 쓰도록 정리했다.
- 연결 context: `context/context_20260510_home_plus_recipe_create.md`
