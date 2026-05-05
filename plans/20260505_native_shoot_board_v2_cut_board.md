# Native Shoot Board v2 Cut Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/recipe/:id` as the v2 Cut Board from the provided directive, making it a minimal filming board focused on editable cuts rather than a visually rich recipe execution page.

**Architecture:** Treat the attached “컷 보드 UI 지시서 (v2)” as the source of truth. The existing v1 Shoot Board UI should not be preserved as a design baseline. Keep only necessary route/data plumbing, then replace the overview screen with a compact header, a vertical cut board, expandable cut cards, completion controls, per-cut actions, and a floating “장면 추가” button.

**Tech Stack:** Expo Router, React Native, NativeWind, Expo LinearGradient for the primary shoot button only, MaterialCommunityIcons, TypeScript model/type-check tests.

---

## 배경
- 현재 Shoot Board v1은 Next Up card, progress row, thumbnails, bulk action bar, local bottom nav가 한 화면에 섞여 있어 시각적으로 산만하다.
- 사용자는 이미 레시피를 선택한 상태이므로 이 화면에서 레시피를 다시 설명하거나 분석을 미리 보여줄 필요가 없다.
- 이번 v2의 제품 판단은 “이미지를 최대한 걷어내고 컷 보드만 제공하는 실용적인 촬영 레시피 보드”다.
- 최신 원격 상태는 `git fetch origin && git status -sb` 기준 `main...origin/main`으로 동기화되어 있다.

## 목표
- `/recipe/:id` 기본 화면을 지시서 v2와 같은 컷 보드 중심 UI로 재작성한다.
- 첫 화면에는 최소 헤더와 `CUTS BOARD` 리스트가 바로 보여야 한다.
- 큰 히어로, Next Up card, progress row, 상세 분석 미리보기, 큰 썸네일, 하단 로컬 탭바를 제거한다.
- 컷 카드는 접힌 상태와 펼친 상태를 명확히 제공한다.
- 첫 컷 또는 다음 미촬영 컷은 기본 펼침 상태로 보여준다.
- 사용자는 각 컷에서 바로 말할 문장, 촬영 지시, 필수 체크를 확인하고 촬영을 시작할 수 있어야 한다.
- 색상은 역할 라벨과 주요 촬영 버튼에만 제한적으로 사용한다.

## 범위
- In scope:
  - `/recipe/:id` overview 화면의 v2 컷 보드 재구성.
  - Shoot Board model에 v2 카드에 필요한 필드 추가.
  - 접힘/펼침, 촬영 완료 토글, 장면 추가, 순서 변경 모드, 촬영 진입 액션 연결.
  - TypeScript 테스트와 8081 iPhone Pro 사이즈 수동 QA.
- Out of scope:
  - Explore recipe detail 화면 변경.
  - Camera/prompter 화면 변경.
  - 서버 저장/동기화, 실제 drag-and-drop persistence.
  - 긴 분석/레시피 상세/마켓플레이스형 설명 UI.

## 변경 파일
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - v1 overview의 `NextUpCard`, `ProgressSection`, `BulkActionBar`, `ShootBoardBottomNav` 사용을 제거한다.
  - `CutBoardHeader`, `CutBoardSection`, `CutBoardCard`, `FloatingAddSceneButton` 형태로 v2 화면을 새로 구성한다.
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - v2 카드용 `speakingLine`, `shootingDirections`, `requiredChecks`, `isExpandedDefault` 성격의 데이터를 만들 수 있게 확장한다.
  - 역할은 `hook | proof | scene | cta | custom`을 지원한다.
  - v2 기준 4-cut board와 `40s`, `0 / 4 shot` 표시를 안정적으로 만들 수 있게 샘플 매핑을 조정한다.
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`
  - v2 모델 계약을 검증한다.
- `context/context_20260505_native_shoot_board_v2_cut_board.md`
  - 구현 후 결과와 검증 내용을 기록한다.

## UI Source Of Truth
- 지시서 v2 이미지가 화면 구조와 우선순위의 기준이다.
- 기존 v1 코드는 참고 대상이 아니라 제거 대상이다.
- 유지 가능한 것은 route, recipe lookup, prompter href 같은 기능 연결뿐이다.

## 화면 구조
- Header:
  - 왼쪽: 뒤로가기.
  - 중앙/좌측: `Korean Diet Viral Recipe`, `4 cuts · 40s · 0 / 4 shot`.
  - 오른쪽: 더보기 메뉴.
  - 북마크/저장 아이콘은 v2 지시서에 없으므로 기본 헤더에서는 제거한다.
- Main:
  - 섹션 타이틀 `CUTS BOARD`.
  - 오른쪽 액션 `↕ 순서 변경`.
  - 컷 카드 리스트만 렌더링한다.
- Floating Action:
  - 오른쪽 하단 고정 버튼 `+ 장면 추가`.
  - 하단 네비게이션은 표시하지 않는다.

## 컷 카드 구조
- 접힌 카드:
  - 드래그 핸들.
  - 펼침/접힘 chevron.
  - `#1 Hook · 5s` 메타.
  - 한 줄 촬영 지시.
  - 오른쪽 완료 체크 circle.
