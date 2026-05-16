# 2026-05-17 Reference Anchor Restore

## 배경

Shooting board compact row에서 레퍼런스 영상이 왼쪽 작은 play 아이콘처럼만 보여 사용자가 레퍼런스 프리뷰를 찾기 어렵다. 기능은 `onPreview`로 남아 있지만, 화면에서는 사실상 사라진 것처럼 보이는 회귀다.

## 목표

- 컷별 레퍼런스를 collapsed row에서 다시 명확한 9:16 프리뷰로 보이게 한다.
- My Take는 사용자 촬영 결과/액션으로 유지한다.
- 불필요한 박스 안의 박스나 상태 라벨을 다시 늘리지 않는다.
- 계약 테스트로 레퍼런스 앵커가 다시 작아지지 않게 막는다.

## 범위

- Native recipe shooting board cut row UI
- 관련 design contract test
- QA/context 기록

## 변경 파일

- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `context/context_20260517_reference_anchor_restore.md`
- `output/playwright/recipe-board-breakdown-20260517/*`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`
- Android emulator screenshot

## 롤백

Revert this commit. The previous behavior keeps the reference modal wired but visually collapses the entry point.

## 리스크

- 레퍼런스 프리뷰 폭을 키우면 오른쪽 copy 영역이 좁아질 수 있다. 제목/가이드는 `numberOfLines`와 compact layout으로 유지한다.
- 원격 썸네일 로딩이 실패할 수 있으므로 텍스트 오버레이와 fallback surface를 같이 둔다.

## 결과

- Collapsed cut row 왼쪽의 작은 play affordance를 9:16 레퍼런스 프리뷰로 복구했다.
- `cut.thumbnailSource`를 우선 사용하도록 해 mock/offline 레퍼런스 이미지도 프리뷰에서 보이게 했다.
- Reference viewer 진입도 Android 에뮬레이터에서 확인했다.
- 연결 context: `context/context_20260517_reference_anchor_restore.md`
