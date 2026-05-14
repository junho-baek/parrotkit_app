# Context 2026-05-14 Explore Template Copy Affordance

## 작업

Sub-AC 5.1.1: Explore template cards expose a clear copy affordance for available template copy.

## 변경

- `src/features/explore/lib/explore-template-copy-action.ts`
  - `getExploreTemplateActionAffordance`를 추가해 `copy` action이 명시적인 `content-copy` icon/kind를 갖도록 했다.
  - 기존 action 판정은 유지해 unsaved recipe-backed card는 `copy`, saved recipe-backed card는 `shoot`, brand/static card는 `apply`로 남겼다.
- `src/features/explore/lib/explore-template-copy-action.test.ts`
  - available template copy가 `content-copy` affordance를 노출하는 contract를 추가했다.
- `src/features/explore/screens/explore-screen.tsx`
  - unsaved recipe-backed Explore card CTA label을 `Copy template` / `템플릿 복사`로 변경했다.
  - Recommended card CTA와 Browse row CTA/top icon에 helper 기반 icon을 표시해 copy 가능한 card가 bookmark/save처럼 보이지 않게 했다.

## 검증

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json` 통과.
- iPhone simulator QA는 시도했지만 현재 세션에서 CoreSimulatorService 연결이 불가능해 실행하지 못했다.
  - `xcrun simctl list devices available`
  - 실패: `CoreSimulatorService connection became invalid`, `Connection refused`.

## 참고

- real paid/API/upload flow는 추가하지 않았다.
- Source/Recipes bottom tab 복원이나 web QA는 수행하지 않았다.
- shared worktree 상태를 보존하기 위해 commit/push는 수행하지 않았다.
