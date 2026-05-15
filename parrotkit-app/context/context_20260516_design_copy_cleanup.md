# Context 2026-05-16 Design Copy Cleanup

## 작업

Post-refactor `DESIGN.md` copy scan found user-facing English `workflow` copy in Explore Pro notes and Profile bio.

## 변경

- Updated Explore Pro note copy from "free workflow" to "Free creation".
- Updated Profile bio from "creator workflows" to "creator recipes".

## 검증

- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `npm run check:architecture`
- PASS: user-facing `workflow` string scan found no product copy hits; remaining matches are internal import paths.

## 리스크

- Copy-only change. No runtime behavior or layout changes expected.