- 펼친 카드:
  - 상단 구조는 접힌 카드와 동일.
  - 구분선 아래:
    - `말할 문장`
    - 인용 문장.
    - `촬영 지시`
    - bullet list.
    - `필수 체크`
    - checkbox list.
  - 하단 액션:
    - `예시 보기`
    - gradient `촬영하기`
    - 더보기 메뉴.
- 이미지/썸네일은 카드 내부에 넣지 않는다.
- `예시 보기`는 보드 안에 상세 분석 미리보기를 펼치지 않고, 필요 시 별도 가벼운 reference action으로만 연결한다.

## 데이터 모델
- `ShootBoardRecipe`
  - `id`
  - `title`
  - `totalCuts`
  - `totalDurationSeconds`
  - `shotCount`
  - `cuts`
- `ShootBoardCut`
  - `id`
  - `order`
  - `role`
  - `roleLabel`
  - `durationSeconds`
  - `instruction`
  - `speakingLine`
  - `shootingDirections`
  - `requiredChecks`
  - `isShot`
  - `sceneId`
- v2 fixture copy:
  - `#1 Hook · 5s` / `Lead with the payoff.` / `이렇게 먹으니까 오래 갔어요.`
  - `#2 Proof · 8s` / `Show texture and speed.`
  - `#3 Scene · 12s` / `Show the routine.`
  - `#4 CTA · 5s` / `Leave curiosity, then link.`

## 인터랙션
- 뒤로가기:
  - `router.canGoBack()`이면 `router.back()`, 아니면 안전 fallback route로 이동.
- 펼침/접힘:
  - 기본은 다음 미촬영 컷만 펼침.
  - 사용자가 chevron이나 카드 헤더를 누르면 해당 카드 확장 상태를 토글한다.
- 완료 체크:
  - 오른쪽 circle을 누르면 `미촬영`/`촬영완료` 상태를 토글한다.
  - header의 `shotCount`가 즉시 갱신된다.
- 순서 변경:
  - `순서 변경`을 누르면 reorder mode를 켠다.
  - drag-and-drop이 없으면 우선 시각 상태와 향후 확장 포인트만 제공한다.
- 예시 보기:
  - 보드 안에서는 상세 분석 미리보기를 렌더링하지 않는다.
  - 첫 구현에서는 기존 reference route/state로 들어가더라도 화면 진입은 사용자의 명시 액션 이후에만 일어난다.
- 촬영하기:
  - 해당 cut의 `sceneId`로 `/recipe/:id/prompter?sceneId=...` 이동.
- 장면 추가:
  - 로컬 custom cut을 리스트 하단에 추가하고 자동 펼침한다.

## 디자인 규칙
- 전체 배경은 white/canvas.
- 카드 radius는 기존 앱 톤에 맞추되 과하게 둥글게 만들지 않는다.
- 카드 shadow는 약하게, border는 명확하게.
- 색상은 역할 라벨과 primary shoot button에만 쓴다.
- Hook: coral/pink.
- Proof: orange.
- Scene: soft purple/blue.
- CTA: blue/purple.
- gradient는 `촬영하기`와 floating add button 중 하나에만 강하게 사용하고, 나머지는 outline/white button으로 둔다.
- 본문 텍스트는 검정/회색 위계 중심으로 구성한다.

