# Recipe Create Drawer Tabs Context

## 시점
- 2026-05-10 KST

## 배경
- 플러스 버튼의 recipe creation flow가 별도 full-screen 선택 화면처럼 느껴졌고, 사용자는 Source drawer와 비슷한 bottom drawer UI를 원했다.
- 기존 기본 진입 mode는 `reference`였지만, 사용자는 `Start a new recipe`가 더 기본 동작이어야 한다고 피드백했다.
- 3개 mode는 세로 카드보다 상단 icon tab으로 가볍게 전환하고, `Reference link`와 `Brand context`는 Pro 라벨이 필요했다.
- 수동 생성은 별도 form에서 만드는 대신 recipe execution 화면에서 scene을 추가하며 만드는 방향으로 정리했다.

## 변경 요약
- `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
  - create mode 순서를 `manual`, `reference`, `brand`로 고정했다.
  - invalid/empty mode param은 `manual`로 fallback한다.
  - `reference`와 `brand`만 Pro mode로 판정한다.
  - manual primary action은 `open-shoot-board`로 정의했다.
- `parrotkit-app/src/features/recipes/lib/recipe-create-flow.test.ts`
  - manual default, mode order, Pro mode, manual board action 계약을 검증한다.
- `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
  - 화면을 transparent overlay + rounded bottom sheet 구조로 바꿔 drawer처럼 보이게 했다.
  - 세로 mode card를 상단 icon tab 3개로 바꿨다.
  - Link/Brand tab과 detail title에 Pro badge를 표시했다.
  - manual detail은 recipe execution board 안내로 바꾸고, CTA를 누르면 draft recipe를 생성한 뒤 `/recipe/:id`로 바로 이동한다.
  - reference/brand CTA는 기존 Source action drawer로 연결한다.
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
  - 플러스 FAB 기본 mode를 `manual`로 바꿨다.
- `parrotkit-app/src/app/_layout.tsx`
  - `recipe-create` route를 `transparentModal`로 바꿔 drawer-like overlay가 보이게 했다.

## 검증
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 메모
- 실제 Pro 권한/결제 처리는 추가하지 않았다. 이번 변경은 데모용 라벨과 flow polish에 한정한다.
- manual start가 생성하는 draft는 현재 mock workspace의 `createRecipeDraft`를 사용한다.
- 기존 dirty 파일인 `package.json`, `parrotkit-app/package-lock.json`, `.superpowers/`는 이번 변경에 포함하지 않는다.
