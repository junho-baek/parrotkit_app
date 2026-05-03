# Native Explore Creator First Discovery Context

## 작업 시간
- 2026-05-03 KST

## 요약
- Explore 탭을 passive recipe gallery보다 creator-first discovery and shooting assistant에 가깝게 조정했다.
- Explore 안에서 `소스` floating CTA가 primary creation label처럼 보이지 않도록 전역 CTA를 Explore route에서 숨겼다.
- 카드 CTA를 `저장`, `촬영하기`, `리믹스`, `지원하기`로 정리하고 저장/촬영 동작을 기존 mock workspace 흐름에 연결했다.

## 변경
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
  - Header, search, category rail, recommended horizontal cards, browse compact list 구조로 재구성했다.
  - 추천 카드를 large horizontal image card로 바꾸고 source badge, verification badge, creator handle, saves/views, category and filming metadata chips를 추가했다.
  - Browse list는 compact row card로 유지하되 thumbnail, title, description, creator, 3컷/30초, chips, stats, bookmark, main CTA를 노출한다.
  - 브랜드 요청 synthetic card를 추가해 `기업 요청` filter와 `지원하기` CTA를 제공한다.
  - 저장 전 verified partner recipe는 `저장`, 저장 후에는 `촬영하기`, community recipe는 `리믹스`, brand request는 `지원하기` CTA를 사용한다.
  - `촬영하기`는 `downloadRecipe`로 저장된 recipe를 확보한 뒤 첫 scene prompter route로 이동한다.
  - `리믹스`는 `recipe-create?mode=manual&remixOf=...`, `지원하기`는 `recipe-create?mode=brand`로 이동한다.
  - 기존 Explore contentContainer의 manual `paddingTop`을 제거하고 `AppScreenScrollView`의 safe-area/top-bar padding을 사용한다.
  - iPhone 17 Pro Max 확인 후 Quick Start 섹션을 제거해 category rail 다음에 Recommended Recipes가 바로 나오게 했다.
  - 스크롤 중 콘텐츠가 status bar/dynamic island 뒤로 비치는 문제를 줄이기 위해 safe-area shield를 추가했다.
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
  - `/explore`에서 floating CTA를 숨긴다.

## 검증
- `cd parrotkit-app && npm install` 실행. lockfile 변경 없음.
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- `cd parrotkit-app && npx expo config --type public >/tmp/parrotkit-expo-config.json` 통과.
- iPhone 17 Pro Max 시뮬레이터에서 `exp://127.0.0.1:8082/--/explore`로 확인했다.
- 스크린샷: `output/playwright/iphone17promax_explore_no_quickstart_8082.png`

## 미완료 / 리스크
- 8082 Metro는 iPhone 17 Pro Max 확인을 위해 실행 중이다.
- 브랜드 요청/리믹스는 실제 저장 모델이나 신청서가 아니라 현재 존재하는 `recipe-create` route로 연결한 mock-level flow다.
- 실제 스크롤 중 safe-area는 코드와 Max 시뮬레이터 화면 기준으로 보강했지만, 손 QA로 한 번 더 확인하는 편이 좋다.
