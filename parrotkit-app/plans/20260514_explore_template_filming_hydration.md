# Explore Template Filming Hydration

## 배경

- Explore 템플릿의 촬영 시작 흐름은 저장된 local/mock 레시피 id와 원본 Explore template metadata를 prompter route query로 전달한다.
- 이번 Sub-AC는 촬영 화면이 저장된 템플릿에서 컷카드/프롬프터 내용을 촬영 전부터 안정적으로 사용할 수 있도록 보장한다.

## 목표

- 저장된 Explore-derived template filming route가 saved recipe id를 우선 사용한다.
- 저장 직후 state 반영 타이밍 등으로 saved recipe lookup이 비어도 source template metadata로 filming 내용을 hydrate한다.
- 촬영 전 current cut card text와 full script가 비어 있지 않도록 focused contract test를 추가한다.

## 범위

- Explore template filming hydration helper.
- Prompter camera screen recipe resolution.
- Focused TypeScript contract test.

## 변경 파일

- `plans/20260514_explore_template_filming_hydration.md`
- `src/features/explore/lib/explore-template-recipe-copy.ts`
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
- `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `context/context_20260514_explore_template_filming_hydration.md`

## 테스트

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
- 가능하면 full `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 롤백

- Hydration helper와 prompter fallback resolution을 제거하면 기존 recipe id 단일 lookup 동작으로 돌아간다.

## 리스크

- Shared worktree에 sibling AC 변경이 많으므로 unrelated edits를 건드리지 않는다.
- Hydration은 local/mock recipe/source data만 사용하고 login, cloud sync, server storage를 추가하지 않는다.

## 결과

- Explore start-filming URL이 saved recipe id, source kind, source recipe id, first scene id를 prompter route로 전달하도록 Explore list/detail 시작 액션을 정리했다.
- `hydrateExploreTemplateFilmingRecipe`를 추가해 prompter route가 saved recipe를 우선 사용하고, 저장 직후 state가 비어 있으면 원본 Explore template에서 owned recipe를 local/mock으로 합성해 촬영 전 컷카드/프롬프터 내용을 유지하도록 했다.
- Prompter camera screen이 route metadata를 사용해 촬영 플로우 recipe를 resolve하도록 연결했다.
- 연결 context: `context/context_20260514_explore_template_filming_hydration.md`
