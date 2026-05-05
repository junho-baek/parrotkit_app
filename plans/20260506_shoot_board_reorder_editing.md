# Shoot Board Reorder And Editing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Shoot Board scene ordering actually usable, allow per-card text editing and reset, and document the current Example/Result/Shoot route behavior.

**Architecture:** Keep `/recipe/[recipeId]` as the Shoot Board route. Improve the existing board model with edit/reset helpers, make the drag handle reorder scenes live while preserving scene identity, and render subtle inline text inputs inside each expanded scene card.

**Tech Stack:** Expo Router, React Native, NativeWind, `PanResponder`, TypeScript compile checks.

---

## 배경
- 사용자는 Shoot Board에서 드래그앤드랍 순서 변경이 실제로 동작하지 않는다고 보고했다.
- 순서가 바뀌면 `Scene #N` / `장면 #N` 숫자도 즉시 바뀌어야 한다.
- 새 장면과 기존 레시피 장면 모두 카드 안 세부 텍스트를 수정할 수 있어야 한다.
- 각 카드마다 기본값으로 되돌릴 수 있어야 한다.
- `Example`/`Result` 버튼은 현재 별도 route가 아니라 같은 `/recipe/[recipeId]` 내부 scene workspace tab으로 전환되는 구조다.

## 목표
- drag handle을 잡고 위/아래로 움직이면 scene order가 즉시 바뀌고 scene title number도 재계산된다.
- 드래그는 reorder mode를 켜지 않아도 handle에서 동작하고, 드래그 중 ScrollView 스크롤 충돌을 줄인다.
- expanded card에서 다음 텍스트를 직접 수정할 수 있다:
  - instruction
  - Line to say
  - Shooting guideline
  - checklist item labels
- 각 card에 reset action을 제공해 해당 scene만 원본 텍스트로 되돌린다.
- 후속 UI 피드백에 따라 `EDIT TEXT` 라벨과 내부 구분선은 제거하고, 기본 읽기 모드에서 `Edit` 버튼을 눌렀을 때만 편집할 수 있게 한다.
- add scene으로 만든 card도 수정/복원이 가능하다.
- route contract를 context에 남긴다:
  - Shoot Board: `/recipe/[recipeId]`
  - Example: same screen, `analysis` tab
  - Result: same screen, `shoot` tab
  - Shoot camera: `/recipe/[recipeId]/prompter?sceneId=[sceneId]`

## 범위
- In scope:
  - Shoot Board overview and scene card UI.
  - Local-only editing/reset state.
  - Model helper tests and TypeScript verification.
- Out of scope:
  - 서버 persistence.
  - 별도 Example/Result route 생성.
  - 새 native DnD 라이브러리 설치.

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.ts`
  - add editable text helper, reset helper, move helper.
- Modify: `parrotkit-app/src/features/recipes/lib/shoot-board-model.test.ts`
  - add behavior checks for moving, editing, resetting.
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-draggable-list.tsx`
  - make handle drag reorder live and report drag state.
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
  - add subtle inline text inputs and reset action.
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - keep original cut snapshots, wire update/reset/move handlers, disable scroll while dragging.
- Add: `context/context_20260506_shoot_board_reorder_editing.md`
  - record route behavior, changes, verification.

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- iPhone 17 Pro Expo Go QA on `exp://localhost:8081/--/recipe/recipe-korean-diet-hook`
- Manual QA:
  - drag Scene #1 handle down and confirm it becomes Scene #2 or lower.
  - drag a later scene up and confirm numbering changes.
  - edit Line to say and Shooting guideline.
  - reset a card and confirm only that card reverts.
  - add scene, edit it, reset it.
  - tap Example/Result/Shoot and confirm expected destinations.

## 롤백
- Revert the files listed in 변경 파일 to commit `7b40251`.
- If drag behavior regresses scrolling, keep model edit/reset helpers and temporarily disable handle drag by reverting only `shoot-board-draggable-list.tsx`.

## 리스크
- Manual PanResponder reorder is simpler than a dedicated DnD library and may not support fancy animated drop targets.
- Text edits are local-only and reset on app reload until persistence is designed.
- `Example`/`Result` currently reuse the existing scene workspace tabs, which may still feel like route changes to users even though URL does not change.

## 작업 단계
- [x] Write model tests for move/edit/reset behavior.
- [x] Run TypeScript and confirm tests fail before helper implementation.
- [x] Implement model helpers.
- [x] Wire drag live reorder and scroll disabling.
- [x] Add inline editing and reset UI.
- [x] Remove edit label/dividers and gate inputs behind an Edit button.
- [x] Update context.
- [x] Run final verification and fetch remote.
- [x] Commit and push.
