# Context - Bottom tab active 상태 liquid glass 적용

## 작업 배경
- 사용자 요청: 하단 네비게이션 바 active 상태에 참고 이미지처럼 오렌지-핑크-퍼플 계열의 거의 투명한 liquid glass 느낌을 적용하고 싶다는 요청.
- 기존 Lucide active 상태는 선명하지만 상대적으로 단단한 카드 느낌이어서, 더 유동적이고 얇은 glass 표현이 필요했다.

## 변경 목표
- 활성 탭 전체를 반투명 glass pill로 보이게 만들기.
- soft blur, 내부 하이라이트, 옅은 bloom을 더해 liquid 느낌을 강화하되 라벨 가독성은 유지하기.
- 내부 아이콘 박스 느낌은 제거해 더 가볍고 자연스러운 active pill로 정리하기.

## 변경 내용
- 파일: `src/components/common/BottomTabBar.tsx`
  - nav 배경을 더 투명하게 조정하고 backdrop blur 강화
  - active 탭 루트에 오렌지-핑크-퍼플 gradient를 직접 적용
  - active 탭에 glass inset, 상단 반사광, 하단 violet bloom 레이어 추가
  - 이후 피드백 반영:
    - active pill 내부의 별도 glass chip 제거
    - 아이콘이 바깥 liquid pill 위에 직접 떠 있는 구조로 정리
  - 기존 Lucide 아이콘, 라우팅, GA 이벤트 로깅, 키보드 숨김 로직은 유지
- 파일: `plans/20260318_bottom_tab_liquid_glass_active.md`
  - 작업 계획 문서 작성
- 파일: `output/playwright/20260318_bottom_tab_liquid_glass_active_explore_clean.png`
  - mobile Explore 탭 시각 QA 스크린샷 생성

## 검증
- `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`로 dev 서버 실행 후 시각 검증
- `npx playwright screenshot -b chromium --device="iPhone 13" --load-storage output/playwright/20260318_bottom_tab_lucide_nav_storage.json --wait-for-timeout 2000 --wait-for-selector "nav" http://127.0.0.1:3000/explore output/playwright/20260318_bottom_tab_liquid_glass_active_explore_clean.png`
  - Explore active 탭의 liquid glass 표현, 내부 박스 제거 상태, 라벨 가독성 확인

## 기대 동작
- active 탭이 거의 투명한 gradient glass pill로 강조된다.
- 기존보다 더 부드럽고 유동적인 highlight가 보이며, 내부 박스 없이 아이콘/라벨이 한 덩어리로 읽힌다.
- 입력 포커스/키보드 활성화 시 하단 네비는 기존처럼 숨겨진다.
