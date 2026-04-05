# Context - Recipe Screen Refactor: Analysis / Recipe / Prompter

## 작업 요약
- 레시피 scene 계약을 nested 구조로 재정의했다.
  - `scene.analysis`
  - `scene.recipe`
  - `scene.prompter`
- legacy `description`, `script`, `transcriptSnippet`는 읽기 호환용 fallback으로 유지했다.
- `brandBrief` top-level 구조와 PDF 추출 유틸을 추가했다.
- analyze/chat/recipes API가 새 nested shape를 읽고 저장하도록 맞췄다.
- recipe 상세 화면을 `Analysis / Recipe / Prompter` 3탭으로 재편했다.
- `Prompter`는 웹 카메라 위에 block overlay를 띄우고, block visible/size/preset 조정이 가능하도록 만들었다.

## 주요 변경 파일
- `src/types/recipe.ts`
- `src/lib/recipe-scene.ts`
- `src/lib/brand-brief.ts`
- `src/app/api/analyze/route.ts`
- `src/app/api/chat/route.ts`
- `src/app/api/recipes/route.ts`
- `src/app/api/recipes/[id]/route.ts`
- `src/components/auth/URLInputForm.tsx`
- `src/components/auth/DashboardContent.tsx`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/RecipeVideoPlayer.tsx`
- `src/components/common/CameraShooting.tsx`
- `package.json`
- `package-lock.json`

## 구현 메모
- analyze 입력은 `multipart/form-data`를 받을 수 있게 바꿨고, `brandContextPdf`가 있으면 PDF 텍스트를 뽑아 `brandBrief` 추출을 시도한다.
- 잘못된 파일 형식은 `400` + 한국어 메시지로 반환한다.
- recipe 저장 시 `brandBrief`는 `recipes.analysis_metadata`와 `references.source_metadata` 양쪽에 유지한다.
- `RecipeResult`는 scene 업데이트를 `scene.recipe`와 `scene.prompter.blocks`에 반영하고, 다시 저장할 때는 `buildPersistableScenes()`로 nested + legacy fallback을 함께 보낸다.
- `DashboardContent`의 recipe hydrate effect는 `searchParams` 객체 전체가 아니라 `view`, `recipeId` 문자열에만 반응하도록 바꿔 무한 렌더 루프를 막았다.
- `Prompter` 탭의 카메라 권한 실패는 `alert()` 대신 inline 경고로 낮췄다.

## 검증
- `npx tsc --noEmit --pretty false`
- `npx eslint src/components/common/CameraShooting.tsx src/components/common/RecipeResult.tsx src/components/auth/DashboardContent.tsx src/components/auth/URLInputForm.tsx src/app/api/analyze/route.ts src/app/api/chat/route.ts src/app/api/recipes/route.ts 'src/app/api/recipes/[id]/route.ts' src/lib/recipe-scene.ts src/lib/brand-brief.ts src/types/recipe.ts`
- `npm run dev`
- Playwright local QA
  - 로그인
  - mock `recipeData` 세션 주입
  - `/home?view=recipe`
  - overview 카드에서 brand context 배지와 `appealPoint / keyLine / keyAction` 확인
  - `Analysis` 탭에서 transcript / motion / why it works / reference signals 확인
  - `Recipe` 탭에서 key line / mood / action / must include / must avoid / script lines 확인
  - `Prompter` 탭에서 overlay block 표시 확인
  - `Layout` 패널에서 visible 토글과 size/preset 컨트롤 확인
- API smoke
  - `/api/analyze` invalid PDF 업로드 시 `400` 및 `{"error":"브랜드 컨텍스트 파일은 PDF만 업로드할 수 있습니다."}` 확인
- Legacy normalize smoke
  - `normalizeRecipeScene()`에 legacy scene 입력 시 `analysis.motionDescription`, `recipe.keyLine`, `recipe.scriptLines`, 기본 `prompter.blocks` 생성 확인

## 산출물
- `output/playwright/20260406_recipe_analysis_tab.png`
- `output/playwright/20260406_recipe_prompter_layout.png`

## 남은 리스크
- 실제 외부 URL + 실제 PDF를 함께 넣는 `analyze` end-to-end는 로컬에서 외부 서비스 대기 시간이 길어 이번 턴에서는 완료하지 못했다.
- `Prompter` block drag 자체는 구현돼 있지만 headless 브라우저에서 정밀 drag 검증까지는 하지 않았다.
- `RecipeResult`와 `DashboardContent`에는 기존 `<img>` 사용 warning이 남아 있다. 이번 턴에서는 구조 refactor 우선으로 두고 image 최적화는 건드리지 않았다.
