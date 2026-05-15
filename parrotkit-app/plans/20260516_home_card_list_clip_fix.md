# Home Card List Clip Fix

## 배경
Seed issue 6 Sub-AC 9.2는 iPhone 폭 Home 화면에서 recipe card/list의 제목, 설명, 메타데이터가 잘리거나 겹치지 않아야 한다고 요구한다. `DESIGN.md`는 Home UI가 간결한 recipe language와 모바일 safe-area를 유지하면서 중복 copy와 과밀한 컨트롤을 피하라고 명시한다.

## 목표
- compact iPhone 폭에서 Home recipe card의 title/meta/action 영역이 카드 content 폭 안에 안정적으로 들어가게 한다.
- saved-take list row의 recipe title, cut description, label/status metadata가 trailing controls와 겹치지 않게 한다.
- 기존 Home ordering, create entry bottom clearance, native tab 변경을 되돌리지 않는다.

## 범위
- `src/features/home/lib/home-layout.ts`
- `src/features/home/lib/home-layout.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `plans/20260516_home_card_list_clip_fix.md`
- `context/context_20260516_home_card_list_clip_fix.md`

## 변경 파일
- 작업 전 계획 기준. 실제 변경 후 결과 섹션에 확정 파일을 남긴다.

## 테스트
- `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `DESIGN.md` 관련 source check

## 롤백
- Home layout helper/test 추가분과 Home card/list compact style 조정분을 되돌린다.

## 리스크
- Home surface에는 sibling AC 변경이 이미 섞여 있으므로 navigation, copy, section ordering은 건드리지 않는다.

## 결과
- `src/features/home/lib/home-layout.ts`에 compact iPhone recipe-card metadata width와 saved-take row text budget helper를 추가했다.
- `src/features/home/lib/home-layout.test.ts`가 375px iPhone 폭에서 recipe title/description/metadata가 clipped layout으로 밀리지 않는지 검증한다.
- `src/features/home/components/home-workspace-surface.tsx`에서 recipe card scene-count metadata를 action icon row와 분리하고, saved-take trailing metadata 폭을 제한했다.
- 연결 context: `context/context_20260516_home_card_list_clip_fix.md`
