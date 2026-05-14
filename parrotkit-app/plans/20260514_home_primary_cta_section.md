# Home Primary CTA Section

## 배경
ParrotKit v1 Home은 broad five-tab prototype 대신 creator workflow 중심의 단순 내비게이션을 보여줘야 한다. 현재 Home에는 최근 레시피 카드와 레시피 생성 버튼이 있지만, 사용자가 어떤 workflow를 이어가야 하는지 명확히 라벨링한 primary CTA section이 부족하다.

## 목표
- Home에 prominent primary CTA section을 추가한다.
- 이어갈 레시피가 있으면 해당 creator workflow를 계속하는 CTA로 명확히 표시한다.
- 이어갈 레시피가 없으면 blank/manual recipe workflow 시작 CTA로 표시한다.

## 범위
- Home 화면의 CTA copy/model과 UI 배치만 최소 변경한다.
- Source 또는 Recipes를 bottom tab으로 복원하지 않는다.
- Reference link, Brand context, paid/API/upload flow는 추가하지 않는다.

## 변경 파일
- `plans/20260514_home_primary_cta_section.md`
- `src/features/home/lib/home-primary-cta.ts`
- `src/features/home/lib/home-primary-cta.test.ts`
- `src/features/home/components/home-workspace-surface.tsx`
- `context/context_20260514_home_primary_cta_section.md`

## 테스트
- `src/features/home/lib/home-primary-cta.test.ts`를 먼저 실패시키고 통과시킨다.
- `tsconfig.home-primary-cta-check.json` 또는 기존 TypeScript 검증으로 관련 파일을 확인한다.

## 롤백
- Home CTA section과 helper/test 파일을 제거하고 기존 create recipe 버튼 배치로 되돌린다.

## 리스크
- iPhone viewport에서 CTA section이 첫 화면을 과도하게 밀어낼 수 있다.
- copy가 기존 continue card와 중복될 수 있으므로 CTA는 workflow label 중심으로 짧게 유지한다.

## 결과
- Home welcome 아래에 `Creator workflow` / `크리에이터 워크플로우` 라벨을 가진 prominent primary CTA section을 추가했다.
- 이어갈 레시피가 있으면 해당 레시피 title을 포함한 continuation CTA로 prompter/cut board workflow를 연다.
- 이어갈 레시피가 없으면 blank/manual recipe workflow CTA로 `/recipe-create?mode=manual`을 연다.
- 연결 context: `context/context_20260514_home_primary_cta_section.md`

## 검증 결과
- `./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
  - 최초 실행: `Cannot find module './home-primary-cta'`로 실패해 red 상태 확인.
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
  - 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
  - 통과.
- `xcrun simctl list devices available`
  - CoreSimulatorService connection invalid / connection refused로 실패. 현재 sandbox에서 iPhone simulator QA를 완료하지 못했다.
