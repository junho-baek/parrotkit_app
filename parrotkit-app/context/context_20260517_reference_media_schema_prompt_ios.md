# 2026-05-17 Reference Media, Schema Prompt, iOS Attempt

## 배경

Board의 레퍼런스 프리뷰가 샐러드 이미지로 보였고, Reference viewer는 인플루언서/제품 reference media를 보여줬다. 원인은 `koreanDietCutDefinitions`의 `referenceThumbnailSource`가 generic food fallback으로 강제되어 실제 recipe/reference media를 덮는 것이었다.

## 변경

- `src/domain/shoot-board/shoot-board-model.ts`
  - `recipe-korean-diet-hook` cut definitions에서 `fallbackUgcImages.foodPromo` reference override를 제거했다.
  - Board reference preview가 recipe/scene의 실제 influencer reference image를 사용하도록 했다.
- `src/features/recipes/lib/shoot-board-model.test.ts`
  - Food promo board cuts가 generic food fallback이 아니라 recipe influencer reference media를 쓰는지 검증한다.
  - 기존 stale `Scene #N` expectations를 현재 `Cut #N` model로 맞췄다.
- `docs/reference-analysis/sandcastle-breakdown-schema-and-prompt.md`
  - Sandcastle식 breakdown storage schema와 extraction prompt를 문서화했다.

## 검증

PASS:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

Android QA:

- `output/playwright/recipe-execution-reference-20260517/android-board-influencer-reference.png`
- Result: Board reference preview now shows the influencer/product reference image.

iPhone attempt:

- `open -a Simulator`, `xcrun simctl list devices booted`, direct UDID `simctl openurl`, and `simctl io screenshot` were attempted.
- Simulator process starts but exposes no window through Computer Use.
- `simctl` commands repeatedly timed out with exit 124 after CoreSimulator process restarts.
- No iPhone screenshot was produced.

## 남은 메모

- iPhone QA is blocked by local CoreSimulator responsiveness, not app TypeScript/build state.
- If iPhone validation remains mandatory, the next local recovery step is a full CoreSimulator/Xcode service reset outside the app code path, then dev-client openurl retry.
