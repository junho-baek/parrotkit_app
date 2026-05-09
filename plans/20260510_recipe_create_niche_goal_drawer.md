# Recipe Create Niche Goal Drawer Plan

## 배경
- 현재 recipe-create drawer에는 mode 설명 카드, board 안내, "What this mode prepares" chips 등 사용자가 불필요하다고 판단한 정보가 있다.
- 사용자는 drawer에서 바로 niche와 goal을 물어보는 흐름을 원한다.
- 디자인은 첨부 이미지처럼 box 안에 box가 중첩되지 않는 open layout이어야 한다.

## 목표
- drawer를 `New recipe` 중심의 간결한 open layout으로 바꾼다.
- mode tabs는 `Blank`, `Link`, `Brand` 3개만 상단에 둔다.
- `Link`와 `Brand`에는 compact Pro badge를 유지한다.
- Link mode에는 underline URL 입력을 노출한다.
- Niche 선택과 Goal 선택을 핵심 입력으로 배치한다.
- CTA는 모든 mode에서 새 draft recipe를 만들고 shoot board로 이동한다.

## 범위
- In scope:
  - `recipe-create-flow`에 niche/goal option과 draft context helper 추가
  - `RecipeCreateScreen` UI를 첨부 이미지 스타일로 재구성
  - context 기록
- Out of scope:
  - 실제 외부 조사/분석 API 연결
  - 이미지 생성 파일 추가
  - 실제 Pro 권한 처리

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-flow.ts`
- Modify: `parrotkit-app/src/features/recipes/lib/recipe-create-flow.test.ts`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-create-screen.tsx`
- Add/Modify: `context/context_20260510_recipe_create_niche_goal_drawer.md`

## 테스트
- `cd parrotkit-app && npx tsx src/features/recipes/lib/recipe-create-flow.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/components/shoot-board-scene-card-layout.test.ts`
- `cd parrotkit-app && npx tsx src/features/recipes/lib/shoot-board-model.test.ts`
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`

## 롤백
- `RecipeCreateScreen`을 이전 drawer tab/detail layout으로 되돌리고 niche/goal helper/test 추가분을 제거한다.

## 리스크
- Goal card 이미지 URL은 remote mock image에 의존한다.
- 모든 mode가 shoot board로 이동하므로 reference/brand 전용 drawer를 기대하는 데모 흐름은 바뀐다.

## 결과
- 기존 mode 설명 카드, board 안내, included chips를 제거했다.
- `New recipe` drawer를 상단 mode tabs, 링크 underline input, niche 선택, goal 이미지 카드, `Open shoot board` CTA 중심으로 재구성했다.
- Link와 Brand mode는 Pro badge를 유지하고, 모든 mode는 선택된 niche/goal context로 draft recipe를 만든 뒤 shoot board로 이동한다.
- Context 기록: `context/context_20260510_recipe_create_niche_goal_drawer.md`
