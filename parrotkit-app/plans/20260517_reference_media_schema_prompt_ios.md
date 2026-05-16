# 2026-05-17 Reference Media, Sandcastle Schema, iOS QA

## 배경

실행 화면 Board에서 레퍼런스 프리뷰가 샐러드 이미지로 보이지만, Reference viewer는 인플루언서/제품 reference media를 보여준다. 사용자는 레퍼런스 영상/이미지의 일관성과 Sandcastle식 breakdown schema/prompt, iPhone 검증을 요청했다.

## 목표

- Board 레퍼런스 프리뷰와 Reference viewer가 같은 influencer/reference media를 쓰게 한다.
- Sandcastle식 breakdown schema와 extraction prompt를 문서화한다.
- Android와 iPhone 시뮬레이터에서 실행 화면을 다시 캡처한다.

## 범위

- Mock recipe/cut reference thumbnail source correction
- Schema/prompt documentation
- Android/iPhone local QA evidence

## 변경 파일

- `src/domain/shoot-board/shoot-board-model.ts`
- `src/features/recipes/lib/shoot-board-model.test.ts`
- `docs/reference-analysis/sandcastle-breakdown-schema-and-prompt.md`
- `context/context_20260517_reference_media_schema_prompt_ios.md`
- `output/playwright/recipe-execution-reference-20260517/*`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/shoot-board-model.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- Android/iPhone screenshots

## 롤백

Revert this commit. This returns Board reference thumbnails to the previous cut-level fallback images.

## 리스크

- iOS simulator may not be booted or may need a dev-client reinstall; attempt boot/open/capture before marking blocked.
- The schema/prompt is an extraction contract, not a live Gemini/Supadata integration.

## 결과

- Board reference preview now follows the actual influencer/reference media instead of the generic food fallback.
- Sandcastle-style schema and extraction prompt saved in `docs/reference-analysis/sandcastle-breakdown-schema-and-prompt.md`.
- Android screenshot captured.
- iPhone was attempted through Simulator UI, direct UDID `simctl openurl`, `simctl io screenshot`, and CoreSimulator restarts, but `simctl` timed out and no Simulator window was exposed.
- 연결 context: `context/context_20260517_reference_media_schema_prompt_ios.md`
