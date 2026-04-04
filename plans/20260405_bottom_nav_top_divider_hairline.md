# Bottom Nav Top Divider Hairline

## 배경
- 최근 하단 네비게이션을 66px 기준으로 정리하는 과정에서 상단 구분선의 존재감이 화면마다 다르게 느껴질 수 있다.
- 사용자는 하단 네비게이션 위쪽에 얇은 구분선이 보이길 원한다.

## 목표
- 하단 네비게이션 상단에 hairline 수준의 얇은 구분선을 유지한다.
- 기존 66px 높이와 safe area 계산은 그대로 유지한다.
- 다른 탭 강조 스타일이나 paste 액션 버튼의 시각 중심은 건드리지 않는다.

## 범위
- `src/components/common/BottomTabBar.tsx`
- 필요 시 하단 네비게이션 border 토큰

## 변경 파일
- `src/components/common/BottomTabBar.tsx`

## 테스트
- `npx eslint src/components/common/BottomTabBar.tsx`
- 브라우저에서 하단 네비 상단 구분선 두께 시각 확인

## 롤백
- 상단 border width를 기존 `1px`로 되돌린다.

## 리스크
- 너무 얇게 만들면 일부 디스플레이에서 구분선이 거의 보이지 않을 수 있다.
- safe area 포함 환경에서 실제 체감 두께가 기기마다 다르게 보일 수 있다.

## 결과
- 하단 네비게이션 상단 border width를 `0.5px` hairline 기준으로 조정했다.
- border 문자열도 상수 `BOTTOM_NAV_BORDER_WIDTH`를 직접 사용하도록 바꿔 이후 높이 계산과 선 두께가 어긋나지 않게 맞췄다.
- 로컬 `/home` 브라우저 확인에서 nav 총 높이는 `66.5px`로 계산되어, 66px 본체 위에 half-pixel 구분선이 붙는 형태로 반영됐다.

## 연결 Context
- `context/context_20260405_065610_bottom_nav_top_divider_hairline.md`
