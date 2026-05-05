# Reusable Shooting Recipe Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task.

## 배경
- `/recipe/:id`는 홈/레시피 탭에서 저장된 레시피를 눌렀을 때 들어가는 실행용 화면이다.
- 이 화면은 레시피 상세/마켓플레이스가 아니라 실제 촬영을 진행하는 Shoot Board여야 한다.
- 사용자는 시각적으로 산만한 이미지/summary/설명 박스를 줄이고, 컷 카드 중심의 실용적인 보드를 원한다.
- 최종 방향은 `오늘의 메모를 입력해보세요.` CTA + sticky `CUTS BOARD` + collapsible scene cards이다.

## 목표
- 제품별 고정 대본이 아니라 `{product}`, `{payoff/result}`, `{proof visual}` 같은 placeholder 기반 재사용 촬영 패턴으로 모델을 정리한다.
- summary card는 제거하고, 상단에는 간단한 오늘의 메모 CTA만 둔다.
- scene card는 `Scene #1: Hook` / `장면 #1: Hook` 형식으로 간결하게 보인다.
- 펼친 카드에는 `Line to say`, `Shooting guideline`, `Required checklist`, `Example`, `Result`, `Shoot`만 제공한다.
- `Saved takes`/`No saved takes` 같은 별도 설명 박스는 제거하고 상태는 카드 border로만 표현한다.
- main completion circle과 내부 checklist item은 양방향으로 동기화한다.
- drag handle로 scene 순서를 바꾸고, reorder 후 scene number는 다시 계산한다.
- 촬영 후 저장된 take/final take 상태는 MockWorkspace scene take store에서 hydrate한다.

## 범위
- In scope:
  - `/recipe/:id` Shoot Board overview.
  - Placeholder 기반 board data model.
  - Local checklist/reorder/take/final-take state.
  - Sticky board header, collapsible scene cards, floating `+ 장면 추가`.
  - Korean/English app language 대응. 단, 실행 버튼 라벨은 `Example`, `Result`, `Shoot`로 짧게 통일.
- Out of scope:
  - 서버 persistence.
  - 실제 비디오 편집기/타임라인 UI.
  - Explore detail page redesign.
  - 새 recipe creation flow.

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - reusable scene fields, checklist helpers, take status, reorder helpers.
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`
  - placeholder copy, checklist sync, final take, reorder, custom scene, duration sync contract checks.
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Shoot Board composition and state wiring.
- Create: `parrotkit-app/src/features/recipes/components/shoot-board-note-cta.tsx`
  - compact `오늘의 메모를 입력해보세요.` CTA.
- Create: `parrotkit-app/src/features/recipes/components/shoot-board-sticky-header.tsx`
  - sticky `CUTS BOARD` header and reorder action.
- Create: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
  - collapsed/expanded scene card, checklist, border status, `Example`/`Result`/`Shoot` actions.
- Create: `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
  - PanResponder reorder list.
- Create: `context/context_20260505_reusable_shooting_recipe_board.md`
  - outcome and verification record.

## 작업 단계
- [x] 최신 context/plans와 git status 확인.
- [x] 모델 계약 테스트를 먼저 작성/갱신.
- [x] reusable Shoot Board model과 helper 구현.
- [x] note CTA, sticky header, scene card, draggable list 컴포넌트 분리.
- [x] `/recipe/:id`에서 새 board state와 component wiring 적용.
- [x] subagent review로 spec/code quality 검토.
- [x] 사용자 후속 피드백 반영:
  - summary card 제거.
  - `Purpose`/`Template line` 축소.
  - `Line to say` 복원.
  - `Saved takes`/`No saved takes` 제거.
  - `Example`, `Result`, `Shoot` 버튼 단순화.
  - border-only take state 유지.
- [ ] 최종 typecheck, diff hygiene, 원격 fetch, commit, push.

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- 불필요 문구 scan:
  - `summary-card`
  - `ShootBoardSummaryCard`
  - `Recipe summary`
  - `RECIPE SUMMARY`
  - `No saved takes`
  - `Saved takes`
  - `Purpose`
  - `Template line`
- iPhone 17 Pro Expo Go QA:
  - URL: `exp://localhost:8081/--/recipe/recipe-korean-diet-hook`
  - Screenshot: `output/playwright/iphone17pro_reusable_shooting_recipe_board_note_cta.png`
- Web QA screenshot:
  - `output/playwright/reusable_shooting_recipe_board_note_cta_web.png`

## 롤백
- 새 컴포넌트 제거:
  - `shoot-board-note-cta.tsx`
  - `shoot-board-sticky-header.tsx`
  - `shoot-board-scene-card.tsx`
  - `shoot-board-draggable-list.tsx`
- `recipe-detail-screen.tsx`를 이전 inline v2 Cut Board 구현으로 되돌린다.
- `shoot-board-model.ts`와 `shoot-board-model.test.ts`를 작업 전 기준으로 되돌린다.

## 리스크
- Manual `PanResponder` reorder는 전용 DnD 라이브러리보다 단순하다. reorder mode에서만 동작하도록 제한했다.
- Sticky header는 iOS native/web 동작 차이가 있을 수 있어 iPhone 17 Pro에서 확인한다.
- Board reorder/checklist/custom scene state는 아직 서버 persistence가 없다.
- Custom scene은 현재 base recipe scene id를 재사용해 prompter flow를 연다. 별도 scene persistence가 생기면 scene 생성까지 확장해야 한다.

## 결과
- 완료 시점: 2026-05-05 KST
- 연결 context: `context/context_20260505_reusable_shooting_recipe_board.md`
- 구현 요약:
  - reusable placeholder 기반 Shoot Board model을 추가했다.
  - summary card를 제거하고 note CTA + sticky `CUTS BOARD` + scene cards 구조로 정리했다.
  - scene card를 `Line to say`, `Shooting guideline`, checklist, `Example`/`Result`/`Shoot` 중심으로 단순화했다.
  - 저장 take 설명 박스를 없애고 border-only status로 정리했다.
  - checklist/main completion sync, saved takes/final take hydration, PanResponder reorder, floating `+ 장면 추가`를 구현했다.
- 검증:
  - `cd parrotkit-app && npx tsc --noEmit`
  - `git diff --check`
  - forbidden copy scan
  - iPhone 17 Pro QA screenshot: `output/playwright/iphone17pro_reusable_shooting_recipe_board_note_cta.png`
