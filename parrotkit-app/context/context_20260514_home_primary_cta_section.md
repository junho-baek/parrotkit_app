# Context 2026-05-14 Home Primary CTA Section

## 작업
Sub-AC 3.1.2의 Sub-AC 2 범위로 Home에 creator workflow를 명확히 라벨링하는 primary CTA section을 추가했다.

## 변경
- `src/features/home/lib/home-primary-cta.ts`
  - Home primary CTA copy helper를 추가했다.
  - continue recipe가 있으면 해당 recipe title을 포함해 workflow continuation copy를 반환한다.
  - continue recipe가 없으면 blank/manual recipe workflow 시작 copy를 반환한다.
- `src/features/home/lib/home-primary-cta.test.ts`
  - 영어/한국어 workflow label, continue title, blank workflow title/action을 검증한다.
- `src/features/home/components/home-workspace-surface.tsx`
  - welcome 아래에 prominent primary workflow CTA card를 추가했다.
  - continue target이 있으면 기존 shoot board/propmter href를 열고, 없으면 `/recipe-create?mode=manual`로 진입한다.
- `tsconfig.home-primary-cta-check.json`
  - 이번 변경 파일만 확인하는 focused TypeScript config를 추가했다.
- `plans/20260514_home_primary_cta_section.md`
  - 계획과 결과를 기록했다.

## 검증
- Red check:
  - `./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
  - 결과: `Cannot find module './home-primary-cta'`로 실패해 테스트가 새 helper 부재를 잡는 것을 확인했다.
- Focused helper check:
  - `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-primary-cta.test.ts`
  - 결과: 통과.
- Focused TypeScript check:
  - `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-primary-cta-check.json`
  - 결과: 통과.

## Simulator QA
- 시도:
  - `xcrun simctl list devices available`
- 결과:
  - CoreSimulatorService connection invalid / connection refused로 실패했다.
  - 현재 sandbox에서는 iPhone simulator device list에 접근할 수 없어 simulator UI QA 증거를 새로 만들지 못했다.

## 참고
- Source 또는 Recipes를 bottom tab으로 복원하지 않았다.
- Reference link, Brand context, paid/API/upload flow는 추가하지 않았다.
- 기존 orch_78808bb15d74 변경 파일 중 Home surface의 이전 saved recipe/saved take 접근 흐름은 보존했다.
