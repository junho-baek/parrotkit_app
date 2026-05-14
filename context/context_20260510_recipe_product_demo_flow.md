# Recipe Product Demo Flow Context

## 시점
- 2026-05-10 KST

## 배경
- 사용자가 데모 영상 흐름에서 기존 "편집앱으로 연결" 이후가 약하다고 보고, 최신 기준의 "Reuse or sell as Recipe product"까지 보여줘야 한다고 요청했다.
- 실제 marketplace/backend 기능은 아직 없지만, 데모 영상에서 제품 포지셔닝이 끊기지 않도록 frontend-only 상품화 슬라이스가 필요했다.

## 변경 요약
- `parrotkit-app/src/features/recipes/lib/recipe-product-demo.ts`
  - Recipe Product 데모 모델과 `/recipes?view=publish&recipeId=...` 라우트 helper를 추가했다.
  - 모델은 source recipe title/summary, `$19` 데모 가격, `Reuse`/`Sell` 모드, 포함 항목 4종을 반환한다.
- `parrotkit-app/src/features/recipes/lib/recipe-product-demo.test.ts`
  - route helper, price, reuse/sell 기본 활성화, included item, created 상태 label을 검증한다.
- `parrotkit-app/src/features/recipes/components/shoot-board-product-cta.tsx`
  - Shoot Board footer에 `Turn into Recipe Product` CTA를 추가했다.
  - Cut-by-cut, Script, Prompter, Sell-ready 패키지 신호를 카드 안에 보여준다.
- `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
  - `ListFooterComponent` prop을 추가해 board 끝에 CTA를 붙일 수 있게 했다.
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Shoot Board footer CTA에서 현재 recipe를 저장한 뒤 Recipe Product 화면으로 이동하도록 연결했다.
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
  - 기존 publish view가 `recipe-create`로 빠지던 동작을 demo Recipe Product 화면으로 바꿨다.
  - product title/description, product options, marketplace price, product includes, visibility, created banner를 보여준다.
  - bottom CTA를 누르면 `Recipe product created` 상태로 바뀐다.

## 데모 흐름
1. Paste Reference
2. AI breaks down the short-form video
3. Generate cut-by-cut Recipe
4. Use Shooting Mode
5. Save / Edit / Export
6. Turn into Recipe Product
7. Reuse internally or sell as a creator product

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-product-demo.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 메모
- `npm` 실행 시 현재 로컬 조합에서 `npm v11.3.0`과 `Node.js v20.15.0` 지원 범위 경고가 출력되지만, 모든 검증 명령은 exit 0으로 완료됐다.
- 실제 결제/판매/마켓 등록은 구현하지 않았다. 이번 작업은 데모 영상용 frontend-only 상태다.
- 기존 dirty 파일인 `package.json`, `parrotkit-app/package-lock.json`, `.superpowers/`는 이번 변경에 포함하지 않았다.
