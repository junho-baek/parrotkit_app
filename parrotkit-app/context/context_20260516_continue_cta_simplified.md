# Context 2026-05-16 Continue CTA Simplified

## 작업
Issue 6 AC 6: Home Continue card가 자체적으로 tappable CTA 역할을 하며, 내부에 중복되는 큰 CTA button/copy를 렌더링하지 않도록 정리했다.

## DESIGN.md 확인
- `DESIGN.md`의 Simplicity Guardrails를 확인했다.
- 특히 “Do not add redundant CTA buttons when the whole card already acts as the CTA”와 card press + chevron 선호 규칙을 적용했다.

## 변경
- `src/features/home/components/home-workspace-surface.tsx`
  - Continue recipe card container를 `View` + 내부 row `Pressable` 구조에서 `styles.continueCard`가 적용된 단일 `Pressable` 구조로 바꿨다.
  - card press는 기존 `onOpenRecipe` 경로를 그대로 사용한다.
  - progress bar 옆에 렌더링하던 `card.actionLabel` text를 제거해 card 자체 CTA와 중복되지 않게 했다.
  - 더 이상 쓰이지 않는 continue button/state pill style을 제거했다.
- `src/features/home/lib/home-continue-workflow-card.test.ts`
  - Continue card surface 자체가 `onOpenRecipe` Pressable인지 검사한다.
  - tappable card 안에서 duplicate `card.actionLabel` CTA가 다시 렌더링되면 실패하도록 검사한다.

## 검증
- RED 확인: 새 assertion 추가 후 `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`가 duplicate actionLabel 렌더링 때문에 실패함을 확인했다.
- GREEN 확인: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `test -s DESIGN.md && rg -n 'Do not add redundant CTA buttons|card press|Avoid the word `workflow`|Use bottom inset' DESIGN.md`로 관련 디자인 원칙 존재를 확인했다.

## Blocked Verification
- `npx --no-install @google/design.md lint DESIGN.md`는 npm registry DNS 차단으로 실패했다: `getaddrinfo ENOTFOUND registry.npmjs.org`.
- repo의 `npm run`에는 lint/typecheck/design lint script가 노출되어 있지 않다.

## 리스크
- Native screenshot QA는 이 AC-only 실행에서 수행하지 않았다.
- 같은 Home files에 sibling agent 변경이 섞여 있을 수 있어, 이번 작업은 Continue card tappability/duplicate CTA 제거에 필요한 최소 변경만 추가했다.
