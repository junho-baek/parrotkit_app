# Bottom Nav Brand Tokens

## 작업 개요
- 하단 네비게이션 바의 active glass 색상과 앱 전반에서 반복되던 오렌지-핑크-퍼플 액션 gradient를 전역 CSS 토큰으로 정리했다.

## 주요 변경
- `src/app/globals.css`
  - `--brand-sunset-orange`, `--brand-orchid-pink`, `--brand-electric-violet` 추가
  - `--gradient-brand-action`, `--gradient-brand-nav-glass` 추가
  - 브랜드 액션 shadow 3종과 bottom nav surface/border/shadow 관련 변수 추가
  - 재사용용 `.brand-gradient-action`, `.brand-gradient-nav-glass` 유틸리티 클래스 추가
- `src/components/common/BottomTabBar.tsx`
  - active glass gradient, nav background, highlight, bloom, shadow를 전역 CSS 변수 참조로 변경
- `src/components/auth/URLInputForm.tsx`
  - CTA gradient/shadow를 전역 brand action 토큰으로 변경
- `src/components/auth/RecipesTab.tsx`
  - CTA gradient/shadow를 전역 brand action 토큰으로 변경
- `src/components/auth/DashboardContent.tsx`
  - 브랜드 액션 gradient/shadow를 전역 brand action 토큰으로 변경

## 찾은 전역화 후보
- 기본 브랜드 액션 gradient
  - `linear-gradient(135deg, #ff9568 0%, #de81c1 52%, #8c67ff 100%)`
  - 하단 nav와 가장 가까운 브랜드 톤이며 여러 CTA에 반복 사용 중
- 하단 nav active glass gradient
  - `linear-gradient(118deg, rgba(255, 149, 104, 0.34) 0%, rgba(222, 129, 193, 0.18) 48%, rgba(140, 103, 255, 0.34) 100%)`
  - active 탭 전용 강조 표현으로 재사용 가치 높음
- 하단 nav surface/shadow 세트
  - nav 전체 배경, 상단 border, active pill shadow, overlay/highlight/bloom
  - 향후 유사 glass UI 제작 시 같은 톤을 유지하기 쉬움

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 통과
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --hostname 127.0.0.1 --port 3000`
  - Next.js 16.1.4 dev 서버 시작 시도
  - 앱 초기화 단계에서 기존 로컬 환경 오류로 중단:
    - `Failed to open database`
    - `Loading persistence directory failed`
    - `invalid digit found in string`

## 메모
- 이번 작업은 색상/스타일 토큰 정리에 집중했고, 기존 워크트리에 있던 다른 미완료 변경은 유지했다.
- `RecipeResult.tsx`는 기존 미커밋 변경이 커서 이번 전역 토큰 치환 범위에서는 제외했다.
