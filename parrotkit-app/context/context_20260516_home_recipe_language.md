# Context 2026-05-16 Home Recipe Language

## 작업
Seed issue 6 AC 5: Home Continue copy가 user-facing 영역에서 workflow wording을 노출하지 않고 recipe language를 사용하도록 검증을 갱신했다.

## 변경
- Updated `src/features/home/lib/home-continue-workflow-card.test.ts`
  - `이어갈 워크플로우` expectation을 `이어갈 레시피`로 변경했다.
  - `워크플로우 계속하기` expectation을 `레시피 이어가기`로 변경했다.
  - `Recent workflow` expectation을 `Recent recipe`로 변경했다.
  - Continue card의 title/body/action/section/state/accessibility copy에 `workflow` 또는 `워크플로우`가 들어오면 실패하는 assertion을 추가했다.
- Updated `src/core/i18n/app-language.tsx`
  - Continue fallback title을 `Recipe ready` / `레시피 준비 완료`로 조정했다.
- Updated `src/features/home/components/home-workspace-surface.tsx`
  - Continue card press handler가 derived Continue href를 사용하도록 유지했다.

## 검증
- PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`
- BLOCKED: `npx -y @google/design.md lint DESIGN.md`
  - npm registry DNS 실패: `getaddrinfo ENOTFOUND registry.npmjs.org`

## 리스크 / 후속
- 내부 함수명/type명/file명에는 기존 `workflow` 용어가 남아 있다. 이번 AC는 user-facing copy로 제한했다.
- 동일 파일에 sibling task의 Continue card tappable/no duplicate CTA 변경이 함께 존재한다. 해당 변경은 되돌리지 않았다.
