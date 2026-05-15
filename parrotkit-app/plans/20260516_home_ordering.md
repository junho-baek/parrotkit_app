# Home Ordering

## 배경
Seed issue 6 AC 7은 Home에서 `My recipes`가 하단 `Create recipe` 진입점보다 먼저 보여야 한다고 요구한다. `DESIGN.md`도 Home이 continue, create, saved content를 명확한 위계로 보여주되 bottom inset을 확보해야 한다고 명시한다.

## 목표
- Home 섹션 순서 계약에 `My recipes`와 하단 `Create recipe` 진입점을 명시한다.
- `My recipes`가 `Create recipe`보다 위에 오도록 테스트로 고정한다.
- 하단 create entry는 tab bar 위에서 겹치지 않도록 기존 스크롤/하단 여백 구조를 유지한다.

## 범위
- `src/features/home/lib/home-workspace-sections.ts`
- `src/features/home/lib/home-workspace-sections.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `plans/20260516_home_ordering.md`
- `context/context_20260516_home_ordering.md`

## 변경 파일
- 작업 전 계획 기준. 실제 변경 후 결과 섹션에 확정 파일을 남긴다.

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workspace-sections.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`

## 롤백
- 섹션 순서 타입과 테스트 추가분을 되돌리고 Home surface를 이전 하드코딩 순서로 복원한다.

## 리스크
- 병렬 작업이 Home copy 또는 Continue card를 수정 중일 수 있으므로 해당 영역은 건드리지 않는다.

## 결과
- `src/features/home/lib/home-workspace-sections.ts`에 `myRecipes`와 `createRecipe` 섹션 id를 명시하고 순서를 `continueRecentRecipe → welcome → myRecipes → savedTakes → createRecipe`로 고정했다.
- `src/features/home/lib/home-workspace-sections.test.ts`가 `My recipes`가 하단 `Create recipe` 진입점보다 위에 있어야 함을 검증하도록 보강했다.
- 연결 context: `context/context_20260516_home_ordering.md`
