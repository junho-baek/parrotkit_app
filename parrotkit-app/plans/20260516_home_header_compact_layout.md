# Home Header Compact Layout

## 배경
Seed issue 6 Sub-AC 9.1은 iPhone 폭 Home 화면에서 header, heading, button/control 영역의 텍스트와 컨트롤이 잘리거나 겹치지 않아야 한다고 요구한다. `DESIGN.md`는 Home UI가 간결한 recipe language와 안전한 bottom inset을 유지해야 하며, 불필요한 copy와 CTA 중복을 피하라고 명시한다.

## 목표
- compact iPhone 폭에서 Home heading과 card controls가 가로 폭 예산을 넘지 않도록 한다.
- My recipes card의 하단 controls가 2-column 카드 안에서 clipping을 만들지 않도록 한다.
- 기존 recipe language, section ordering, create entry bottom clearance 변경을 되돌리지 않는다.

## 범위
- `src/features/home/lib/home-layout.ts`
- `src/features/home/lib/home-layout.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `plans/20260516_home_header_compact_layout.md`
- `context/context_20260516_home_header_compact_layout.md`

## 변경 파일
- 작업 전 계획 기준. 실제 변경 후 결과 섹션에 확정 파일을 남긴다.

## 테스트
- `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `DESIGN.md` 관련 source check

## 롤백
- Home recipe card action button 스타일과 Home layout helper/test 추가분을 되돌린다.

## 리스크
- 동일 Home surface에 sibling AC 변경이 이미 섞여 있으므로 recipe card action row 외 영역은 최소한으로만 수정한다.

## 결과
- `src/features/home/lib/home-layout.ts`에 compact iPhone recipe card content width와 action control width budget helper를 추가했다.
- `src/features/home/lib/home-layout.test.ts`가 375px iPhone 폭의 2-column Home recipe card에서 하단 controls가 카드 폭을 넘지 않는지 검증한다.
- `src/features/home/components/home-workspace-surface.tsx`에서 section heading에 `min-w-0`, `flex-1`, `numberOfLines={1}`를 적용해 trailing action과 충돌하지 않도록 했다.
- 같은 파일의 My recipes card 하단 Manage / Start filming controls를 접근성 라벨이 있는 38px icon button으로 정리해 visible button text clipping을 제거했다.
- 연결 context: `context/context_20260516_home_header_compact_layout.md`
