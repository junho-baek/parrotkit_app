# Context - Recipe Detail Design Review

## 작업 요약
- 레시피 카드 진입 후 나오는 상세 화면의 공통 헤더를 다시 구성해서 씬 정보, 현재 단계, 다음 액션이 한 번에 읽히도록 정리했다.
- `analysis` 탭은 비어 보이던 상단 미디어 영역에 썸네일 기반 hero와 motion summary를 추가하고, 하단 정보 카드의 위계를 다시 잡았다.
- `recipe` 탭은 prompter cue를 전부 같은 크기로 늘어놓던 구조를 `On-screen now / Optional cues`로 분리해서 정보 밀도를 낮췄다.
- `prompter` 탭은 중복 back chrome을 제거하고, 하단 촬영 컨트롤을 한 덩어리의 glass tray로 묶어 촬영 화면 자체가 더 먼저 보이게 했다.
- layout drawer 상단에는 visible cue count를 추가하고 chrome 밀도를 조금 낮췄다.

## 주요 변경 파일
- `src/components/common/RecipeResult.tsx`
- `src/components/common/RecipeVideoPlayer.tsx`
- `src/components/common/CameraShooting.tsx`
- `plans/20260408_recipe_detail_design_review.md`

## 구현 메모
- `RecipeResult`에 `DETAIL_TAB_META`를 추가해 header summary와 tab label을 공통 메타 데이터로 묶었다.
- detail header 안으로 scene pager와 planner entry point를 올리고, 기존 중앙 좌우 화살표와 floating planner FAB를 제거했다.
- `renderRecipeDetail()`는 visible cue를 큰 카드로, hidden cue를 compact grid로 분리했다.
- `RecipeVideoPlayer`는 media ready 상태를 따로 관리해서 로딩 전에는 썸네일/gradient hero가 먼저 보이게 했다.
- `CameraShooting`는 embedded 모드에서 내부 back button / top badge를 숨기고, bottom control tray를 재구성했다.

## 검증
- `npx eslint src/components/common/RecipeResult.tsx src/components/common/RecipeVideoPlayer.tsx src/components/common/CameraShooting.tsx`
  - error 없음
  - 기존 `<img>` warning 6건 유지
- `npx tsc --noEmit --pretty false`
- 로컬 browse QA
  - mobile `430x932`
    - before screenshots
      - `output/playwright/20260408_recipe_detail_before_analysis.png`
      - `output/playwright/20260408_recipe_detail_before_recipe.png`
      - `output/playwright/20260408_recipe_detail_before_prompter.png`
      - `output/playwright/20260408_recipe_detail_before_prompter_layout.png`
    - after screenshots
      - `output/playwright/20260408_recipe_detail_after_analysis.png`
      - `output/playwright/20260408_recipe_detail_after_recipe.png`
      - `output/playwright/20260408_recipe_detail_after_prompter.png`
      - `output/playwright/20260408_recipe_detail_after_prompter_layout.png`
  - desktop `1440x900`
    - `output/playwright/20260408_recipe_detail_after_analysis_desktop.png`

## 남은 리스크
- prompter 탭의 카메라 permission error banner는 권한이 없는 QA 환경에서는 still cue 위를 가로지른다. 실사용에서는 permission granted 흐름으로 보는 것이 진실값이지만, error 상태 시각도 후속 polish 여지가 있다.
- overview grid 자체는 이번 범위에서 손대지 않았고, 상세 화면에 집중했다.
