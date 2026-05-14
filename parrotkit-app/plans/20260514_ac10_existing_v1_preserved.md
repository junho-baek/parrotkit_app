# AC 10 Existing V1 Preserved

## 배경

Home Continue behavior is being refined by sibling tasks, but v1 navigation and creation entry must remain unchanged.

## 목표

- Confirm bottom tabs remain Home, Explore, My only.
- Confirm the primary floating creation CTA remains labeled `레시피 생성`.
- Confirm the CTA still opens the existing blank/manual recipe creation flow.

## 범위

- Inspect root tab and global creation CTA contracts.
- Run focused navigation and CTA checks.
- Record the result in context.
- Do not modify production navigation, create flow, bottom tab membership, or Continue behavior.

## 변경 파일

- `plans/20260514_ac10_existing_v1_preserved.md`
- `context/context_20260514_ac10_existing_v1_preserved.md`

## 테스트

- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/global-create-cta.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.global-create-cta-check.json`

## 롤백

- Remove this plan and the paired context note.
- No production rollback is expected because this task is preservation-focused.

## 리스크

- This AC verifies source-level contracts only; interactive simulator QA may remain unavailable in the sandbox.
- Sibling Home Continue changes could still conflict later if they touch root tab or global CTA files, so final integration should rerun these checks.

## 결과

- Production code changes were not required.
- Bottom tabs remain Home, Explore, My through `rootTabNames`.
- The floating creation CTA remains `레시피 생성` and still opens `/recipe-create?mode=manual`.
- Linked context: `context/context_20260514_ac10_existing_v1_preserved.md`
