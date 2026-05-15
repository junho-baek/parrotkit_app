# Context 2026-05-16 Paste Tab Modal Action

## 작업
Issue 6 Sub-AC 3.1: 중심 Paste 하단 네비게이션 액션을 잘못된 탭 화면 이동 대신 reference-link recipe creation modal drawer로 연결했다.

## DESIGN.md 확인
- `DESIGN.md`의 Recipe creation drawer, Bottom navigation and creation entry 섹션을 확인했다.
- Preferred v1 bottom navigation model이 Home, Explore, Paste, Recipes, My이며 Paste는 reference link를 붙여넣어 recipe generation source로 쓰는 중심 액션임을 확인했다.
- box-in-box, redundant CTA, Shoot/New Shoot/Start Shoot/workflow/debug copy 금지 guardrail을 확인했다.

## 변경
- `src/core/navigation/root-tab-config.ts`
  - `rootPasteActionHref = '/recipe-create?mode=reference'`를 추가했다.
  - `rootTabHrefs.source`를 Paste creation flow 목적지인 `/recipe-create?mode=reference`로 고정했다.
- `src/core/navigation/root-tab-config.test.ts`
  - 중심 Paste 액션이 `/recipe-create?mode=reference` drawer를 열도록 계약 검증을 추가했다.
- `src/core/navigation/root-native-tabs.tsx`
  - `source` tab의 custom `tabBarButton` press 동작을 `router.push(rootPasteActionHref)`로 오버라이드했다.
  - 기존 prominent center Paste visual은 유지하면서 press target만 modal drawer로 연결했다.
- `src/app/(tabs)/source.tsx`
  - 파일 기반 `/source` route 자체는 그대로 두되, bottom-nav Paste action mapping은 recipe creation drawer로 향하게 했다.
- `tsconfig.root-tabs-check.json`
  - root-tab check에 `root-native-tabs.tsx`를 포함해 custom tab button 타입 오류를 잡도록 했다.

## 검증
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: DESIGN.md source check
  - `rg -n "Preferred v1 bottom navigation model|Paste as the larger center action|Recipe creation must use the bottom drawer|Do not create box-in-box|Do not add redundant CTA" DESIGN.md`
- PASS: 금지 copy 검색
  - `rg -n "Shoot|New Shoot|Start Shoot|workflow|console|debug" src/core/navigation src/features/recipes/screens/recipe-create-screen.tsx -S`
  - 결과는 기존 내부 식별자/test 문구뿐이며 새 user-facing copy 추가 없음.
- BLOCKED: local `DESIGN.md` lint binary 없음
  - `./node_modules/.bin/design.md`, `./node_modules/.bin/design-lint` 모두 미존재.

## 리스크 / 후속
- 실제 iOS/Android capture에서 Paste button press가 modal drawer를 여는지는 후속 QA AC에서 simulator로 확인해야 한다.
- `/source` 탭 화면 자체의 copy에는 legacy Source inbox 구조가 남아 있으나, 이번 Sub-AC 범위는 bottom-nav Paste press action wiring에 한정했다.
