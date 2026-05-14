# Context 2026-05-14 Sub-AC 7.2.2 My Settings Entry Point

## 작업
Sub-AC 7.2.2: My 화면의 Settings entry point를 추가 또는 검증한다.

## 확인
- `src/features/profile/screens/profile-screen.tsx`는 My/Profile 화면 하단에 localized Settings 섹션을 노출한다.
- Settings 섹션은 기존 앱 언어 전환 entry point를 포함하며 English / Korean 옵션을 유지한다.
- `src/core/i18n/app-language.tsx`는 English `Settings`, Korean `설정` label을 유지한다.
- `src/core/navigation/root-tab-config.test.ts` 기준 visible bottom tab contract는 계속 Home, Explore, My로 제한된다.
- Source와 Recipes는 visible bottom tab으로 재도입하지 않았다.
- primary floating CTA copy/route behavior는 변경하지 않았다.

## 변경
- Production UI code 변경 없음.
- 기존 focused contract files를 검증했다:
  - `src/features/profile/lib/my-settings-entry.test.ts`
  - `tsconfig.my-settings-entry-check.json`
- 누락되어 있던 이 context 문서를 추가했다.

## 검증
- `./node_modules/.bin/sucrase-node src/features/profile/lib/my-settings-entry.test.ts` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.my-settings-entry-check.json` 통과.
- `NODE_PATH=src ./node_modules/.bin/sucrase-node src/core/navigation/root-tab-config.test.ts` 통과.
- `xcrun simctl list devices booted` 실패:
  - CoreSimulatorService connection invalid / connection refused.
  - 현재 환경에서는 iPhone simulator screenshot/tap evidence를 생성하지 못했다.

## 리스크
- Acceptance UI gate는 iPhone simulator지만 현재 실행 환경에서 CoreSimulatorService가 차단되어 live UI 확인은 불가했다.
- 판단 근거는 current source contract와 focused TypeScript/runtime checks이다.

## Git
- Seed constraint에 따라 commit, push, merge를 수행하지 않았다.
