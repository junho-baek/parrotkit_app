# Context 2026-05-16 Home Create Entry Spacing Verify

## 작업
Issue 6 Sub-AC 9.3: Home 하단 `Create recipe` entry가 iPhone과 Android에서 native tab bar 및 safe area 위에 완전히 보이도록 spacing 계약을 검증하고 보강했다.

## DESIGN.md 확인
- `DESIGN.md`의 Layout, CTA copy, Simplicity Guardrails 섹션을 확인했다.
- 특히 `Use bottom inset and safe-area padding so FABs, tab bars, and fixed CTAs do not cover content.` 지침을 기준으로 삼았다.

## 변경
- `src/features/home/lib/home-layout.ts`
  - `getHomeCreateEntryBottomClearance()` helper를 추가해 scroll bottom padding, visible clearance, required clearance를 명시적으로 계산한다.
  - 기본 create entry 높이 64pt와 tab bar 위 최소 gap 24pt를 계약화했다.
- `src/features/home/lib/home-layout.test.ts`
  - iPhone home indicator 프로필(`bottomInset: 34`, `tabBarHeight: 83`)에서 Create recipe entry가 native tab bar 위에 충분한 visible clearance를 갖는지 검증한다.
  - Android tab bar 프로필(`bottomInset: 0`, `tabBarHeight: 68`)에서 동일한 clearance를 검증한다.
- `plans/20260516_home_create_entry_spacing_verify.md`
  - 작업 계획과 결과를 기록했다.

## 검증
- RED: `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
  - `getHomeCreateEntryBottomClearance` helper 부재로 실패해 spacing 계약 누락을 확인했다.
- GREEN: `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false` 통과.
- DESIGN.md source check: `rg -n 'Use bottom inset|Creation entry|Primary creation entry|Create recipe|Do not use \`Shoot\`|Home should answer' DESIGN.md` 통과.

## 제한
- `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패해 실행 완료하지 못했다 (`ENOTFOUND`). repo 안에는 대체 local DESIGN.md lint binary/script가 없다.
- Seed 제약에 따라 QA screenshot artifact는 추가하지 않았다.
