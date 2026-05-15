# Context 2026-05-16 Home Viewport Validation

## 작업
Seed issue 6 Sub-AC 9.4: 대표 iPhone 및 Android Home viewport에서 buttons, headings, card text가 clipping/overlap 없이 들어가는지 수치 기반 layout contract로 검증했다.

## DESIGN.md 확인
- `DESIGN.md`의 Typography, Simplicity Guardrails, Layout 섹션을 확인했다.
- 특히 중복 CTA 제거, concise recipe language, bottom inset/safe-area padding 지침을 기준으로 Home layout budget을 검증했다.

## 변경
- `src/features/home/lib/home-layout.ts`
  - Home section heading, Continue card title, lower Create recipe entry label의 available width helper를 추가했다.
  - 기존 recipe card, saved-take row, create-entry bottom clearance helper와 함께 대표 viewport 검증에 사용할 수 있게 했다.
- `src/features/home/lib/home-layout.test.ts`
  - iPhone compact profile: width 375, bottom inset 34, tab bar 83.
  - Android compact profile: width 360, bottom inset 0, tab bar 68.
  - 각 profile에서 section heading width, Continue title width, two-column recipe card content/action width, saved-take primary text width, Create recipe label width, tab bar clearance를 검증한다.
- `plans/20260516_home_viewport_validation.md`
  - 작업 계획과 결과를 기록했다.

## 검증
- GREEN: `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- GREEN: DESIGN.md source check `rg -n 'Use bottom inset|Typography should reduce UI complexity|Do not add redundant CTA buttons|Avoid the word \`workflow\`|Home should answer' DESIGN.md` 통과.

## 제한
- `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패했다 (`ENOTFOUND`).
- `npm run web -- --port 8099 --non-interactive`는 Expo CLI port scan 중 `RangeError [ERR_SOCKET_BAD_PORT]`로 실패해 로컬 web viewport smoke를 수행하지 못했다.
- Seed 제약에 따라 QA screenshot artifact는 추가하지 않았다.
