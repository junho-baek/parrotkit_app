# Onboarding Interests Split Mobile

## 배경
- 현재 `/interests`에 creator profile 입력과 interests 선택이 한 화면에 섞여 있어 모바일에서 길고 답답한 폼이 된다.
- QA에서 상단 필드 잘림, interest chip 정렬 어긋남, 브랜드 컬러 미반영, 경고 문구 톤 불일치가 확인되었다.

## 목표
- onboarding profile 단계와 interests 선택 단계를 두 페이지로 분리한다.
- 모바일에서 상단부터 자연스럽게 읽히는 레이아웃으로 정리한다.
- interest 선택 및 profile 선택 UI를 브랜드 토큰 기준으로 통일한다.
- 기존 유저는 차단하지 않고 profile 보완을 추천만 하도록 유지한다.

## 범위
- `/onboarding`, `/interests` 흐름 및 UI 재구성
- sign up / sign in 이후 onboarding 진입 경로 조정
- creator profile 공통 UI와 interest picker 공통 UI 분리
- my page profile recommendation 문구 추가

## 변경 파일
- `plans/20260322_onboarding_interests_split_mobile.md`
- `src/components/auth/*`
- `src/app/onboarding/page.tsx`
- `src/app/interests/page.tsx`
- `src/app/globals.css`
- `context/context_20260322_*_onboarding_interests_split_mobile.md`

## 테스트
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit`
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --hostname 127.0.0.1 --port 3000`
- signup/signin/onboarding/interests/my 페이지 로컬 QA

## 롤백
- onboarding profile 입력을 `InterestsForm` 내부로 되돌린다.
- sign in / sign up 라우팅을 `/interests` 직행 구조로 복원한다.
- shared creator profile / interest picker 분리를 제거하고 기존 inline UI로 복원한다.

## 리스크
- 로컬 저장 기반 onboarding step guard가 새로 추가되면 직접 URL 진입 시 리다이렉트 타이밍 이슈가 생길 수 있다.
- dashboard profile editor와 onboarding UI를 공통화하는 과정에서 기존 my page 동작이 달라질 수 있다.

## 결과
- 완료
- `/onboarding`을 creator profile 입력 전용 step으로 전환하고 `/interests`는 interest picker 전용 step으로 분리
- sign up / sign in 이후 onboarding 진입 경로를 `/onboarding` 기준으로 조정
- creator profile 입력 UI와 interest chip UI를 shared component로 분리
- interest / activity purpose 선택 스타일을 브랜드 토큰 기반으로 정리하고 모바일 top-aligned 레이아웃으로 변경
- my page creator profile 카드에 non-blocking recommendation 상태를 추가
- `PATH=/opt/homebrew/bin:$PATH npx tsc --noEmit` 통과
- `PATH=/opt/homebrew/bin:$PATH npx eslint ...` 실행
  - error 없음
  - 기존 `DashboardContent.tsx`의 `<img>` 관련 warning만 유지
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000` 기동 성공
- Playwright 모바일 스크린샷으로 `/onboarding`, `/interests` 페이지 shell 확인
- 로컬 API 인증으로 `/api/user/profile` 응답 확인
- 테스트 계정에는 이미 interests가 저장돼 있어 신규 유저의 완전한 `/signin -> /onboarding` 자동 전환은 코드 경로 기준으로 반영하고, 브라우저 검증은 인증 저장소 기반 페이지 확인으로 보완

## 연결 context
- `context/context_20260322_185758_onboarding_interests_split_mobile.md`
