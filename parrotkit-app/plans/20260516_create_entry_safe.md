# Create Entry Safe

## 배경
Seed issue 6 AC 8은 Home 하단 `Create recipe` 진입점이 native tab bar 위에 안전하게 놓이고, 겹치거나 잘리지 않아야 한다고 요구한다. `DESIGN.md`는 fixed tab bar와 CTA가 콘텐츠를 덮지 않도록 bottom inset과 safe-area padding을 사용하라고 명시한다.

## 목표
- Home scroll bottom padding을 명시적인 layout 계약으로 고정한다.
- iOS home indicator와 Android/native tab bar 높이에서도 하단 `Create recipe` entry가 탭 바 위에서 탭 가능한 여백을 갖도록 한다.
- 기존 Home copy/order/navigation 변경과 충돌하지 않는다.

## 범위
- `src/features/home/lib/home-layout.ts`
- `src/features/home/lib/home-layout.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `tsconfig.home-recipe-create-entry-check.json`
- `plans/20260516_create_entry_safe.md`
- `context/context_20260516_create_entry_safe.md`

## 변경 파일
- 작업 전 계획 기준. 실제 변경 후 결과 섹션에 확정 파일을 남긴다.

## 테스트
- `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false`

## 롤백
- Home surface의 `bottomPadding` override를 제거하고 추가한 Home layout helper/test를 되돌린다.

## 리스크
- 병렬 작업이 같은 Home surface를 수정 중이므로 bottom padding wiring 외의 Home hierarchy/copy 영역은 건드리지 않는다.

## 결과
- `src/features/home/lib/home-layout.ts`에 Home scroll bottom padding 계약을 추가했다.
- `src/features/home/lib/home-layout.test.ts`가 compact phone과 iPhone home indicator 환경에서 하단 `Create recipe` entry가 tab bar 위 여백을 갖는지 검증한다.
- `src/features/home/components/home-workspace-surface.tsx`에서 safe-area bottom inset을 읽어 `AppScreenScrollView`에 명시적인 bottom padding으로 전달했다.
- `tsconfig.home-recipe-create-entry-check.json`에 Home layout helper/test를 포함했다.
- 연결 context: `context/context_20260516_create_entry_safe.md`
