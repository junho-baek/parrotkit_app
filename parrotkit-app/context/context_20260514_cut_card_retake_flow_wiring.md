# Context 2026-05-14 Cut Card Retake Flow Wiring

## 작업

Sub-AC 12.4.2 범위로 expanded cut card의 Retake action을 해당 컷/테이크 상태와 prompter retake flow에 연결했다.

## 변경

- `src/features/recipes/lib/shoot-board-model.ts`
  - `getRecipeRetakePrompterHref` helper 추가
  - Retake route에 `sceneId`, `cutId`, `retakeTakeId`를 포함해 scene-level 촬영과 구분
- `src/features/recipes/lib/shoot-board-model.test.ts`
  - Retake action route가 컷 id와 저장 take id를 보존하는 contract 추가
- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - expanded Retake 버튼에서 `takeViewer.activeTake`를 shoot callback으로 전달
  - 기존 일반 Shoot path는 no-arg callback으로 유지
- `src/features/recipes/components/shoot-board-draggable-list.tsx`
  - `onShoot(cut, take?)` callback 형태로 cut/take context 전달
- `src/features/recipes/screens/recipe-detail-screen.tsx`
  - Retake일 때 `getRecipeRetakePrompterHref`를 사용해 target take context와 함께 prompter 시작
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - `retakeTakeId` route param 추가
  - `activeSceneId`, `cutId`, `retakeTakeId` 변경 시 review/save state reset

## 검증

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - `getRecipeRetakePrompterHref` missing export로 실패 확인
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 통과

## 연결된 plan

- `plans/20260514_cut_card_retake_flow_wiring.md`

## 주의

- 이 worktree에는 sibling AC 변경과 untracked 산출물이 많아 이 subtask 단독 commit/push는 수행하지 않았다.
