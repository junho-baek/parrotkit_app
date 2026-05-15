# Home Viewport Validation

## 배경
Seed issue 6 Sub-AC 9.4는 대표 iPhone 및 Android Home viewport에서 버튼, heading, card text가 clipping 없이 보이는지 검증해야 한다. `DESIGN.md`는 Home UI가 간결한 recipe language, 중복 CTA 제거, safe-area/bottom inset 유지를 따라야 한다고 명시한다.

## 목표
- iPhone 및 Android compact viewport에서 Home Continue, My recipes, saved takes, Create recipe entry의 텍스트/버튼 layout budget을 검증한다.
- 하단 native tab bar와 Create recipe entry가 겹치지 않는지 기존 clearance 계약과 함께 검증한다.
- QA screenshot 또는 local artifact는 커밋 대상으로 만들지 않는다.

## 범위
- `src/features/home/lib/home-layout.ts`
- `src/features/home/lib/home-layout.test.ts`
- `plans/20260516_home_viewport_validation.md`
- `context/context_20260516_home_viewport_validation.md`

## 변경 파일
- 작업 전 계획 기준. 실제 변경 후 결과 섹션에 확정 파일을 남긴다.

## 테스트
- `./node_modules/.bin/sucrase-node src/features/home/lib/home-layout.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-recipe-create-entry-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `DESIGN.md` source check

## 롤백
- Home viewport validation helper/test 추가분을 되돌린다.

## 리스크
- 실제 Expo Go device capture는 이 실행 환경에서 직접 제공되지 않을 수 있으므로, 수치 기반 layout contract와 TypeScript 검증으로 clipping 위험을 확인한다.

## 결과
- `src/features/home/lib/home-layout.ts`에 Home section heading, Continue card title, lower Create recipe label의 compact viewport text budget helper를 추가했다.
- `src/features/home/lib/home-layout.test.ts`가 대표 iPhone 375px / Android 360px viewport에서 heading, card text, icon buttons, saved-take row, Create recipe entry, tab bar clearance를 검증한다.
- 연결 context: `context/context_20260516_home_viewport_validation.md`
