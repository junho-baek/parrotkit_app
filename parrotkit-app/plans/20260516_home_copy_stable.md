# Home Copy Stable

## 배경
Seed issue 6 AC 11은 Home copy가 간결하고 recipe/reference 중심이어야 하며 사용자-facing 영역에 workflow wording이 재도입되지 않아야 한다. `DESIGN.md`는 Home을 workflow console처럼 보이게 하지 말고 product language를 쓰라고 규정한다.

## 목표
- Home primary CTA copy가 recipe 중심 문구를 유지하도록 regression guard를 보강한다.
- 사용자-facing Home CTA copy에 `workflow`, `Shoot`, `console`, `debug` 계열 문구가 들어오면 테스트가 실패하도록 한다.

## 범위
- `src/features/home/lib/home-primary-cta.test.ts`
- `plans/20260516_home_copy_stable.md`
- `context/context_20260516_home_copy_stable.md`

## 변경 파일
- `src/features/home/lib/home-primary-cta.test.ts`
- `plans/20260516_home_copy_stable.md`
- `context/context_20260516_home_copy_stable.md`

## 테스트
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
- `npx -y @google/design.md lint DESIGN.md`

## 롤백
- 추가한 Home CTA copy guard assertion을 제거한다.
- 이번 작업 plan/context 문서를 제거한다.

## 리스크
- 병렬 작업 중인 navigation 및 Home layout 변경이 같은 worktree에 있다. 이번 작업은 Home CTA regression test에만 집중하고 sibling 변경은 되돌리지 않는다.
- 내부 파일명, 함수명, 테스트 설명에는 legacy workflow 용어가 남을 수 있다. 이번 기준은 user-facing Home copy fields이다.

## 결과
- Home primary CTA test에 `assertStableHomeCopy`를 추가했다.
- English/Korean continue/start CTA copy fields에 `workflow`, `워크플로우`, `Shoot`, `New Shoot`, `Start Shoot`, `console`, `debug` wording이 들어오면 실패하도록 했다.
- 검증:
  - PASS: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
  - PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
  - PASS: `./node_modules/.bin/tsc --noEmit --pretty false`
  - BLOCKED: `npx -y @google/design.md lint DESIGN.md` failed with npm registry DNS `ENOTFOUND`.
- 연결 context: `context/context_20260516_home_copy_stable.md`
