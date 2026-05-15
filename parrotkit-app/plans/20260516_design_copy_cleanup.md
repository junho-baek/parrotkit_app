# 2026-05-16 Design Copy Cleanup

## 배경

`DESIGN.md` says normal product UI should not expose internal workflow language. A static scan after the DDD refactor found two user-facing English strings that still used `workflow`.

## 목표

- Remove user-facing `workflow` copy from Explore Pro notes and Profile bio.
- Preserve meaning with recipe/creator-language copy.

## 범위

- Included: English product copy only.
- Excluded: internal function/type/file names, tests, architecture refactors, layout changes.

## 변경 파일

- `src/features/explore/screens/explore-recipe-detail-screen.tsx`
- `src/core/mocks/parrotkit-data.ts`
- `context/context_20260516_design_copy_cleanup.md`

## 테스트

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- static `workflow` user-facing string scan

## 롤백

Restore the two previous copy strings if product language direction changes.

## 리스크

- Very low: copy-only change with no layout or state behavior change.
