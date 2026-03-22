# Bottom Nav Brand Tokens

## 배경
- 하단 네비게이션 바의 활성 상태에 사용 중인 오렌지-핑크-퍼플 계열 색상이 앱의 브랜드 톤으로 반복 사용되고 있다.
- 현재 동일하거나 매우 유사한 gradient/shadow 값이 여러 컴포넌트에 인라인 스타일로 흩어져 있어 재사용성과 일관성이 떨어진다.

## 목표
- 하단 네비게이션 기준 브랜드 색상과 재사용 가능한 gradient 후보를 식별한다.
- `src/app/globals.css`에 올릴 만한 전역 CSS 변수/유틸리티로 정리한다.
- 관련 컴포넌트에서 반복되는 하드코딩 스타일 일부를 전역 토큰 참조로 치환한다.

## 범위
- `BottomTabBar`의 활성 gradient 및 glass 계열 shadow 점검
- 동일 색상 계열을 쓰는 주요 UI 컴포넌트 확인
- `globals.css`에 brand token 추가 및 일부 적용

## 변경 파일
- `plans/20260322_bottom_nav_brand_tokens.md`
- `src/app/globals.css`
- `src/components/common/BottomTabBar.tsx`
- `src/components/auth/URLInputForm.tsx`
- `src/components/auth/RecipesTab.tsx`
- `src/components/auth/DashboardContent.tsx`
- `context/context_20260322_*_bottom_nav_brand_tokens.md`

## 테스트
- `npm run dev -- --hostname 127.0.0.1 --port 3000`
- 필요 시 `npx tsc --noEmit`
- 스타일 변경 후 주요 화면의 로컬 시각 QA

## 롤백
- 전역 CSS 변수 추가분과 각 컴포넌트의 var 참조를 제거하고 기존 인라인 gradient/shadow 값으로 복원한다.

## 리스크
- 기존 화면별로 의도적으로 미세 조정된 shadow 강도가 통합 과정에서 약간 달라질 수 있다.
- Tailwind 클래스와 인라인 style이 혼합된 구조라 토큰 적용 범위를 과도하게 넓히면 예상치 못한 시각 변화가 생길 수 있다.

## 결과
- 완료
- 하단 네비게이션의 active glass 색상과 nav surface/shadow를 `src/app/globals.css`의 전역 CSS 변수로 이동
- 반복 사용되던 오렌지-핑크-퍼플 액션 gradient/shadow를 공통 brand token으로 정리
- `BottomTabBar`, `URLInputForm`, `RecipesTab`, `DashboardContent`에서 전역 토큰 참조로 치환
- `npx tsc --noEmit` 통과
- `npm run dev -- --hostname 127.0.0.1 --port 3000` 시도
  - Next dev 시작 직후 기존 로컬 persistence/database 오류로 중단: `Failed to open database / invalid digit found in string`

## 연결 context
- `context/context_20260322_182153_bottom_nav_brand_tokens.md`
