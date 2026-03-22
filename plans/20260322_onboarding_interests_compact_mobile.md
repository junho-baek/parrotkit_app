# Onboarding Interests Compact Mobile

## 배경
- 직전 분리 작업 이후에도 onboarding / interests 화면에 외부 박스와 설명 문구가 남아 있어 모바일 세로 화면에서 밀도가 다소 높았다.
- 사용자 요청은 외부 박스를 제거하고, 불필요한 설명을 줄여 가능한 한 한 화면 안에 자연스럽게 보이도록 압축하는 것이다.

## 목표
- onboarding / interests 외부 surface box 제거
- 모바일 세로 기준으로 정보와 CTA가 더 빨리 보이도록 spacing 압축
- 설명 문구를 최소화하고 제목/필수 입력/CTA만 또렷하게 유지

## 범위
- `OnboardingForm`, `InterestsForm`, shared picker/fields spacing 조정
- `/onboarding`, `/interests` page header / padding 조정
- 로컬 dev + 모바일 screenshot QA

## 변경 파일
- `plans/20260322_onboarding_interests_compact_mobile.md`
- `src/components/auth/OnboardingForm.tsx`
- `src/components/auth/InterestsForm.tsx`
- `src/components/auth/CreatorProfileFields.tsx`
- `src/components/auth/InterestPicker.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/interests/page.tsx`
- `context/context_20260322_*_onboarding_interests_compact_mobile.md`

## 테스트
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
- `PATH=/opt/homebrew/bin:$PATH npx eslint ...`
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- Playwright 모바일 screenshot QA

## 롤백
- compact spacing/3-column chip grid 제거
- 외부 box와 보조 설명 문구가 있던 이전 split UI로 복원

## 리스크
- 지나친 압축으로 clickable area가 작아지면 사용성이 떨어질 수 있다.
- activity purpose 3-column 구성이 일부 긴 문구에서 줄바꿈을 늘릴 수 있다.

## 결과
- 완료
- onboarding / interests에서 외부 박스를 제거하고 설명 문구를 최소화
- activity purpose와 interest chip 밀도를 높여 세로 화면 내 노출량 개선
- 모바일 screenshot으로 compact layout 확인

## 연결 context
- `context/context_20260322_193615_onboarding_interests_compact_mobile.md`
