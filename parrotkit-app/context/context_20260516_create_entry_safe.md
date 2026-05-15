# Context 2026-05-16 Create Entry Safe

## 작업
Issue 6 AC 8: Home 하단 `Create recipe` 진입점이 native tab bar 위에 안전하게 위치하도록 bottom inset 계약을 명시했다.

## DESIGN.md 확인
- `DESIGN.md`의 Typography, Simplicity Guardrails, Layout 섹션을 확인했다.
- 특히 `Use bottom inset and safe-area padding so FABs, tab bars, and fixed CTAs do not cover content.` 지침을 적용했다.

## 변경
- `src/features/home/lib/home-layout.ts`
  - Home scroll bottom padding을 `188 + bottomInset`으로 계산하는 helper를 추가했다.
- `src/features/home/lib/home-layout.test.ts`
  - compact phone에서 최소 188pt 하단 여백을 확보하는지 확인한다.
  - home indicator inset이 정확히 한 번 더해지는지 확인한다.
  - iPhone home indicator 환경에서 최소 222pt 여백을 확보하는지 확인한다.
- `src/features/home/components/home-workspace-surface.tsx`
  - `useSafeAreaInsets()`로 safe-area bottom inset을 읽고 `AppScreenScrollView`에 `bottomPadding`을 명시 전달한다.
- `tsconfig.home-recipe-create-entry-check.json`
  - Home layout helper/test를 focused TypeScript check에 포함했다.
- `plans/20260516_create_entry_safe.md`
  - 작업 결과와 연결 context를 기록했다.

## 검증
- RED: `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
  - `Cannot find module './home-layout'`로 실패해 layout 계약 부재를 확인했다.
- GREEN: `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false` 통과.
- DESIGN.md source check: `rg -n "Use bottom inset|Creation entry|Home should answer|Typography should reduce UI complexity|workflow" DESIGN.md` 통과.

## 제한
- `npx -y @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패해 실행 완료하지 못했다 (`ENOTFOUND`).
- iPhone/Android native screenshot QA는 이 AC-only 작업 범위에서 수행하지 않았다.
