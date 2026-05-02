# Native Recipes Tab Redesign Context

## 작업 시간
- 2026-05-03 01:25 KST

## 배경
- 사용자는 레시피 탭을 첨부 시안처럼 `레시피 메인`, `컬렉션`, `레시피 발행` 화면으로 개편하길 요청했다.
- 기존 Recipes 탭은 ownership filter와 card grid 중심이라, 이어 촬영/컬렉션/발행 흐름이 분리되어 보이지 않았다.

## 변경 요약
- `parrotkit-app/src/features/recipes/screens/recipes-screen.tsx`
  - Recipes main을 검색, filter rail, continue shooting card, collection folders, compact recipe rows, community publish CTA로 재구성했다.
  - 내부 view state를 `main | collection | publish`로 나누어 하단 tab navigation을 유지한 채 컬렉션/발행 화면으로 전환되게 했다.
  - `?view=main|collection|publish` query를 읽어 simulator direct QA가 가능하게 했다.
  - Collection screen은 folder grid, recent collection preview, recipes in collection list, manage collection CTA를 제공한다.
  - Publish screen은 cover image, title/description, category pills, included item checklist, visibility cards를 제공한다.
  - Publish CTA는 bottom tab 위에 고정해 첫 화면에서도 발행 액션이 보이게 했다.
  - Recipes tab 진입 시 global top bar를 접어 시안처럼 screen-level header가 첫 신호가 되게 했다.
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
  - `/recipes`에서는 global Source FAB를 숨긴다.
  - Recipes main은 자체 recipe publish FAB를 노출하고 collection/publish sub-view에서는 숨긴다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과
- `git diff --check` 통과
- Metro status: `packager-status:running`
- Simulator direct route QA:
  - `exp://127.0.0.1:8081/--/recipes?view=main`
  - `exp://127.0.0.1:8081/--/recipes?view=collection`
  - `exp://127.0.0.1:8081/--/recipes?view=publish`
- Screenshots:
  - `output/playwright/native_recipes_tab_main_redesign.png`
  - `output/playwright/native_recipes_tab_collection_redesign.png`
  - `output/playwright/native_recipes_tab_publish_redesign.png`

## 리스크 / 후속
- Collection과 Publish는 아직 mock UI다. 실제 컬렉션 CRUD, 포함 항목, 공개 범위, 발행 API가 생기면 workspace provider 또는 Supabase contract와 연결해야 한다.
- Recipes tab에서 top bar를 접는 방식은 현재 screen-level header를 우선하기 위한 처리다. 향후 탭별 top bar policy가 생기면 공통 chrome 설정으로 옮기는 것이 좋다.
