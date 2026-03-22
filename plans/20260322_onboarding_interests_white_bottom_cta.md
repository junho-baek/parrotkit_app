# Onboarding Interests White Bottom CTA

## 배경
- compact 버전 이후에도 onboarding / interests에 희끄무리한 배경과 중간 count bar가 남아 있어 여전히 시선이 분산된다.
- 사용자 요청은 순백 배경, 하단 고정 CTA, 버튼 영역 중앙 정렬, 더 안정적인 active 색상으로의 정리다.

## 목표
- onboarding / interests 배경을 완전한 white 기반으로 정리한다.
- CTA를 화면 최하단에 두고 선택 버튼 영역은 가운데로 끌어온다.
- chip / purpose active 상태의 어색한 highlight를 정리한다.
- selected count bar는 제거한다.

## 범위
- `OnboardingForm`, `InterestsForm`, `CreatorProfileFields`, `InterestPicker` 레이아웃 및 active style 조정
- `/onboarding`, `/interests` page shell 배경/패딩 조정
- dev + 모바일 screenshot QA

## 변경 파일
- `plans/20260322_onboarding_interests_white_bottom_cta.md`
- `src/app/globals.css`
- `src/app/onboarding/page.tsx`
- `src/app/interests/page.tsx`
- `src/components/auth/OnboardingForm.tsx`
- `src/components/auth/InterestsForm.tsx`
- `src/components/auth/CreatorProfileFields.tsx`
- `src/components/auth/InterestPicker.tsx`
- `context/context_20260322_*_onboarding_interests_white_bottom_cta.md`

## 테스트
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
- `PATH=/opt/homebrew/bin:$PATH npx eslint ...`
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- Playwright 모바일 screenshot QA

## 롤백
- white shell / bottom CTA dock 제거
- compact version의 inline button + count bar 구조로 복원

## 리스크
- 하단 CTA 고정이 작은 화면에서 콘텐츠와 겹치면 오히려 답답해질 수 있다.
- 순백 배경으로 전환하면 button outline 대비가 약해질 수 있어 selected/unselected contrast를 더 신경 써야 한다.

## 결과
- 완료
- `/onboarding`, `/interests` 배경을 white shell로 정리
- CTA를 각 화면 하단 dock 구조로 이동
- activity purpose / interest button 영역은 content middle에 더 가깝게 배치
- interests selected count bar 제거
- selected state와 CTA gradient를 explicit style로 고정해 어색한 active 표현 보정
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000` 정상 기동
- Playwright 모바일 screenshot으로 white background + bottom CTA 확인
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`는 기존 `src/components/common/RecipeResult.tsx`의 unrelated 타입 오류 때문에 실패
- `PATH=/opt/homebrew/bin:$PATH npx eslint ...` 실행
  - `globals.css` ignore warning 외 error 없음

## 연결 context
- `context/context_20260322_195304_onboarding_interests_white_bottom_cta.md`
