# UI QA Follow-ups Batch

## 작업 개요
- QA 피드백 기반으로 하단 네비, paste 입력/CTA, My Page 레이아웃, Pricing 뒤로가기, 로그인 유지, recipe capture/export UX를 한 번에 정리했다.
- 기본 검증 정책에 맞춰 `dev` 기준으로만 확인했고, 이번 턴에서는 Notion 업로드를 수행하지 않았다.

## 주요 변경
- 하단 네비
  - `src/components/common/BottomTabBar.tsx`
  - Lucide 아이콘 주변 내부 박스를 제거하고 active pill만 남겼다.
  - 탭 눌림 시 보이던 tap highlight/pressed 내부 박스도 제거했다.
- 세션 유지
  - `src/lib/auth/client-session.ts`
  - `src/components/common/AuthSessionSync.tsx`
  - `src/app/layout.tsx`
  - `src/app/(tabs)/my/page.tsx`
  - `src/app/billing/success/page.tsx`
  - `src/components/auth/SignInForm.tsx`
  - `src/components/auth/SignUpForm.tsx`
  - `src/components/auth/InterestsForm.tsx`
  - `src/components/auth/PricingCard.tsx`
  - `src/components/auth/DashboardContent.tsx`
  - `src/components/auth/URLInputForm.tsx`
  - `src/lib/client-events.ts`
  - access token / refresh token / expiresAt 저장과 자동 refresh 경로를 공통화했다.
  - `/my`, `/recipes`, `/paste`, 결제 성공 페이지, client event 전송에서 만료 토큰으로 인한 재로그인 체감을 줄이도록 수정했다.
- paste / CTA 스타일
  - `src/components/auth/URLInputForm.tsx`
  - 입력값 텍스트 색을 진하게 고정하고 placeholder 색을 옅게 조정했다.
  - `Analyze Video`를 인스타 톤 브랜드 그라디언트로 변경했다.
- My / Pricing / Recipes
  - `src/components/auth/DashboardContent.tsx`
  - `src/app/pricing/page.tsx`
  - `src/components/auth/RecipesTab.tsx`
  - `src/components/common/ShortVideoCard.tsx`
  - `Liked Videos`를 `Quick Actions` 위로 이동했다.
  - Pricing 상단 `← Back`, 하단 `← Back to My Page` 모두 `/my`로 연결했다.
  - `View Recipe` 버튼을 브랜드 그라디언트로 변경했다.
- Shooting / export UX
  - `src/components/common/RecipeResult.tsx`
  - 촬영본을 로컬 blob으로 유지한 채 export zip에 포함하도록 변경했다.
  - 업로드 실패 시 기존 업로드분을 보존하고, 로컬 저장이 있는 경우 `Saved locally` 상태를 우선 노출하도록 수정했다.
  - `Download` 버튼을 브랜드 그라디언트로 변경했다.
- 공용 input
  - `src/components/common/Input.tsx`
  - placeholder 유틸을 Tailwind v4 방식에 맞게 수정했다.

## 검증
- 정적 검사
  - `npx tsc --noEmit` 통과
  - `npx eslint ...` 실행
  - 결과: error 없음, 기존 `img` 사용 관련 warning만 남음
- dev 서버
  - `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- Playwright QA
  - 로그인: 재사용 테스트 계정으로 `/signin` 로그인 성공
  - 하단 네비: `/explore`에서 active pill만 보이고 내부 아이콘 박스가 제거된 상태 확인
  - `/paste`: 입력 텍스트 색과 placeholder 색 정상 확인
  - `/paste`: `Analyze Video` 버튼 computed style 확인
    - `backgroundImage`: `linear-gradient(135deg, rgb(255, 149, 104) 0%, rgb(222, 129, 193) 52%, rgb(140, 103, 255) 100%)`
  - 로그인 유지: `localStorage.tokenExpiresAt`를 과거 시점으로 강제한 뒤 `/my` 접근 유지 확인
  - My Page 순서: `Liked Videos` top `622`, `Quick Actions` top `974`, 즉 `Liked Videos`가 위에 배치됨
  - Pricing: 상단 `← Back`과 하단 `← Back to My Page`가 모두 `/my`로 연결된 상태 확인
  - Recipes: `View Recipe` 버튼 computed style 확인
    - `backgroundImage`: `linear-gradient(135deg, rgb(255, 149, 104) 0%, rgb(222, 129, 193) 52%, rgb(140, 103, 255) 100%)`
  - Recipe view: `Download` 버튼 computed style 확인
    - `backgroundImage`: `linear-gradient(135deg, rgb(255, 149, 104) 0%, rgb(222, 129, 193) 52%, rgb(140, 103, 255) 100%)`

## 산출물
- `output/playwright/20260318_ui_qa_home_logged_in.png`
- `output/playwright/20260318_ui_qa_paste_gradient_button.png`
- `output/playwright/20260318_ui_qa_my_order_and_session.png`
- `output/playwright/20260318_ui_qa_pricing_back_to_my.png`
- `output/playwright/20260318_ui_qa_recipes_view_recipe_gradient.png`
- `output/playwright/20260318_ui_qa_recipe_result_download_and_shoot.png`

## 메모
- camera/getUserMedia가 필요한 실제 촬영 업로드는 이번 dev QA에서 브라우저 자동화로 끝까지 재현하지 않았다.
- 대신 `RecipeResult`의 로컬 저장 유지, export zip 병합, 업로드 실패 문구 분기 로직은 코드/상태 기준으로 반영했다.
