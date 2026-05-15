# Home Recipe Language

## 배경
Seed issue 6의 AC 5는 Home Continue가 사용자에게 workflow가 아니라 recipe language로 보여야 한다. `DESIGN.md`도 일반 UI에서 `workflow` 같은 내부 상태 표현을 피하라고 명시한다.

## 목표
- Home Continue card의 사용자-facing copy를 recipe 중심으로 유지한다.
- regression test가 `workflow` copy 재도입을 잡도록 보강한다.
- 병렬 작업 중인 bottom tab, hidden route, Home ordering 파일은 건드리지 않는다.

## 범위
- `src/features/home/lib/home-continue-workflow-card.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `src/core/i18n/app-language.tsx`
- `plans/20260516_home_recipe_language.md`
- `context/context_20260516_home_recipe_language.md`

## 변경 파일
- `src/core/i18n/app-language.tsx`
- `src/features/home/components/home-workspace-surface.tsx`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `plans/20260516_home_recipe_language.md`
- `context/context_20260516_home_recipe_language.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 롤백
- Home Continue card copy expectation과 fallback copy 변경을 이전 값으로 되돌리고, 추가한 plan/context 문서를 제거한다.

## 리스크
- 내부 타입/파일명에는 기존 workflow 명칭이 남아 있다. 이번 AC는 사용자-facing copy로 제한한다.
- 동일 Home surface/test 파일에 sibling task의 Continue CTA simplification 변경이 함께 존재한다. 되돌리지 않고 그 상태에 맞춰 focused validation만 수행했다.

## 결과
- Home Continue card view-model regression을 recipe language 기준으로 갱신했다.
- Korean in-progress Continue section/action은 `이어갈 레시피` / `레시피 이어가기`를 기대한다.
- English recent Continue section은 `Recent recipe`를 기대한다.
- Continue card 사용자-facing/accessibility fields에 `workflow` / `워크플로우`가 들어오면 실패하는 assertion을 추가했다.
- Home Continue fallback title copy를 `Recipe ready` / `레시피 준비 완료`로 조정했다.
- Continue card press route는 기존 Continue href contract를 사용하도록 유지했다.
- 검증:
  - PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`
  - BLOCKED: `npx -y @google/design.md lint DESIGN.md` failed with npm registry DNS `ENOTFOUND`.
- 연결 context: `context/context_20260516_home_recipe_language.md`
