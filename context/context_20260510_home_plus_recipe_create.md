# Home Plus Recipe Create Context

## 시점
- 2026-05-10 KST

## 배경
- 직전 작업에서 Recipes 탭 `+`는 `Start new recipe` drawer의 manual mode로 변경됐다.
- 홈 화면 전역 `+`는 여전히 `/source-actions`를 열고 있어 생성 흐름이 일관되지 않았다.

## 변경 요약
- `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
  - `getRecipeCreateHref(mode = "manual")` helper를 추가했다.
- `parrotkit-app/src/features/recipes/lib/recipe-create-flow.test.ts`
  - 기본 href가 `/recipe-create?mode=manual`인지, explicit mode가 보존되는지 검증한다.
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
  - 전역 `+` CTA가 `/source-actions` 대신 `getRecipeCreateHref()`를 열도록 변경했다.
- `parrotkit-app/src/core/i18n/app-language.tsx`
  - 전역 `+`의 label/accessibility copy를 source 추가에서 recipe 시작 의미로 바꿨다.
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
  - Recipes FAB도 동일 helper를 사용하도록 정리했다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 메모
- 기존 Source 탭 내부의 `/source-actions` 진입은 유지했다.
- 기존 dirty 파일인 `package.json`, `parrotkit-app/package-lock.json`, `.superpowers/`는 이번 변경에 포함하지 않는다.
