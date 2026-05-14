# Sub-AC 2 Forbidden Shoot Copy Verification

## 배경

- Follow-up Seed task is limited to failed/pending ParrotKit v1 navigation realignment items.
- Sub-AC 2 requires searching user-facing navigation and CTA copy for forbidden `Shoot` / `New Shoot` / `Start Shoot` terminology.
- Correct primary blank creation language is `레시피 생성`.

## 목표

- Confirm forbidden Shoot terminology was not reintroduced in user-facing navigation or CTA copy.
- Preserve completed fixes from the previous Seed run.

## 범위

- Search and verification only unless a user-facing forbidden label is found.
- No bottom-tab changes and no web QA.

## 변경 파일

- `plans/20260514_sub_ac_2_forbidden_shoot_copy_verification.md`
- `context/context_20260514_sub_ac_2_forbidden_shoot_copy_verification.md` after verification

## 테스트

- Focused `rg` searches over `src` for forbidden navigation/CTA copy.
- Inspect matching source lines to classify user-facing versus internal/domain naming.

## 롤백

- Remove this verification-only plan/context if the follow-up run is discarded.

## 리스크

- Internal identifiers still use `shoot-board`; these are allowed if they are not visible navigation or CTA copy.

## 결과

- Replaced remaining English user-facing navigation/CTA labels that used exact `Shoot` or `Start Shooting` with `Film`, `Start filming`, or `Film time`.
- Preserved the existing Quick Shoot feature name because it is a distinct feature surface, not the primary blank creation CTA or root navigation.
- Confirmed global floating CTA remains `레시피 생성` in Korean and `Create recipe` in English.
- Context: `context/context_20260514_sub_ac_2_forbidden_shoot_copy_verification.md`.

## 검증

- Passed: focused `rg` search found no `New Shoot` or `Start Shoot` in searched app surfaces.
- Passed: focused navigation/CTA `rg` search found no forbidden primary/root navigation CTA copy; remaining hits are Quick Shoot feature naming and internal/test wording.
- Passed: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
- Passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
- Passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- Passed: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
