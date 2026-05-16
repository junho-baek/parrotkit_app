# 2026-05-16 Home My Recipes Simplification

## 배경

Home의 `My recipes` 카드는 현재 진행률, 상태 배지, 장면 수, 최근 활동, 관리/촬영 버튼까지 노출해 저장된 레시피 목록보다 workflow console처럼 보인다. `DESIGN.md`는 카드 제목이 행동을 설명하면 라벨/설명을 줄이고, 카드 전체가 CTA이면 중복 CTA 버튼을 추가하지 말라고 규정한다.

## 목표

- `Continue recipe` 카드에서만 진행률 정보를 유지한다.
- `My recipes` 카드는 이미지와 레시피 제목 중심의 가벼운 카드로 단순화한다.
- 의미 없는 라벨, 진행률 바, scene/shot metadata, 설정/카메라 아이콘 버튼을 제거한다.

## 범위

- Home 화면 `My recipes` 카드 UI 렌더링
- Home owned recipe card/lib 테스트 기대값
- Home recipe card 레이아웃 유틸의 불필요한 action/metadata 계산 정리

## 변경 파일

- `src/features/home/components/home-workspace-surface.tsx`
- `src/features/home/lib/home-owned-recipe-cards.ts`
- `src/features/home/lib/home-owned-recipe-cards.test.ts`
- `src/features/home/lib/home-layout.ts`
- `src/features/home/lib/home-layout.test.ts`
- `context/context_20260516_home_my_recipes_simplified.md`

## 테스트

- Home owned recipe card focused test
- Home layout focused test
- TypeScript `tsc --noEmit`
- `git diff --check`

## 롤백

이 커밋을 revert하면 기존 `My recipes` 카드의 progress/metadata/action 버튼 UI로 되돌릴 수 있다.

## 리스크

- 촬영으로 바로 가던 카메라 아이콘 버튼이 사라져 사용자는 카드 탭 후 레시피 보드에서 촬영을 시작해야 한다.
- 카드 정보량을 줄이면서 목록에서 진행 상태를 바로 비교하는 기능은 `Continue recipe`와 레시피 상세/보드로 이동한다.

## 결과

- `My recipes` 카드를 이미지 + 제목만 있는 카드 CTA로 단순화했다.
- 진행률, scene/shot metadata, 최근 활동 라벨, 상태 배지, 설정/카메라 버튼을 제거했다.
- `Continue recipe` 카드의 supporting progress label과 progress bar는 유지했다.
- 연결 context: `context/context_20260516_home_my_recipes_simplified.md`
