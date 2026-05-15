# Context 2026-05-16 Home Card List Clip Fix

## 작업
Seed issue 6 Sub-AC 9.2: iPhone 폭 Home 화면에서 recipe card/list의 제목, 설명, 메타데이터가 clipping/overlap 없이 보이도록 compact layout 계약과 Home card/list 스타일을 보강했다.

## DESIGN.md 확인
- `DESIGN.md`의 Typography, Simplicity Guardrails, Layout 섹션을 확인했다.
- Home UI는 간결한 recipe language, 중복 CTA 제거, safe-area/bottom inset 유지, 텍스트 가독성을 우선해야 한다는 지침을 적용했다.

## 변경
- `src/features/home/lib/home-layout.ts`
  - compact iPhone recipe card에서 metadata line이 actions와 폭을 다투지 않는 layout helper를 추가했다.
  - saved-take row에서 trailing metadata 폭을 제한하고 primary text width를 계산하는 helper를 추가했다.
- `src/features/home/lib/home-layout.test.ts`
  - 375px iPhone 폭에서 recipe card metadata가 최소 읽기 폭을 확보하는지 검증한다.
  - saved-take row의 recipe title / cut description 영역이 최소 폭을 확보하고 trailing metadata가 compact하게 유지되는지 검증한다.
- `src/features/home/components/home-workspace-surface.tsx`
  - Home recipe card의 scene-count metadata를 action icons와 분리해 한 줄 전체 폭을 쓰도록 조정했다.
  - card body에 `min-w-0`를 적용하고 metadata line에 line-height를 명시했다.
  - saved-take trailing label/status column에 `maxWidth: 58`과 `flexShrink: 0`을 적용해 main title/description column과 겹치지 않게 했다.
- `plans/20260516_home_card_list_clip_fix.md`
  - 작업 결과와 연결 context를 기록했다.

## 검증
- RED: `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
  - `Home recipe card metadata needs enough compact width for scene-count copy without clipping.`로 실패해 compact metadata width 계약 부재를 확인했다.
- GREEN: `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json` 통과.
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- DESIGN.md source check: `rg -n 'Typography should reduce UI complexity|Do not add redundant CTA buttons|Use bottom inset|Home should answer|Avoid the word \`workflow\`' DESIGN.md` 통과.

## 제한
- `npx --no-install @google/design.md lint DESIGN.md`는 sandbox network 제한으로 `registry.npmjs.org` DNS 조회가 실패해 실행 완료하지 못했다 (`ENOTFOUND`).
- 이 Sub-AC는 QA screenshots를 생성하지 않았다.