## 작업 순서
- [x] `shoot-board-model.test.ts`를 v2 계약으로 먼저 수정한다.
- [x] `shoot-board-model.ts`에 v2 cut fields, role `scene`, 4-cut fixture mapping, status toggle 계약을 반영한다.
- [x] `RecipeDetailScreen`의 `/recipe/:id` overview에서 v1 sections를 제거한다.
- [x] v2 header와 `CUTS BOARD` 리스트 중심 레이아웃을 구현한다.
- [x] 접힌/펼친 카드 상태와 완료 체크 상태를 연결한다.
- [x] `촬영하기`, `예시 보기`, `장면 추가`, `순서 변경` 액션을 연결한다.
- [x] 사용하지 않는 v1 컴포넌트와 스타일을 정리한다.
- [x] `npx tsc --noEmit`으로 타입 검증한다.
- [x] 8081에서 iPhone Pro 화면 QA를 수행하고 screenshot을 `output/playwright/`에 남긴다.
- [x] 구현 결과를 `context/context_20260505_native_shoot_board_v2_cut_board.md`에 기록한다.
- [x] `git status`, `git fetch origin`, rebase 필요 여부 확인 후 커밋/푸시한다.

## 테스트
- Type check:
  - Command: `cd parrotkit-app && npx tsc --noEmit`
  - Expected: no TypeScript errors.
- Diff hygiene:
  - Command: `git diff --check`
  - Expected: no whitespace errors.
- Local QA:
  - Dev server: existing 8081 flow or `cd parrotkit-app && npm run dev -- --port 8081`.
  - Target: `exp://127.0.0.1:8081/--/recipe/recipe-korean-diet-hook`.
  - Device profile: iPhone Pro size.
  - Verify:
    - First viewport shows header and `CUTS BOARD` immediately.
    - No Next Up card, no progress row, no large images, no bottom local nav.
    - First/next unshot card is expanded.
    - Other cards are compact.
    - Completion toggle updates `0 / 4 shot`.
    - `촬영하기` opens prompter for the selected cut.
    - `장면 추가` adds a custom card.

## 롤백
- Revert the `RecipeDetailScreen` overview section to the current v1 Shoot Board implementation.
- Revert `shoot-board-model.ts` and `shoot-board-model.test.ts` to the v1 contract.
- Explore detail and prompter routes remain untouched, so rollback scope is isolated to `/recipe/:id` overview.

## 리스크
- The current mock recipe may not naturally contain exactly 4 cuts; v2 visual spec requires a 4-cut board, so the model may need a deterministic demo mapping for this recipe.
- Real drag-and-drop may not exist yet; reorder mode can be visually enabled without persistence in this pass.
- Removing bottom nav and Next Up changes muscle memory from v1, but it matches the new directive and reduces visual confusion.
- If `예시 보기` reuses the old scene workspace too directly, it can reintroduce the “상세 분석 페이지” feeling; implementation should keep that action secondary and avoid rendering analysis content in the board itself.

## 완료 기준
- `/recipe/:id` clearly looks like the provided v2 Cut Board directive.
- The screen feels like a filming checklist/board, not a recipe detail page.
- The first viewport is dominated by text-first cut cards.
- Images are absent from the board.
- The user can expand a cut, check required items, mark a cut complete, add a scene, and start filming from a cut.

## 결과
- `/recipe/:id` 기본 화면을 v2 Cut Board로 재작성했다.
- Next Up, Progress row, 큰 이미지/썸네일, bulk action bar, local bottom nav를 제거했다.
- 첫/다음 미촬영 컷은 펼친 카드로 표시하고 나머지는 접힌 카드로 표시한다.
- 컷별 말할 문장, 촬영 지시, 필수 체크, 예시 보기, 촬영하기 액션을 제공한다.
- `useAppLanguage` 기반으로 한국어/영어 화면 카피와 컷 지시문을 분리했다.
- 검증: `cd parrotkit-app && npx tsc --noEmit`, `git diff --check`, 8081 모바일 웹 QA.
- QA 스크린샷: `output/playwright/native_shoot_board_v2_cut_board_web_wait.png`
- 연결 context: `context/context_20260505_native_shoot_board_v2_cut_board.md`
