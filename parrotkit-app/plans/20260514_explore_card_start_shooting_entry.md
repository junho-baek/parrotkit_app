# Explore Card Start Shooting Entry

## 배경

- Sub-AC 5.1.2는 Explore template card 자체에서 선택한 템플릿의 creator workflow로 진입할 수 있어야 한다.
- 기존 detail 화면의 Start Shooting CTA는 prompter route를 사용하지만, Explore list card의 unsaved template action은 복사/저장에 머물러 있다.

## 목표

- Explore recommended/browse template card action이 template을 local owned recipe로 보장한 뒤 촬영/프롬프터 플로우로 이동한다.
- route에는 saved template recipe id와 원본 Explore recipe id metadata가 포함된다.
- Brand/pro deferred card는 실제 paid/API/upload flow 없이 기존 deferred route를 유지한다.

## 범위

- Explore template route helper/test.
- Explore screen card action wiring.
- Focused TypeScript 검증.

## 변경 파일

- `src/features/explore/lib/explore-template-recipe-copy.ts`
- `src/features/explore/lib/explore-template-recipe-copy.test.ts`
- `src/features/explore/screens/explore-screen.tsx`
- `plans/20260514_explore_card_start_shooting_entry.md`
- `context/context_20260514_explore_card_start_shooting_entry.md`

## 테스트

- Red: focused TypeScript check에서 새 helper/export가 없어 실패하는 것을 확인한다.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
- 가능하면 full `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 롤백

- Explore card action을 기존 copy/save-only 동작으로 되돌리고 helper/test/context 추가분을 제거한다.

## 리스크

- shared worktree에 이전 AC 변경이 많으므로 unrelated 파일은 건드리지 않는다.
- Source/Recipes bottom tabs 복원, real paid/API/upload, web QA는 범위 밖으로 유지한다.

## 결과

- `getExploreTemplateCardStartShootingHref`를 추가해 Explore card에서 선택한 template source와 saved owned recipe id를 filming/propmter route로 연결했다.
- Explore recommended/browse recipe-backed cards에 기존 copy action과 별도 `Shoot` / `촬영하기` start-shooting button을 노출했다.
- Brand/static card는 기존 Pro/deferred apply route를 유지했다.
- 연결 context: `context/context_20260514_explore_card_start_shooting_entry.md`

## 검증 결과

- Red: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - 실패 확인: `getExploreTemplateCardStartShootingHref` export 없음.
- Green: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.explore-card-detail-check.json`
  - 통과.
- Full: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
  - 통과.
- iPhone simulator QA는 시도했으나 현재 환경에서 CoreSimulatorService 연결이 불가능해 실행하지 못했다.
  - `xcrun simctl list devices available`
  - 실패: `CoreSimulatorService connection became invalid`, `Connection refused`.
