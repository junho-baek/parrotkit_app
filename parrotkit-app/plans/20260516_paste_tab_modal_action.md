# 2026-05-16 Paste Tab Modal Action

## 배경
Issue 6 Sub-AC 3.1은 중심 Paste 하단 네비게이션 액션이 잘못된 탭 화면으로 이동하지 않고, 레퍼런스 링크 입력이 보이는 생성 드로어/윈도우를 열어야 한다.

## 목표
하단 네비게이션의 중심 `Paste` 슬롯을 누르면 `/recipe-create?mode=reference` transparent modal이 열리도록 연결한다.

## 범위
- `Paste` 탭 버튼의 press 동작을 reference recipe-create modal로 오버라이드한다.
- 중심 Paste 버튼을 주변 탭보다 크게 보이도록 스타일링한다.
- 탭 액션 목적지를 타입/계약 테스트로 고정한다.

## 변경 파일
- `src/core/navigation/root-native-tabs.tsx`
- `src/core/navigation/root-tab-config.ts`
- `src/core/navigation/root-tab-config.test.ts`
- `plans/20260516_paste_tab_modal_action.md`
- `context/context_20260516_paste_tab_modal_action.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- DESIGN.md 관련 문구 및 금지 copy 검색

## 롤백
Paste 탭의 custom `tabBarButton` 옵션과 목적지 계약을 제거하고 기존 탭 기본 동작으로 되돌린다.

## 리스크
- native tab primitive 위에 custom button을 얹는 방식이므로 실제 iOS/Android safe-area 시각 확인은 후속 QA AC에서 별도로 필요하다.

## 결과
- `rootPasteActionHref`를 `/recipe-create?mode=reference`로 고정했다.
- 중심 `Paste` 탭의 `tabBarButton` press 동작을 기본 `/source` 탭 이동 대신 reference-mode recipe creation transparent modal로 연결했다.
- Paste tab href 계약도 `/recipe-create?mode=reference`로 고정해 tab/link action mapping이 paste creation flow를 가리키도록 했다.
- root tabs 전용 tsconfig에 `root-native-tabs.tsx`를 포함해 custom Paste button 타입 회귀를 잡도록 했다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- PASS: `DESIGN.md`에서 bottom navigation, Paste, drawer, box-in-box/redundant CTA guardrail 문구 확인
- PASS: navigation/recipe-create 범위 금지 copy 검색 결과는 기존 내부 식별자/test 문구뿐이며 새 user-facing 금지 copy 추가 없음
- BLOCKED: local `DESIGN.md` lint binary 없음 (`./node_modules/.bin/design.md`, `./node_modules/.bin/design-lint` 모두 미존재)
- 연결 context: `context/context_20260516_paste_tab_modal_action.md`
