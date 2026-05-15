# Home Create Entry Spacing Verify

## 배경
Seed issue 6 Sub-AC 9.3은 Home 하단 `Create recipe` entry가 iPhone과 Android에서 bottom tab bar 및 safe area 위에 완전히 보여야 한다고 요구한다. 이전 AC 8에서 bottom padding helper가 추가되었지만, 이번 작업에서는 실제 tab bar 높이와 entry 높이를 기준으로 검증 계약을 더 명시한다.

## 목표
- Home lower Create recipe entry가 native tab bar 위에서 잘림/겹침 없이 보이는 spacing 계약을 추가한다.
- iPhone home indicator와 Android tab bar 프로필을 모두 테스트한다.
- 기존 Home hierarchy, recipe copy, sibling-agent navigation 변경을 건드리지 않는다.

## 범위
- `src/features/home/lib/home-layout.ts`
- `src/features/home/lib/home-layout.test.ts`
- `context/context_20260516_home_create_entry_spacing_verify.md`
- `plans/20260516_home_create_entry_spacing_verify.md`

## 변경 파일
- 작업 전 계획 기준. 실제 변경 후 결과 섹션에 확정 파일을 남긴다.

## 테스트
- `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`
- DESIGN.md 관련 lint/source check

## 롤백
- Home layout helper/test에 추가한 create-entry clearance 계약을 제거하고 이전 `getHomeScrollBottomPadding` 기반 검증만 남긴다.

## 리스크
- 현재 worktree에는 sibling AC 변경이 다수 있으므로 이번 작업은 Home layout helper/test와 context/plan 기록에만 제한한다.

## 결과
- `src/features/home/lib/home-layout.ts`에 `getHomeCreateEntryBottomClearance()`를 추가해 native tab bar 위 visible clearance 계약을 명시했다.
- `src/features/home/lib/home-layout.test.ts`에 iPhone home indicator와 Android tab bar 프로필 검증을 추가했다.
- 검증 통과:
  - `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`
  - `./node_modules/.bin/tsc --noEmit --pretty false`
  - DESIGN.md 관련 source check
- 제한: `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network DNS 제한(`ENOTFOUND registry.npmjs.org`)으로 완료하지 못했다.
- 연결 context: `context/context_20260516_home_create_entry_spacing_verify.md`
