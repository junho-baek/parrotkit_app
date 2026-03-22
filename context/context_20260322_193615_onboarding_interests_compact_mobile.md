# Onboarding Interests Compact Mobile

## 작업 개요
- onboarding / interests 화면의 외부 박스를 제거하고, 설명 문구를 줄여 모바일 세로 화면에서 더 빠르게 읽히는 구조로 정리했다.
- onboarding은 CTA가 화면 안에 더 빨리 들어오도록 activity purpose 영역을 압축했고, interests는 3-column chip grid로 밀도를 높였다.

## 주요 변경
- `src/components/auth/OnboardingForm.tsx`
  - 외부 surface box 제거
  - intro 설명 문구 삭제
  - 타이틀/step/에러/CTA만 남긴 compact 레이아웃으로 변경
  - CTA 텍스트를 `Continue`로 단축
- `src/components/auth/InterestsForm.tsx`
  - 외부 surface box 제거
  - 설명 문구 삭제
  - selected count bar와 CTA만 남기고 간격 축소
  - CTA 텍스트를 `Finish`로 단축
- `src/components/auth/CreatorProfileFields.tsx`
  - field radius/padding 축소
  - label spacing 축소
  - activity purpose를 2-column에서 3-column compact grid로 변경
- `src/components/auth/InterestPicker.tsx`
  - 2-column에서 3-column grid로 변경
  - chip 크기/rounding/폰트 크기 축소
- `src/app/onboarding/page.tsx`, `src/app/interests/page.tsx`
  - header 높이와 content padding 축소

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
  - 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/auth/OnboardingForm.tsx src/components/auth/InterestsForm.tsx src/components/auth/CreatorProfileFields.tsx src/components/auth/InterestPicker.tsx src/app/onboarding/page.tsx src/app/interests/page.tsx`
  - error/warning 없음
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
  - 정상 기동
- Playwright 모바일 screenshot
  - `/tmp/parrotkit_compact_onboarding_v2.png`
  - `/tmp/parrotkit_compact_interests.png`

## 메모
- onboarding screenshot 기준으로 CTA가 세로 화면 하단에 더 가깝게 들어오도록 개선됐다.
- interests screenshot 기준으로 외부 박스 제거와 3-column grid로 정보 밀도가 높아졌다.
