# Context 2026-05-16 Home Header Compact Layout

## 작업
Seed issue 6 Sub-AC 9.1: iPhone 폭 Home 화면에서 header/heading/button controls가 잘리거나 겹치지 않도록 compact layout 계약과 Home card action layout을 보강했다.

## DESIGN.md 확인
- `DESIGN.md`의 Typography, Simplicity Guardrails, Layout, CTA copy 섹션을 확인했다.
- 특히 Home UI는 간결한 recipe language를 쓰고, heading/button copy가 중복되거나 control 영역을 과밀하게 만들지 않아야 한다는 지침을 적용했다.

## 변경
- `src/features/home/lib/home-layout.ts`
  - 375px iPhone 폭에서 Home two-column recipe card의 실제 content width를 계산하는 helper를 추가했다.
  - card 하단 meta + icon controls가 필요한 최소 폭을 계산하는 helper를 추가했다.
- `src/features/home/lib/home-layout.test.ts`
  - compact iPhone card width 모델을 검증한다.
  - Home recipe card action controls가 compact card content width를 넘지 않는지 검증한다.
- `src/features/home/components/home-workspace-surface.tsx`
  - Continue / My recipes / Saved takes section heading에 `min-w-0`, `flex-1`, `numberOfLines={1}`를 적용해 trailing action과 충돌하지 않게 했다.
  - My recipes card 하단 Manage / Start filming visible text를 제거하고, 기존 accessibility labels와 navigation handlers를 유지한 38px icon buttons로 바꿨다.
- `plans/20260516_home_header_compact_layout.md`
  - 작업 결과와 연결 context를 기록했다.

## 검증
- RED: `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
  - compact layout helper 부재로 실패해 layout 계약이 없음을 확인했다.
- GREEN: `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- DESIGN.md source check: `rg -n 'Typography should reduce UI complexity|Do not add redundant CTA buttons|Use bottom inset|Avoid the word \`workflow\`|Primary creation entry' DESIGN.md` 통과.

## 제한
- `npx --no-install @google/design.md lint DESIGN.md`는 npm registry DNS 제한으로 실패했다: `getaddrinfo ENOTFOUND registry.npmjs.org`.
- 이 Sub-AC는 screenshot QA 산출물을 만들지 않았다.
