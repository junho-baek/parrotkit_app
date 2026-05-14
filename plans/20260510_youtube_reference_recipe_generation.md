# YouTube Reference Recipe Generation Plan

## 배경
- 사용자는 New recipe의 Link/Paste 모드에서 YouTube Shorts URL을 붙여 넣으면 UGC shooting recipe가 자동 생성되길 원한다.
- 현재 RN 앱은 Link 모드에서도 mock draft를 바로 만들고, 실제 reference 분석/생성 splash가 없다.
- 루트 Next 앱에는 Supadata transcript/metadata와 Replicate Gemini 호출 래퍼가 이미 있어 server-side API에서 재사용할 수 있다.

## 목표
- 이번 범위는 YouTube/Shorts 링크만 지원한다.
- Link 모드 CTA를 `Generate recipe`로 바꾸고 URL이 없거나 YouTube가 아니면 비활성화한다.
- 생성 중에는 reference thumbnail 중심의 AI breakdown splash를 보여준다.
- 서버 API는 Supadata transcript/metadata와 Gemini JSON 생성을 시도하고, 실패 시 fallback recipe를 반환한다.
- 생성 결과는 기존 mock workspace recipe로 저장한 뒤 Recipe Board로 이동한다.

## 범위
- In scope:
  - RN recipe create Link mode generate flow
  - YouTube URL parsing and thumbnail fallback
  - AI breakdown splash UI and step progression
  - mobile-friendly recipe generation API route
  - generated recipe → `MockRecipeScene` mapping
  - fallback recipe
  - tests/typecheck/context
- Out of scope:
  - TikTok/Reels/product page support
  - actual frame-level analysis or shot boundary detection
  - persisted backend save for generated mobile recipes
  - auth-gated mobile API
  - full web analyze pipeline refactor

## 변경 파일
- Add: `src/app/api/mobile/reference-recipe/route.ts`
- Add: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.ts`
- Add: `parrotkit-app/src/features/recipes/lib/reference-recipe-generation.test.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- Modify: `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- Add/Modify: `context/context_20260510_youtube_reference_recipe_generation.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- Root TypeScript validation if route typing requires it.
- `git diff --check`
- Simulator smoke:
  - Link mode
  - paste YouTube Shorts URL
  - breakdown splash
  - generated 4-scene board opens

## 결과
- Link 모드에서 YouTube Shorts URL만 유효 입력으로 받고 CTA를 `Generate recipe`로 전환했다.
- 생성 중 reference thumbnail 기반 AI Breakdown splash와 6단계 진행 상태를 표시한다.
- `/api/mobile/reference-recipe`에서 Supadata transcript/metadata와 Replicate Gemini 생성을 시도하고, 실패 시 동일 schema fallback recipe를 반환한다.
- Gemini가 scene title을 변형해도 보드 구조가 명확하도록 `Hook / Proof / Demonstration / CTA` 제목은 canonical로 고정했다.
- 생성 결과를 mock workspace recipe로 저장하고 기존 Recipe Board로 이동한다.
- 연결 context: `context/context_20260510_youtube_reference_recipe_generation.md`

## 롤백
- Link mode generation handler를 이전 `createRecipeDraft` immediate path로 되돌린다.
- 새 mobile API route와 generation helper를 제거한다.
- `createRecipeDraft` thumbnail/summary override 확장을 제거한다.

## 리스크
- RN 앱에서 API base URL은 환경에 따라 달라진다. `EXPO_PUBLIC_PARROTKIT_API_URL`이 없으면 배포 URL 또는 local fallback을 사용한다.
- Supadata/Replicate env가 없거나 실패하면 fallback이 사용되므로 생성 품질은 낮아질 수 있다.
- 실제 YouTube metadata fetch는 플랫폼 차단/비공개/지역 제한에 영향을 받을 수 있다.
