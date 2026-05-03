# Native Explore Creator First Discovery

## 배경
- Explore 탭이 검색/추천 구조를 갖췄지만, 아직 수동 갤러리처럼 보이고 CTA가 `열기` 중심이라 촬영 행동으로 이어지는 힘이 약하다.
- 제품 방향은 레시피 생성 자체보다 레시피를 활용해 촬영하는 데 있다.
- Explore 안에서 `소스` wording은 생성 행동의 primary label로 보이면 혼란스럽다.

## 목표
- Explore 첫 화면에서 검색, 카테고리, 추천 레시피가 명확히 보이게 한다.
- 추천/둘러보기 카드가 저장, 촬영하기, 리믹스, 지원하기 같은 행동 중심 CTA를 보여주게 한다.
- 카드에 컷 수, 길이, 프롬프터, 예시 영상, 촬영 팁, 난이도 등 촬영 전 판단 정보를 노출한다.
- iPhone dynamic island/status bar와 스크롤 콘텐츠가 겹치지 않도록 AppScreenScrollView safe-area 계약을 복구한다.
- Explore에서는 floating `소스` CTA를 노출하지 않는다.

## 범위
- `parrotkit-app` 네이티브 앱 UI만 변경한다.
- 실제 서버/저장소/브랜드 지원 API는 추가하지 않는다.
- 저장은 기존 `downloadRecipe` mock 동작을 사용한다.
- 촬영하기는 저장된 recipe의 첫 scene prompter로 이동한다.
- 리믹스/지원하기는 현재 존재하는 `recipe-create` flow로 연결한다.

## 변경 파일
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `plans/20260503_native_explore_creator_first_discovery.md`
- `context/context_20260503_native_explore_creator_first_discovery.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- 가능하면 Metro/시뮬레이터에서 Explore 첫 화면과 스크롤 safe-area를 육안 확인한다.

## 롤백
- Explore screen을 이전 추천/리스트 구조로 되돌린다.
- `GlobalSourceCta`의 Explore 숨김 조건을 제거한다.
- 새 context/plan 문서를 제거한다.

## 리스크
- 브랜드 요청과 리믹스는 아직 mock/route-level flow라 실제 신청서나 remix 저장 모델은 없다.
- Brand request card는 현재 mock marketplace 데이터와 함께 화면에서 파생한다.
- 언어 설정이 runtime state라 QA 시 English/Korean 화면이 모두 보이려면 My에서 전환해야 한다.

## 결과
- Explore 화면을 creator-first discovery 구조로 재정리했다.
- Header, search, category rail, horizontal recommended recipe cards, compact browse list 흐름을 유지하면서 촬영 판단 메타데이터와 행동 CTA를 강화했다.
- 추천/둘러보기 카드에 파트너 크리에이터/커뮤니티/기업 요청 badge, 인증 badge, 저장/조회수, 3컷/30초/프롬프터/예시 영상/촬영 팁/난이도 정보를 노출했다.
- CTA는 상태와 타입에 따라 `저장`, `촬영하기`, `리믹스`, `지원하기`로 분기한다.
- `저장`은 기존 `downloadRecipe`를 사용하고, `촬영하기`는 저장된 recipe의 첫 scene prompter로 바로 이동한다.
- `리믹스`와 `지원하기`는 현재 존재하는 `recipe-create` flow로 연결했다.
- Explore 탭에서는 전역 floating `소스` CTA를 숨겨 Explore 안의 primary creation wording에서 `소스`가 보이지 않게 했다.
- Explore가 AppScreenScrollView의 safe-area top padding을 덮어쓰던 `paddingTop`을 제거해 dynamic island/status bar 겹침 리스크를 줄였다.
- iPhone 17 Pro Max 실기기 시뮬레이터 QA 후 Explore에서 Quick Start 섹션을 제거했다.
- 스크롤 중 콘텐츠가 dynamic island/status bar 뒤로 비치는 문제를 줄이기 위해 Explore 전용 safe-area shield를 추가했다.

## 검증 결과
- `cd parrotkit-app && npm install` 실행. 기존 lockfile 변경 없이 `node_modules`만 설치됨.
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- `cd parrotkit-app && npx expo config --type public >/tmp/parrotkit-expo-config.json` 통과.
- `npm run web -- --port 8082 --non-interactive`는 Expo가 `--non-interactive` 미지원 경고 후 Metro를 시작했지만 포트 응답이 없어 중단했다. 남은 Expo/curl 프로세스는 정리했다.
- 2026-05-03 iPhone 17 Pro Max 시뮬레이터에서 `exp://127.0.0.1:8082/--/explore`로 확인했다.
- 스크린샷: `output/playwright/iphone17promax_explore_no_quickstart_8082.png`

## 연결 context
- `context/context_20260503_native_explore_creator_first_discovery.md`
