# Native Shoot Board Context

## 시점
- 2026-05-03 12:43 KST

## 배경
- 사용자는 홈에서 레시피를 누르면 나오는 기존 `/recipe/:id` 화면이 여전히 상세 페이지처럼 느껴진다고 피드백했다.
- 목표는 레시피 설명이 아니라 촬영 실행을 돕는 Shoot Board로 재구성하는 것이다.

## 변경 요약
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - `/recipe/:id` 기본 화면을 Shoot Board UI로 교체했다.
  - 큰 hero/marketing/detail block, 준비 브리프, why-it-works 설명 중심 섹션을 제거했다.
  - Header, compact Next Up card, Progress row, Cuts Board, add cut, disabled bulk action bar, local bottom nav를 구현했다.
  - 첫 viewport에서 Header, Next Up, Progress, Cuts Board 시작이 보이도록 layout을 조정했다.
  - 기존 selected scene workspace는 컷 카드/미리보기/프롬프터 버튼으로 진입하는 컷 workspace로 유지했다.
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - recipe scenes를 Shoot Board recipe/cut 모델로 변환하는 helper를 추가했다.
  - cut shot toggle, add cut, board/propmter href helper를 추가했다.
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`
  - type-check 기반 RED/GREEN 테스트로 3 cuts, 30s total, HOOK/PROOF/CTA, status toggle, add cut, route target을 검증한다.
- Home/Explore/Explore Detail/Recipes의 “촬영/Start Shooting” 진입점을 직접 prompter가 아니라 `/recipe/:id` Shoot Board로 이동하도록 변경했다.

## 검증
- RED: `cd parrotkit-app && npx tsc --noEmit`가 missing `shoot-board-model` export로 실패하는 것을 확인했다.
- GREEN: `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- iPhone 17 Pro에서 8081로 `exp://127.0.0.1:8081/--/recipe/recipe-korean-diet-hook` 화면 QA.
- QA 스크린샷: `output/playwright/native_shoot_board_pro_final.png`

## 남은 리스크
- 컷 추가, 순서 변경, bulk actions는 아직 local UI/state 수준이며 저장/서버 반영은 하지 않는다.
- Drag-and-drop reorder는 기존 구현이 없어서 이번에는 reorder mode 토글 UI만 제공한다.
- 컷 workspace는 기존 예시/준비/촬영 화면을 재사용하므로, 다음 단계에서 Shoot Board 톤에 맞춰 별도 cut edit workspace로 다듬는 것이 좋다.
