# Reusable Shooting Recipe Board Context

## 시점
- 2026-05-05 KST

## 배경
- Shoot Board를 제품별 대본이 아니라 재사용 가능한 촬영 패턴 보드로 전환했다.
- 사용자는 컷 보드가 시각적으로 산만하지 않고, 이미지 중심 비디오 에디터가 아니라 Notion toggle list + workout checklist + UGC shooting guide처럼 느껴지길 원했다.
- 최종 피드백으로 상단 summary는 실행 탭에서 불필요하므로 제거하고, `오늘의 메모를 입력해보세요.` CTA 정도만 남기기로 했다.
- 저장 테이크 관련 설명 문구와 별도 박스는 제거하고, 상태는 카드 border strength로만 제공하기로 했다.

## 변경 요약
- `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - `ShootBoardRecipeSummary`, `ShootBoardChecklistItem`, `ShootBoardTake`, take status, completion state를 추가했다.
  - `{product}`, `{main item}`, `{payoff/result}`, `{proof visual}`, `{before state}`, `{after state}`, `{target viewer}` placeholder 기반 재사용 scene copy를 추가했다.
  - `setShootBoardCutCompletion`, `setShootBoardChecklistItem`, `selectShootBoardFinalTake`, `reorderShootBoardCuts`를 추가했다.
  - main completion circle과 내부 checklist item이 양방향으로 동기화된다.
  - scene reorder 후 scene number/title이 재계산되고 checklist/takes는 scene identity에 붙어 유지된다.
  - summary `estimatedLengthSeconds`가 scene 추가 후 total duration과 동기화되도록 했다.
- `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - overview Shoot Board를 note CTA + sticky `CUTS BOARD` + reusable scene card list로 재구성했다.
  - 기존 inline v2 card 구현을 제거하고 새 컴포넌트로 분리했다.
  - MockWorkspace의 실제 scene take store를 board border/take state와 연결해, 촬영 후 저장된 take/final take 상태가 보드에 반영되도록 했다.
  - custom scene은 prompter route가 첫 scene으로 잘못 fallback하지 않도록 scene id를 가진 상태로 추가된다.
- 새 컴포넌트:
  - `shoot-board-note-cta.tsx`
  - `shoot-board-sticky-header.tsx`
  - `shoot-board-scene-card.tsx`
  - `shoot-board-draggable-list.tsx`
- UI 정리:
  - 상단 recipe summary card 제거.
  - `Purpose`/`Template line` 블록 대신 `Line to say`와 `Shooting guideline` 중심으로 축소.
  - `Saved takes`/`No saved takes` 영역 제거.
  - 액션 버튼 라벨을 `Example`, `Result`, `Shoot`로 단순화.
  - shot/take 상태는 neutral/saved/final/reshoot border만으로 표현.

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- `rg -n "summary-card|ShootBoardSummaryCard|Recipe summary|RECIPE SUMMARY|No saved takes|저장된 테이크 없음|Saved takes|TakesArea|Purpose|Template line" parrotkit-app/src/features/recipes/components parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Web QA screenshot:
  - `output/playwright/reusable_shooting_recipe_board_note_cta_web.png`
- iPhone 17 Pro QA:
  - URL: `exp://localhost:8081/--/recipe/recipe-korean-diet-hook`
  - Screenshot: `output/playwright/iphone17pro_reusable_shooting_recipe_board_note_cta.png`

## 리뷰
- Task 1 model spec review: approved.
- Tasks 2-5 UI spec review: approved after fixing downward drag reorder target calculation.
- Code quality review: approved after fixing custom scene route, workspace take hydration, and summary duration sync.

## 남은 리스크
- PanResponder reorder는 전용 DnD 라이브러리보다 단순하다. reorder mode에서만 동작하도록 제한했다.
- Board reorder/checklist/custom scene state는 아직 서버 persistence가 없다.
- Custom scene은 현재 base recipe scene id를 재사용해 prompter flow를 연다. 별도 scene persistence가 생기면 scene 생성까지 확장해야 한다.
