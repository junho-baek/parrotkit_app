# 2026-05-17 Reference Anchor Restore

## 배경

사용자가 shooting board에서 레퍼런스 영상과 My Take UI가 어디 갔는지 지적했다. 확인 결과 레퍼런스는 기능적으로 `onPreview`에 연결되어 있었지만, collapsed cut row에서는 왼쪽의 작은 play 아이콘처럼 보일 뿐이라 사실상 발견하기 어려웠다.

## 변경

- `ShootBoardSceneCard` collapsed row의 레퍼런스 entry를 9:16 프리뷰로 복구했다.
- 프리뷰 썸네일은 `cut.thumbnailSource`를 우선 사용하고, 없으면 `referenceViewer.thumbnailUrl`을 사용한다.
- 프리뷰에 시간 범위와 `Reference` 오버레이를 추가해 썸네일 로딩 전에도 기능을 알아볼 수 있게 했다.
- 이미지/오버레이 레이어를 `Pressable` 밖의 plain `View`에 배치해 Android에서 absolute positioning과 image fill이 안정적으로 보이게 했다.
- design contract에 collapsed reference anchor가 다시 tiny play affordance로 축소되지 않도록 guard를 추가했다.

## 검증

PASS:

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md` returned 0 errors and 14 existing unused-token warnings.
- `git diff --check`

Android QA evidence:

- `output/playwright/recipe-board-breakdown-20260517/android-board-reference-fixed.png`
- `output/playwright/recipe-board-breakdown-20260517/android-reference-viewer-fixed.png`

## 남은 메모

- 현재 compact row는 레퍼런스를 명확히 회복했지만, 전체 cut card는 여전히 tall하다. 다음 디자인 패스에서는 오른쪽 copy/action density를 더 다듬을 수 있다.
