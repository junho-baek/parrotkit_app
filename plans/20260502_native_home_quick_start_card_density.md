# Native Home Quick Start Card Density

## 배경
- Home의 `Start your recipes quickly` 9:16형 레시피 카드가 첫 화면에서 너무 크게 보여 Recent recipes 진입을 밀어낸다.

## 목표
- 빠른 시작 카드의 시각적 무게를 줄인다.
- 9:16형 thumbnail-card 인상은 유지하되 한 화면에 더 가볍게 들어오게 한다.

## 범위
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`의 quick-start rail/card 스타일만 수정한다.
- Continue card, Recent recipes, 언어 설정은 변경하지 않는다.

## 변경 파일
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
- `plans/20260502_native_home_quick_start_card_density.md`
- `context/context_20260502_native_home_quick_start_card_density.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- Metro reload 후 simulator screenshot으로 카드 밀도 확인

## 롤백
- quick tile width/height/font/badge/play size를 이전 값으로 되돌린다.

## 리스크
- 너무 작아지면 카드 제목 가독성이 떨어질 수 있어 제목은 2줄까지 유지한다.

## 결과
- quick-start tile을 `154x218`에서 `132x188`로 줄였다.
- 카드 border radius, padding, title, scene count, badge, play button 크기를 함께 낮췄다.
- simulator screenshot으로 Recent recipes 섹션이 더 빨리 보이는 것을 확인했다.
- 연결 context: `context/context_20260502_native_home_quick_start_card_density.md`
