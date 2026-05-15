# Context 2026-05-16 Root Home Deeplink Resolution

## 작업
Issue 6 Sub-AC 4.2: Root/Home deeplink resolution이 iOS/Android에서 Home screen으로 수렴하도록 `/home` route를 추가했다.

## DESIGN.md 확인
- `DESIGN.md`의 Bottom navigation and creation entry 섹션을 확인했다.
- Home, Explore, Paste, Recipes, My 5-slot 모델과 Paste 중심 action, box-in-box/redundant CTA guardrail을 확인했다.

## 변경
- `src/app/home.tsx`
  - `/home` deep link route를 추가했다.
  - HomeScreen을 직접 렌더링하지 않고 `<Redirect href="/" />`로 canonical root Home route에 수렴시켜 tab shell을 유지한다.
- `src/core/navigation/root-tab-config.test.ts`
  - `/home` route가 `/`로 redirect하는 계약을 추가했다.
  - `/home`이 HomeScreen을 직접 렌더링해 root tab shell을 우회하지 않도록 guard를 추가했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
  - `src/app/home.tsx` 부재로 `ENOENT` 실패함을 확인했다.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false` 통과.
- DESIGN.md guard: bottom navigation 섹션과 box-in-box/redundant CTA guardrail 문구 존재를 확인했다.
- 금지 copy 검색: 변경 파일 범위에서 `Shoot`, `New Shoot`, `Start Shoot`, `workflow`, `console`, `debug` 검색 결과가 없었다.
- BLOCKED: `npx -y @google/design.md lint DESIGN.md`
  - restricted network에서 npm registry DNS 실패: `getaddrinfo ENOTFOUND registry.npmjs.org`.

## 리스크
- 실제 iOS/Android simulator deep-link QA는 이번 Sub-AC에서 수행하지 않았다.
- 현재 worktree에는 sibling-agent 변경이 많이 남아 있어 이번 작업만 분리 commit/push하지 않았다.
