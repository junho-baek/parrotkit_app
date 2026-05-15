# Home Blank Shoot-board Entry

## 배경

- Sub-AC 3.2: Home must expose a clear path to create a new blank shoot-board.
- Earlier work wired the actual blank recipe creation flow, but Home can prioritize an existing continue/recent workflow, so the new blank path should remain explicit.

## 목표

- Home에서 기존 continue workflow와 별개로 새 blank shoot-board 시작 경로를 항상 보이게 한다.
- 진입점은 `/recipe-create?mode=manual`을 유지해 Reference/Brand paid/API/upload 흐름을 추가하지 않는다.

## 범위

- Home create entry copy/helper.
- Home surface UI wiring.
- Focused helper/type verification.

## 변경 파일

- `src/features/home/lib/home-recipe-create-entry.ts`
- `src/features/home/lib/home-recipe-create-entry.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `context/context_20260514_home_blank_shoot_board_entry.md`

## 테스트

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-recipe-create-entry.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
- iPhone simulator availability check.

## 롤백

- Home의 secondary blank shoot-board entry를 제거하고 helper/test copy를 이전 레시피 생성 라벨로 되돌린다.

## 리스크

- Simulator 접근이 현재 sandbox에서 막혀 있으면 수동 UI 증거를 새로 남기지 못할 수 있다.
