# 20260502 Native Home Quick Start Card Density

## 요약
- Home의 `내 레시피 빠르게 시작하기` quick-start 카드가 화면에서 크게 느껴져 card density를 낮췄다.

## 변경
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
  - quick tile size: `154x218` -> `132x188`
  - quick rail gap: `12` -> `10`
  - tile radius: `22` -> `20`
  - tile padding: `12` -> `10`
  - title: `16px/3 lines` -> `14px/2 lines`
  - scene count: `12px` -> `11px`
  - badge icon/text/padding 축소
  - play button: `30x30` -> `28x28`

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- Metro `8081` running 확인.
- simulator reload 후 screenshot 저장:
  - `output/playwright/native_home_quick_card_density.png`

## 메모
- 더 줄이면 카드 제목과 scene count 가독성이 급격히 약해질 수 있어 이번 조정은 약 14% 크기 축소로 제한했다.
