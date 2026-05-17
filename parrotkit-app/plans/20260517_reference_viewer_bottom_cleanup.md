# Reference Viewer Bottom UI Cleanup

## 배경

The last release-media cleanup removed visible taxonomy labels from the reference viewer, but the bottom cut navigation still renders as a thumbnail strip. In the latest Android evidence, the `1 2 3 4` controls sit on top of a low thumbnail band, which still feels like a second card/preview layer under the main 9:16 reference video.

## 목표

- Replace the reference viewer bottom thumbnail strip with a compact numeric cut rail.
- Keep the main reference video/image as the only visual media preview in the modal.
- Make bottom actions compact and filming-tool-like instead of a wide CTA cluster.
- Add a source contract test so the thumbnail rail does not quietly return.

## 범위

- `ReferenceViewerModal` bottom rail and action layout only.
- Focused source/contract test and context update.

## 변경 파일

- Modify: `src/features/recipes/components/reference-viewer-modal.tsx`
- Create: `src/features/recipes/components/reference-viewer-modal-contract.test.ts`
- Update: `context/context_20260517_release_media_slop_cleanup.md`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/reference-viewer-modal-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-viewer-ui.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `git diff --check`

## 롤백

Revert the final commit. This is isolated to the modal rendering and does not touch camera, saved takes, or board data.

## 리스크

- If the rail becomes too minimal, users may not realize it switches cuts. Keep strong active/inactive contrast and accessibility labels.
- Short labels like `Film` and `Guide` should stay visible enough without reintroducing explanatory UI copy.

## 결과

- Replaced the reference viewer bottom thumbnail strip with compact numeric rail buttons.
- Removed the rail-level thumbnail image/shade styles.
- Shortened actions from `Use as guide` / `Film this cut` to `Guide` / `Film`.
- Added `src/features/recipes/components/reference-viewer-modal-contract.test.ts`.
- Updated `context/context_20260517_release_media_slop_cleanup.md`.
