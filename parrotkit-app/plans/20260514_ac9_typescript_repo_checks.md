# AC 9 TypeScript Repo Checks

## 배경

- ParrotKit v1 navigation realignment follow-up needs only the failed or pending items from the prior Seed run.
- This task owns AC 9: TypeScript or focused repo checks pass after the current follow-up changes.
- Sibling agents are handling UI-specific navigation and CTA implementation work, so this task should avoid broad product edits unless checks expose a direct type break.

## 목표

- Run focused TypeScript/repo checks for the navigation, creation CTA, home, profile, saved-take, and recipe creation surfaces touched by the follow-up work.
- Run the broad TypeScript check without invoking a build.
- Apply only minimal fixes if checks fail.

## 범위

- TypeScript configuration checks and direct repo verification commands.
- Minimal type/test-contract fixes only if required for AC 9.
- No web QA, commit, push, or merge.

## 변경 파일

- `plans/20260514_ac9_typescript_repo_checks.md`
- `context/context_20260514_ac9_typescript_repo_checks.md`
- Source files only if a focused check fails and requires a minimal fix.

## 테스트

- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`
- Additional focused `tsconfig.*-check.json` files for the prior failed/pending follow-up surfaces.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`

## 롤백

- Remove this plan/context note and any minimal source fix made for a failed check.

## 리스크

- Worktree contains many sibling-agent changes; this task must not revert or reshape those changes.
- Simulator QA is intentionally out of scope for this AC.

## 결과

- `src/core/i18n/app-language.tsx` nav copy keys were narrowed from the old `home`/`recipes`/`source` shape to the actual root tab names: `index`, `explore`, `my`.
- Focused TypeScript checks passed after the fix.
- Broad `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` passed.
- 연결 context: `context/context_20260514_ac9_typescript_repo_checks.md`
