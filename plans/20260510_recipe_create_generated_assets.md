# Recipe Create Generated Assets Plan

## 배경
- 이전 작업에서는 recipe create drawer용 visual을 curated local asset으로 넣었다.
- 사용자는 `generate` 스킬을 명시했고, 이제 실제 GPT image generation으로 감도에 맞는 이미지를 생성해 쓰길 원한다.
- 현재 `OPENAI_API_KEY`가 설정되어 있어 generation CLI 실행이 가능하다.

## 목표
- recipe create drawer의 niche/goal visual을 GPT generated image로 교체한다.
- 레퍼런스처럼 beauty/product/UGC/editorial 느낌의 밝고 프리미엄한 visual tone을 맞춘다.
- 생성 이미지는 앱 local bundle에 포함해 오프라인 설치 앱에서도 표시되도록 한다.

## 범위
- In scope:
  - `generate` skill CLI로 recipe-create 전용 PNG assets 생성
  - `recipe-create-visuals.ts`를 generated PNG 파일명으로 변경
  - 이전 curated JPG assets 제거
  - 관련 검증 및 context 기록
- Out of scope:
  - UI 구조의 큰 재설계
  - Pro 권한 처리
  - Brand brief 실제 업로드/분석

## 변경 파일
- Add: `parrotkit-app/assets/recipe-create/generated-*.png`
- Delete: `parrotkit-app/assets/recipe-create/*.jpg`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-visuals.ts`
- Add/Modify: `context/context_20260510_recipe_create_generated_assets.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- `recipe-create-visuals.ts`를 curated JPG asset 참조로 되돌리고 generated PNG 파일을 제거한다.

## 리스크
- 이미지 생성 품질은 모델 결과에 의존한다. 결과가 레퍼런스와 충분히 맞지 않으면 prompt를 좁혀 재생성해야 한다.
- PNG asset은 JPG보다 번들 용량이 커질 수 있다.

## 결과
- `generate` 스킬 CLI 기본 모델 `gpt-image-2`를 사용해 goal card 6개와 niche thumbnail 5개를 생성했다.
- Goal asset은 `1024x1536`, niche asset은 `1024x1024` PNG로 저장했다.
- `recipe-create-visuals.ts`를 generated PNG require 경로로 교체했다.
- 이전 curated JPG asset은 제거했다.
- Context 기록: `context/context_20260510_recipe_create_generated_assets.md`
