# 20260502 Native Explore Tab Redesign

## 요약
- 탐색 탭을 첨부 시안 방향에 맞춰 콘텐츠 허브형 UI로 재구성했다.
- 기존 흰 배경, 상단 ParrotKit chrome, 하단 native tabs, source CTA는 유지했다.

## 변경
- `parrotkit-app/src/features/explore/screens/explore-screen.tsx`
  - 기존 verified creators avatar rail + 2열 `ShootableRecipeCard` 구조를 제거했다.
  - 검색 바를 추가했다.
  - Beauty/Food/Fitness/Tech/Lifestyle/All 카테고리 shortcut rail을 추가했다.
  - Quick Start 카드 2개를 추가했다.
  - Recommended for you 섹션을 dark image preview card로 구성했다.
  - All/Partners/Community/Brand Requests source filter를 추가했다.
  - Category/Format/Goal/Length/Level facet chip row와 Popular sort label을 추가했다.
  - Browse recipe list row를 추가했다.
  - English/Korean language state에 따라 copy가 바뀌도록 local dictionary를 추가했다.
  - 기존 `downloadRecipe` 후 `/recipe/:id`로 이동하는 흐름은 유지했다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- Metro `8081` running 확인.
- JS bundle에서 새 Explore copy가 포함된 것을 확인했다.
- Expo Go 재시작 후 screenshot 저장:
  - `output/playwright/native_explore_redesign_after_restart.png`

## 메모
- mock explore recipe가 3개뿐이라 실제 시안처럼 긴 marketplace feed는 아직 아니다.
- 이번 범위에서는 Explore 탭 자체를 바꿨고, 오른쪽 시안의 recipe detail 화면 재디자인은 별도 작업으로 분리하는 편이 안전하다.
