# Context 2026-05-14 Explore Saved Template Start Filming

## 작업

Sub-AC 23.3.1: saved Explore-derived recipe templates expose a clear start-filming action from their saved recipe detail/list entry.

## 변경

- `src/features/home/components/home-workspace-surface.tsx`
  - Home `내 레시피` / `My recipes` saved recipe cards가 shared `SavedRecipeAccessEntry`를 직접 받아 렌더링하도록 정리했다.
  - 각 saved recipe card에 `촬영 시작` / `Start filming` 버튼을 추가하고 `entry.startFilmingDestination`으로 이동하게 했다.
  - 카드 제목/이미지는 기존 saved recipe board open 동작을 유지한다.
- `src/features/profile/screens/profile-screen.tsx`
  - My/Profile saved recipe row에 별도 `촬영 시작` / `Start` 버튼을 추가했다.
  - row main press는 기존 recipe board reopen destination을 유지하고, start button은 `startFilmingDestination`을 사용한다.
- `src/features/recipes/lib/saved-take-home-access.test.ts`
  - copied Explore recipe가 My/Profile saved recipe entry에서도 start-filming destination을 노출하는지 assertion을 추가했다.
- `plans/20260514_explore_saved_template_start_filming.md`
  - 결과와 연결 context를 기록했다.

## 검증

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.saved-take-home-access-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.

## 참고

- Explore recipe detail screen에는 기존 `촬영 시작` / `Start Shooting` CTA가 이미 있고, 저장되지 않은 template은 먼저 local/mock owned recipe로 저장한 뒤 board route로 이동한다.
- 데이터 범위는 기존 local/mock state에 머물며 login, cloud sync, server storage, payment, search/community/recommendation 기능은 추가하지 않았다.
- shared worktree에 sibling AC 변경이 많아 commit/push는 수행하지 않았다.
