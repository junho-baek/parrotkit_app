# Recipe Create Generated Asset Rendering Plan

## 배경
- 사용자가 확인한 시뮬레이터 화면에서는 recipe create drawer의 generated 이미지가 보이지 않고 회색 placeholder처럼 표시된다.
- repo에는 generated PNG asset과 참조 코드가 적용되어 있지만, 현재 구현은 React Native local asset을 `Image.resolveAssetSource(...).uri` 문자열로 변환해 사용한다.
- local/offline bundle에서는 direct `require()` asset source가 더 안정적이다.

## 목표
- generated asset이 실행 중인 앱에서 확실히 렌더링되도록 local asset source를 direct require 기반으로 바꾼다.
- 큰 PNG 원본을 UI 표시용 파생 asset으로 축소해 로딩과 번들 부담을 낮춘다.

## 범위
- In scope:
  - generated PNG에서 UI용 JPG 파생본 생성
  - `recipe-create-visuals.ts`를 direct local asset source 중심으로 수정
  - `RecipeCreateScreen` image source 처리 수정
  - 관련 검증 및 context 기록
- Out of scope:
  - 이미지 재생성
  - drawer UI 구조 변경
  - Pro 권한 처리

## 변경 파일
- Add: `parrotkit-app/assets/recipe-create/generated-*.jpg`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-visuals.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- Add/Modify: `context/context_20260510_recipe_create_generated_asset_rendering.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- `recipe-create-visuals.ts`와 screen source handling을 이전 URI 기반 구조로 되돌리고 JPG 파생본을 제거한다.

## 리스크
- JPG 파생본은 원본 PNG보다 가볍지만 약간의 압축 손실이 있다.

## 결과
- generated PNG 원본에서 UI 표시용 JPG 파생본을 생성했다.
- goal card asset은 `512x768`, niche asset은 `256x256`으로 줄였다.
- `recipe-create-visuals.ts`를 direct local `require()` source 반환 구조로 변경했다.
- `RecipeCreateScreen`은 `Image`/`ImageBackground`에 source를 직접 넘긴다.
- Context 기록: `context/context_20260510_recipe_create_generated_asset_rendering.md`
