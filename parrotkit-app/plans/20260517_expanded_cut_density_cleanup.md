# 2026-05-17 Expanded Cut Density Cleanup

## 배경

Collapsed cut row를 정리한 뒤 expanded state에서 큰 reference frame, 별도 header row, edit/reset row, vertical detail slots가 한꺼번에 나타나면서 AI-generated form처럼 보이고 여백이 과해졌다.

## 목표

- Expanded cut을 별도 큰 카드/폼처럼 보이지 않게 하고 collapsed row의 밀도를 유지한다.
- Expanded reference는 같은 9:16 thumbnail anchor를 재사용해 위치와 비율을 유지한다.
- `Line to say`, `Shot guide`, `Apply to your case`, `Note`는 중요한 실행 정보로 유지하되 compact detail rows로 표시한다.
- Edit/Reset은 독립된 큰 row 대신 header 아래 compact action으로 둔다.

## 범위

- Native shooting board expanded cut row.
- Design contract guard 업데이트.
- Android screenshot QA.

## 변경 파일

- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `plans/20260517_expanded_cut_density_cleanup.md`
- `context/context_20260517_expanded_cut_density_cleanup.md`
- `output/reports/20260517_expanded_cut_density_cleanup.md`
- `output/playwright/recipe-execution-reference-20260517/*`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`
- Android screenshot QA

## 롤백

Revert this commit. Previous behavior restores large expanded reference preview and vertical detail slots.

## 리스크

- 너무 압축하면 detail readability가 떨어질 수 있다. Non-editing state만 compact rows로 줄이고, editing state는 입력 안정성을 위해 multiline input 공간을 유지한다.

## 결과

- Expanded cut에서 별도 `CutReferencePreview` 큰 슬롯을 제거하고 collapsed row와 같은 9:16 reference anchor를 재사용했다.
- Expanded header를 timeline / execution title / instruction / compact icon actions 구조로 정리했다.
- `Edit` / `Reset` 텍스트 버튼을 icon-only accessible actions로 줄였다.
- `Line to say`, `Shot guide`, `Apply to your case`, `Note`는 read-only 상태에서 compact row로 표시한다.
- Design contract에 큰 expanded reference preview 재도입 방지와 compact detail row guard를 추가했다.
- 연결 context: `context/context_20260517_expanded_cut_density_cleanup.md`
