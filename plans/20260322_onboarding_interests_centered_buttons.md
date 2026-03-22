# Onboarding Interests Centered Buttons

## 배경
- white shell + bottom CTA 반영 이후에도 선택 버튼 영역이 grid 기준으로 퍼져 보여 "가운데 정렬" 느낌이 약했다.
- active gradient 상태에서 border가 남는 듯한 톤 불일치가 보여 selected button은 border를 완전히 제거하는 방향이 필요했다.

## 목표
- activity purpose / interests button 그룹을 가로/세로 모두 더 중앙에 모이도록 정렬
- active button에서 border 흔적 제거
- 기존 white background + bottom CTA 구조는 유지

## 범위
- `CreatorProfileFields`, `InterestPicker`, 관련 form 레이아웃 조정
- dev + 모바일 screenshot QA

## 변경 파일
- `plans/20260322_onboarding_interests_centered_buttons.md`
- `src/components/auth/CreatorProfileFields.tsx`
- `src/components/auth/InterestPicker.tsx`
- `src/components/auth/InterestsForm.tsx`
- `src/components/auth/OnboardingForm.tsx`
- `context/context_20260322_*_onboarding_interests_centered_buttons.md`

## 테스트
- `PATH=/opt/homebrew/bin:$PATH npx eslint ...`
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- Playwright 모바일 screenshot QA

## 롤백
- centered flex button group을 기존 grid 배치로 복원
- active button inline border 제거를 되돌림

## 리스크
- 버튼 폭을 고정에 가깝게 잡으면 일부 긴 텍스트 줄바꿈이 늘어날 수 있다.

## 결과
- 완료
- activity purpose / interests 버튼 그룹을 centered layout으로 조정
- interests는 centered 3-column grid로 안정화
- activity purpose는 max-width 안에서 centered wrap 구조로 정리
- active button은 border를 완전히 제거하는 explicit style 적용
- `PATH=/opt/homebrew/bin:$PATH npx eslint ...` error 없음
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000` 정상 기동
- Playwright 모바일 screenshot으로 centered button group 및 active tone 확인

## 연결 context
- `context/context_20260322_204436_onboarding_interests_centered_buttons.md`
