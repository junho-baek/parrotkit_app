# Context 2026-05-16 Route My Correct

## 작업
Issue 6 AC 7: 하단 `My` 탭이 의도한 My/Profile 화면을 열도록 root tab route contract를 보강했다.

## DESIGN.md 확인
- `DESIGN.md`를 먼저 확인했다.
- Preferred v1 bottom navigation model이 Home, Explore, Paste, Recipes, My이며, box-in-box/redundant CTA/user-facing workflow copy guardrail이 있음을 확인했다.
- AC 7 작업은 UI copy를 추가하지 않고 `My` route contract만 보강했다.

## 변경
- `src/core/navigation/root-tab-config.test.ts`
  - `rootTabHrefs.my`가 `/my` deep-link를 유지하는지 명시적으로 검증했다.
  - `My` tab href가 Home, Explore, Paste, Recipes href와 겹치지 않도록 검증했다.
  - `src/app/(tabs)/my.tsx`가 `ProfileScreen`을 default export하는지 root tab contract에서 검증했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.my-profile-entry-check.json`
- PASS: DESIGN.md guardrail 확인
  - `rg -n 'Preferred v1 bottom navigation model|Paste as the larger center action|Do not create box-in-box|Do not add redundant CTA|Avoid the word \`workflow\`' DESIGN.md`

## 리스크
- 실제 iPhone/Android 탭 클릭 QA는 별도 QA AC에서 수행해야 한다.
- 현재 shared worktree에 sibling 변경이 많아 커밋/푸시는 전체 AC 통합 시점에 정리되어야 한다.
