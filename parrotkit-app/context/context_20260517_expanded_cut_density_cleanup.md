# 2026-05-17 Expanded Cut Density Cleanup

## 배경

Shooting board expanded cut이 별도 큰 reference slot과 vertical detail slots를 열면서 AI-generated form처럼 보이고 여백이 과하다는 피드백이 있었다. 같은 턴에서 `Next cut` label도 redundant label로 판단되어 제거 대상에 포함했다.

## 변경

- `src/features/recipes/components/shoot-board-scene-card.tsx`
  - Collapsed/expanded cut meta를 `time range · expected duration` 형식으로 통일했다.
  - `Next cut` / `다음 컷` label과 관련 styles 제거.
  - Expanded cut의 별도 `CutReferencePreview` 큰 preview slot 제거.
  - Expanded cut도 collapsed row와 같은 9:16 reference thumbnail anchor를 재사용하도록 변경.
  - Expanded header의 `Edit` / `Reset` text pills를 icon-only accessible actions로 축소.
  - `Line to say`, `Shot guide`, `Apply to your case`, `Note`를 read-only 상태에서 compact detail rows로 표시.
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
  - redundant next-cut labels 금지 guard 추가.
  - timeline range + duration guard 추가.
  - `Line to Say` / `Shot guide` preview rows가 expanded toggle에 연결되는 guard 추가.
  - large expanded `CutReferencePreview` / `cutReferencePreview` style 재도입 금지 guard 추가.
  - read-only expanded details가 compact row로 유지되는 guard 추가.

## 검증

- PASS: `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `npm run check:architecture`
- PASS: `npx -y @google/design.md lint DESIGN.md` (0 errors, existing 14 unused-token warnings)
- PASS: `git diff --check`
- PASS: Android screenshot QA

## 산출물

- Collapsed board: `output/playwright/recipe-execution-reference-20260517/android-expanded-density-board.png`
- Expanded cut: `output/playwright/recipe-execution-reference-20260517/android-expanded-density-expanded.png`

## 메모

확장 상태에서도 reference media는 왼쪽 9:16 thumbnail로 유지된다. `Line to say`와 `Shot guide`는 중요한 실행 정보라 제거하지 않고, 큰 입력 슬롯 대신 읽기 전용 compact row로 정리했다.
