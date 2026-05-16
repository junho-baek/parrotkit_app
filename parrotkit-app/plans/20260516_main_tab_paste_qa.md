# 2026-05-16 Main Tab Paste QA

## 배경

GitHub #15는 #11의 마지막 검증 작업이다. #13/#14에서 Source route 모델을 제거하고 Paste를 in-place drawer action으로 정리했으므로, Home, Explore, Recipes, My 각각에서 Paste drawer가 현재 화면 위에 열리는지 QA해야 한다.

## 목표

- Home, Explore, Recipes, My에서 Paste 버튼이 route 이동 없이 현재 화면 위에 reference recipe drawer를 여는지 검증한다.
- Source Inbox 또는 `/source`/`/source-actions`가 visible main-tab product route로 남지 않았음을 확인한다.
- #15, #11, #6 closure 판단에 사용할 QA report를 남긴다.

## 범위

- Main tab shell QA
- iPhone Simulator / Android Emulator 접근 시도
- 접근이 막히면 source-contract 및 runtime blocker를 기록
- QA report/context 산출

## 변경 파일

- `plans/20260516_main_tab_paste_qa.md`
- `context/context_20260516_main_tab_paste_qa.md`
- `output/reports/20260516_main_tab_paste_qa.md`
- `output/playwright/main-tab-paste-qa-20260516/*`

## 테스트

- `./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts`
- `./node_modules/.bin/sucrase-node src/core/navigation/paste-drawer-state.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- iPhone Simulator / Android Emulator capture attempt
- Source route residue search

## 롤백

QA artifact commit만 revert하면 된다. 앱 코드 변경은 #13/#14 commit에 포함되어 있다.

## 리스크

- Native simulator/emulator access may be unavailable or hang in this execution environment.
- If native capture is blocked, #15 should remain open unless source-contract evidence is accepted as sufficient for this pass.

## 결과

- Android Emulator Pixel_9에서 Home, Explore, Recipes, My 각각의 active tab 화면을 캡처했다.
- Android Emulator Pixel_9에서 네 탭 모두 중앙 Paste CTA가 `New recipe` bottom drawer를 현재 화면 위에 열었다.
- Visible main-tab QA와 exact source route residue search에서 `Source Inbox`, `/source`, `/source-actions` 노출은 발견되지 않았다.
- iOS Simulator는 Simulator 앱 프로세스는 있으나 `simctl`이 8초 타임아웃으로 응답하지 않아 캡처하지 못했다. 이 리스크는 iPhone/Android 양쪽 캡처를 요구하는 #6에 남긴다.
- QA 리포트: `output/reports/20260516_main_tab_paste_qa.md`
- Context: `context/context_20260516_main_tab_paste_qa.md`
