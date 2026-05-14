# Home Continue Target Selection

## 배경

- Home Continue must reopen the last unfinished recipe shooting board.
- Existing unfinished filtering is based on required-cut My Take state, but target selection still depends on list order and a coarse `continue` status preference.

## 목표

- Select a deterministic Continue target among multiple unfinished boards.
- Prefer latest meaningful board activity when available.
- Fall back to recipe updated/created timestamps when activity is missing.
- Keep Continue routed to the shooting board overview, not camera.

## 범위

- Home workflow selection resolver and focused resolver tests.
- Mock recipe type timestamp fields only as lightweight v1 metadata.
- No bottom tab, floating CTA label, persistence, Supabase, or camera route changes.

## 변경 파일

- `src/core/mocks/parrotkit-data.ts`
- `src/features/home/lib/home-workflow-resolution.ts`
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `context/context_20260515_ac1_home_continue_target_selection.md`

## 테스트

- RED/GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- Focused TypeScript: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`

## 롤백

- Remove activity ordering helper logic and new tests.
- Remove optional timestamp metadata fields from `MockRecipe`.

## 리스크

- Existing mock recipes use human-readable labels, so ordering must preserve stable behavior when no machine-sortable timestamp exists.
- Sibling verification work has untracked artifacts; avoid touching those files.
