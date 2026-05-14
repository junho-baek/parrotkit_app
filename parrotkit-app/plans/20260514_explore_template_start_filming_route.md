# Explore Template Start Filming Route Metadata

## 배경

- Explore recipe detail의 촬영 시작 액션은 현재 템플릿을 로컬 owned 레시피로 저장한 뒤 컷보드 상세(`/recipe/:id`)로 이동한다.
- 이번 Sub-AC는 촬영 시작 액션이 저장된 템플릿 레시피 id를 사용해 바로 촬영/프롬프터 플로우로 진입하고, 원본 Explore 템플릿 메타데이터를 route query로 전달하도록 보장한다.

## 목표

- Start Shooting / 촬영 시작 버튼이 saved owned template recipe id로 filming route를 연다.
- 원본 Explore recipe id와 source kind metadata가 route query에 포함된다.
- 이미 저장된 템플릿도 같은 destination contract를 사용한다.

## 범위

- Explore template start-filming route helper.
- Explore recipe detail start action wiring.
- Focused TypeScript contract check.

## 변경 파일

- `src/features/explore/lib/explore-template-recipe-copy.ts`
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `context/context_20260514_explore_template_start_filming_route.md`

## 테스트

- Red: helper/export를 사용하는 contract가 없거나 expected route와 다르면 focused TypeScript check 실패.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
- 가능하면 full `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 롤백

- Explore detail start action을 기존 `getShootBoardHref(targetRecipe.id)` 이동으로 되돌리고 helper/test/context를 제거한다.

## 리스크

- shared worktree에 sibling AC 변경이 많으므로 unrelated edits를 건드리지 않는다.
- route query metadata는 local/mock flow의 handoff 용도이며 server/cloud 저장을 도입하지 않는다.
