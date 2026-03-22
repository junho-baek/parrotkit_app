# Onboarding Interests Centered Buttons

## 작업 개요
- activity purpose / interests 버튼 그룹을 더 분명하게 중앙 정렬되도록 재조정했다.
- active 상태에서 보이던 테두리 어긋남을 없애기 위해 selected button은 border를 완전히 제거했다.

## 주요 변경
- `src/components/auth/CreatorProfileFields.tsx`
  - activity purpose 그룹을 `max-width + centered wrap` 구조로 변경
  - active button style에서 `border: none` 적용
- `src/components/auth/InterestPicker.tsx`
  - interests 그룹을 centered 3-column grid로 조정
  - active chip style에서 `border: none` 적용
- `src/components/auth/OnboardingForm.tsx`, `src/components/auth/InterestsForm.tsx`
  - centered button group 레이아웃 유지 상태에서 bottom CTA 구조 그대로 사용

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/auth/CreatorProfileFields.tsx src/components/auth/InterestPicker.tsx src/components/auth/InterestsForm.tsx src/components/auth/OnboardingForm.tsx`
  - error 없음
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
  - 정상 기동
- Playwright 모바일 screenshot
  - `/tmp/parrotkit_centered_onboarding.png`
  - `/tmp/parrotkit_centered_interests_v2.png`
  - button group centered alignment와 active gradient 확인

## 메모
- interests는 flex-wrap보다 centered 3-column grid가 모바일에서 더 안정적으로 읽혔다.
- activity purpose는 5개 항목이라 centered wrap이 마지막 줄 균형이 더 좋아 보여 해당 방식을 유지했다.
