# Bottom Tab Liquid Glass Active State

## 배경
- Lucide 기반 하단 탭 네비게이션으로 전환한 뒤, 사용자 요청으로 active 상태에 더 투명하고 유동적인 glass 표현이 필요해졌다.
- 참고 이미지의 오렌지-핑크-퍼플 계열 그라데이션을 거의 투명한 리퀴드 글라스 질감으로 녹여내는 것이 목표다.

## 목표
- 활성 탭에 반투명 gradient, blur, 내부 하이라이트를 적용해 liquid glass 느낌을 만든다.
- active pill 안쪽의 별도 박스 느낌은 제거해 더 자연스럽고 가벼운 glass 표현으로 정리한다.
- 탭을 눌렀을 때 잠깐 보이던 내부 박스 / tap highlight도 제거한다.
- 기존 탭 동작, 접근성, 이벤트 로깅, 키보드 대응 로직은 유지한다.

## 범위
- `BottomTabBar` active 스타일 재구성
- 로컬 `dev` 기반 모바일 시각 QA

## 변경 파일
- `src/components/common/BottomTabBar.tsx`
- `plans/20260318_bottom_tab_liquid_glass_active.md`
- `context/context_20260318_*_bottom_tab_liquid_glass_active.md`
- `output/reports/20260318_parrotkit_bottom_tab_liquid_glass_active_qa.md`

## 테스트
- `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- Playwright 모바일 스크린샷 QA

## 롤백
- active 탭의 glass 레이어와 투명 gradient 제거
- 이전 Lucide active 스타일로 복원

## 리스크
- 반투명 효과가 너무 약하면 active 상태가 덜 눈에 띌 수 있다.
- 반대로 blur와 glow가 과하면 탭 라벨 가독성이 떨어질 수 있다.

## 결과
- 완료
- `BottomTabBar` active 탭에 반투명 liquid glass gradient, blur, highlight 레이어 적용
- active 상태 내부 박스 느낌 제거
- 탭 press 시 내부 박스가 다시 보이지 않도록 tap highlight 및 pressed 스타일 보정
- `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000` 기준 Explore 탭 QA 확인
- Playwright 모바일 QA 스크린샷 생성: `output/playwright/20260318_bottom_tab_liquid_glass_active_explore_clean.png`
- 연결 context: `context/context_20260318_033900_bottom_tab_liquid_glass_active.md`
