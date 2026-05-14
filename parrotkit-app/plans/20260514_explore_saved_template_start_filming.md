# Explore Saved Template Start Filming

## 배경

- Explore 템플릿을 저장하면 local/mock owned recipe로 Home과 My/Profile saved recipe 목록에 나타난다.
- 이번 Sub-AC는 저장된 Explore-derived recipe template entry에서 촬영 시작 액션이 명확히 보이는지 보장한다.

## 목표

- Saved recipe access entry에 촬영 시작 destination contract를 추가한다.
- Explore에서 저장된 owned recipe도 같은 start-filming destination을 갖도록 검증한다.
- Home/My saved recipe list UI에서 저장된 레시피 entry에 명시적 촬영 시작 액션을 노출한다.

## 범위

- Saved recipe access helper와 focused contract test.
- Home saved recipe cards.
- My/Profile saved recipe rows.

## 변경 파일

- `plans/20260514_explore_saved_template_start_filming.md`
- `src/features/recipes/lib/saved-take-home-access.ts`
- `src/features/recipes/lib/saved-take-home-access.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `src/features/profile/screens/profile-screen.tsx`
- `context/context_20260514_explore_saved_template_start_filming.md`

## 테스트

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json`
- 가능하면 full TypeScript check.

## 롤백

- `startFilmingDestination` contract와 Home/Profile 버튼 wiring을 제거하면 기존 saved recipe list open-only behavior로 돌아간다.

## 리스크

- shared worktree에 sibling AC 변경이 많으므로 unrelated edits는 건드리지 않는다.
- 촬영 시작 destination은 현재 v1 board route(`/recipe/:id`)를 사용하며, 별도 서버/클라우드 state를 추가하지 않는다.

## 결과

- `SavedRecipeAccessEntry.startFilmingDestination` contract를 Home saved recipe card와 My/Profile saved recipe row에서 실제 촬영 시작 버튼으로 노출했다.
- Explore-derived copied recipe가 My/Profile saved recipe entry에서도 촬영 시작 destination을 유지하는 contract assertion을 추가했다.
- 연결 context: `context/context_20260514_explore_saved_template_start_filming.md`
