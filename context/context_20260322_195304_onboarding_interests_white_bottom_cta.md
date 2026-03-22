# Onboarding Interests White Bottom CTA

## 작업 개요
- onboarding / interests 화면의 희끄무리한 배경을 제거하고 white 기반 shell로 재정리했다.
- CTA는 두 화면 모두 하단 dock 구조로 옮기고, activity purpose / interest button 영역은 콘텐츠 중앙 쪽에 배치했다.
- selected count bar는 제거했고, active gradient 표현은 explicit inline style로 고정해 더 안정적으로 보이도록 수정했다.

## 주요 변경
- `src/app/onboarding/page.tsx`, `src/app/interests/page.tsx`
  - radial/soft gradient background 제거
  - white background + 얇은 header border 구조로 단순화
  - content wrapper를 full-height 기반으로 유지
- `src/components/auth/OnboardingForm.tsx`
  - form을 `flex min-h-full flex-col` 구조로 변경
  - CTA를 하단 sticky dock로 이동
  - content는 중앙 쪽에서 읽히도록 `flex-1` 영역에 배치
- `src/components/auth/InterestsForm.tsx`
  - selected count bar 제거
  - interest grid를 `flex-1` 중앙 정렬로 이동
  - CTA를 하단 sticky dock로 이동
- `src/components/auth/CreatorProfileFields.tsx`
  - activity purpose selected state를 explicit gradient/backgroundColor style로 고정
- `src/components/auth/InterestPicker.tsx`
  - selected state를 explicit gradient/backgroundColor style로 고정
- `src/app/globals.css`
  - button / pill shadow 강도와 active gradient 표현을 더 단순한 톤으로 조정

## 검증
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
  - 정상 기동
- Playwright 모바일 screenshot
  - `/tmp/parrotkit_white_bottom_onboarding_v2.png`
  - `/tmp/parrotkit_white_bottom_interests_v3.png`
  - white background, bottom CTA, selected chip gradient 확인
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/app/globals.css src/app/onboarding/page.tsx src/app/interests/page.tsx src/components/auth/OnboardingForm.tsx src/components/auth/InterestsForm.tsx src/components/auth/CreatorProfileFields.tsx src/components/auth/InterestPicker.tsx`
  - `globals.css` ignore warning만 출력
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 이번 변경과 무관한 기존 오류로 실패:
    - `src/components/common/RecipeResult.tsx(200,19): Cannot find name 'initialMatchResults'`
    - `src/components/common/RecipeResult.tsx(202,8): Cannot find name 'initialMatchResults'`

## 메모
- 현재 워크트리에 `src/components/common/RecipeResult.tsx`의 unrelated 변경이 있어, 전체 타입 체크는 해당 파일 상태에 영향을 받는다.
- 버튼 색이 캡처 환경에서도 안정적으로 보이도록 CSS variable 기반 gradient 대신 explicit inline gradient를 사용했다.
