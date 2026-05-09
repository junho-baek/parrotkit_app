# Recipe Asset Save / Publish Flow Plan

## 배경
- 현재 `view=publish` 화면은 Recipe Product를 바로 판매/마켓 설정처럼 다루는 단일 화면이다.
- 사용자는 촬영/레시피 결과를 먼저 reusable Recipe Asset으로 저장하고, 이후 재사용/공유/공개/마켓 제출로 이어지는 creator-first packaging flow를 요청했다.
- 첨부 시안은 4단계 흐름을 제안하지만, 앱 전체 톤에 맞게 꼭 다크 UI일 필요는 없다고 명시했다.

## 목표
- Recipe Product 진입 화면을 `Recipe complete` → `Saved to My Recipes` → `Usage destination` → `Marketplace settings` 흐름으로 재구성한다.
- 판매/가격 입력은 기본 경로가 아니라 marketplace/profile publish 선택 이후의 하위 설정으로 다룬다.
- 촬영 보드와 레시피 탭에서 이어지는 기존 CTA 라우팅은 유지한다.
- 앱의 light creator-tool 톤과 기존 카드/gradient CTA 스타일을 유지한다.

## 범위
- In scope:
  - `RecipesScreen`의 `view=publish` 화면 상태/단계 전환
  - Recipe Asset summary, saved hub, usage destination, publish settings UI
  - Copy 및 option 모델 정리
  - 기존 Recipe Product demo model 확장 또는 호환 유지
  - 타입 체크와 로컬 QA
- Out of scope:
  - 실제 결제/정산/마켓 승인 백엔드
  - 실제 커버 이미지 업로드
  - 클라이언트 공유 링크 생성 백엔드
  - 영상 export 파일 생성

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-product-demo.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-product-demo.test.ts` if model contract changes
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-product-cta.tsx`
- Add/Modify: `context/context_20260510_recipe_asset_save_publish_flow.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- 가능한 경우 iOS Simulator에서:
  - Recipe Product CTA 진입
  - Save as Recipe Asset → Saved screen
  - Choose usage option → destination 선택
  - Marketplace Submission → settings 화면

## 롤백
- `RecipesScreen`의 publish view를 이전 단일 product settings 화면으로 복원한다.
- 확장한 demo model 필드는 제거해도 기존 CTA routing은 유지된다.

## 리스크
- 현재는 mock/demo flow이므로 저장/제출 상태는 로컬 screen state로만 유지된다.
- 실제 탭바가 있는 앱 구조에서는 하단 CTA가 탭바 위에 떠야 하므로 safe area/bottom padding 조정이 필요하다.
- Marketplace/Profile/Client share의 실제 백엔드 플로우는 후속 작업이 필요하다.

## 결과
- `view=publish` 화면을 5-1 완료 요약, 5-2 저장 완료 허브, 6-1 활용 방식 선택, 6-2 마켓/공개 설정, 제출 완료 상태로 재구성했다.
- 촬영 보드 CTA와 Recipes 탭의 product CTA copy를 `Recipe Asset` 중심으로 변경했다.
- Recipe Product demo model을 reuse/share/publish/marketplace destination과 sample takes 포함 구조로 갱신했다.
- 검증 기록: `context/context_20260510_recipe_asset_save_publish_flow.md`
