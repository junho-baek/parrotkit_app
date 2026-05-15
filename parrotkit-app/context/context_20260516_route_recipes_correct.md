# Context 2026-05-16 Route Recipes Correct

## 작업
Issue 6 AC 6: 하단 Recipes 탭이 Source/Paste 생성 액션이나 다른 의도하지 않은 route가 아니라 저장된 레시피 / 레시피 목록 화면을 열도록 route contract를 고정했다.

## DESIGN.md 확인
- `DESIGN.md`를 먼저 확인했다.
- Preferred v1 bottom navigation model이 Home, Explore, Paste, Recipes, My이며, box-in-box/redundant CTA/user-facing workflow copy guardrail이 있음을 확인했다.
- AC 6 작업은 UI copy를 추가하지 않고 route contract만 보강했다.

## 변경
- `src/core/navigation/root-tab-config.test.ts`
  - `rootTabHrefs.recipes`가 `rootTabHrefs.source` 또는 `rootPasteActionHref`와 같으면 실패하도록 추가 검증했다.
  - `rootTabHrefs.recipes`가 `/recipes` deep-link를 유지하는지 명시적으로 검증했다.
  - `src/app/(tabs)/recipes.tsx`가 `RecipesScreen`을 default export하는지 파일 route contract를 검증했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: DESIGN.md guardrail 확인
  - `rg -n 'Preferred v1 bottom navigation model|Paste as the larger center action|Do not create box-in-box|Do not add redundant CTA|Avoid the word \`workflow\`' DESIGN.md`
- PASS: navigation 범위 금지 copy 검색
  - `rg -n "Shoot|New Shoot|Start Shoot|workflow|console|debug" src/core/navigation -S`
  - 결과는 기존 내부 `QuickShoot` 식별자와 test 문구뿐이며 AC 6에서 새 user-facing copy를 추가하지 않았다.
- BLOCKED: 전체 타입 체크
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 실패: `src/core/navigation/paste-drawer-state.test.ts(1,45): error TS2307: Cannot find module './paste-drawer-state' or its corresponding type declarations.`
  - 이 파일은 sibling Paste drawer 작업 범위로 보이며 AC 6 변경과 직접 관련이 없다.

## 리스크
- 실제 iPhone/Android 탭 클릭 QA는 별도 QA AC에서 수행해야 한다.
- 현재 shared worktree에 sibling 변경이 많아 커밋/푸시는 전체 AC 통합 시점에 정리되어야 한다.
