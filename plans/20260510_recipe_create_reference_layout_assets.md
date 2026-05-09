# Recipe Create Reference Layout Assets Plan

## 배경
- 현재 recipe create drawer는 사용자가 제시한 레퍼런스보다 배치가 좁고, mode tab의 Pro badge와 niche label이 겹치거나 잘린다.
- 기존 mock-media 번들 이미지는 같은 UGC 화면 재사용이라 레퍼런스의 beauty/product/editorial 감도와 다르다.
- OpenAI Image API용 `OPENAI_API_KEY`가 현재 셸에 없어 실시간 이미지 생성은 실행할 수 없다.

## 목표
- drawer 배치를 레퍼런스에 더 가깝게 조정한다.
- mode tab, niche pill, goal card가 텍스트를 불필요하게 자르지 않도록 크기와 간격을 재조정한다.
- 새 UGC/product 느낌의 visual asset을 앱 번들에 추가해 오프라인 설치 앱에서도 유지되게 한다.

## 범위
- In scope:
  - recipe create 전용 local image assets 추가
  - `recipe-create-flow`의 visual source를 신규 asset으로 변경
  - `RecipeCreateScreen` layout/style 조정
  - 관련 테스트/타입체크 및 context 기록
- Out of scope:
  - 실제 OpenAI Image API 생성
  - Pro 권한/결제 로직
  - Brand brief 실제 업로드/분석

## 변경 파일
- Add: `parrotkit-app/assets/recipe-create/*`
- Add: `parrotkit-app/src/features/recipes/lib/recipe-create-visuals.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- Add/Modify: `context/context_20260510_recipe_create_reference_layout_assets.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- 신규 `assets/recipe-create` 이미지와 `recipe-create-visuals.ts`를 제거한다.
- `recipe-create-flow.ts`를 이전 visual source로 되돌린다.
- `RecipeCreateScreen` style 변경분을 이전 layout으로 되돌린다.

## 리스크
- 신규 asset은 API 생성물이 아니라 curated local bundle asset이다. 실제 OpenAI 이미지 생성물이 필요하면 `OPENAI_API_KEY` 설정 후 별도 교체가 필요하다.
- 앱 번들 크기가 이미지 수만큼 증가한다.

## 결과
- `assets/recipe-create`에 recipe create 전용 niche/goal visual을 추가했다.
- `recipe-create-visuals.ts`를 추가해 React Native 런타임에서는 local bundled asset URI, Node 테스트에서는 fallback URI를 쓰도록 했다.
- drawer layout을 레퍼런스에 맞춰 조정했다: sheet height, mode tab Pro badge, 3-column niche pill, goal card/footer spacing.
- Context 기록: `context/context_20260510_recipe_create_reference_layout_assets.md`
