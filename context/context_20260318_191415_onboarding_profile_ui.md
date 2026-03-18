# Context - 2026-03-18 19:14 KST - onboarding profile extras UI

## 작업 개요
- 온보딩(`InterestsForm`)에 추가 프로필 입력 UI를 확장했다.
  - 나이대, 성별, 도메인, 팔로워 규모, 활동 목적
- 마이페이지(`Settings`) 유저 카드 클릭 시 동일 필드를 수정할 수 있는 편집 모달 UI를 추가했다.
- 이번 작업은 UI 우선으로 진행했으며, 서버 API/DB 스키마는 변경하지 않았다.

## 주요 변경
1. 온보딩 추가 필드 타입/옵션 정리
- `src/types/auth.ts`
  - `OnboardingProfileExtras` 타입 추가
  - 기본값 `ONBOARDING_PROFILE_DEFAULTS` 추가
  - 나이대/성별/팔로워/활동목적/도메인 제안 옵션 상수 추가

2. 로컬 저장 유틸 추가
- `src/lib/onboarding-profile.ts` (신규)
  - `readOnboardingProfileExtras`
  - `saveOnboardingProfileExtras`
  - `isOnboardingProfileExtrasComplete`

3. 온보딩 화면 UI 확장
- `src/components/auth/InterestsForm.tsx`
  - 기존 관심사 선택 UI 위에 Creator profile 입력 섹션 추가
  - 필수 입력 검증(5개 항목 모두 입력)
  - 관심사 저장 성공 시 추가 프로필을 localStorage에 저장
  - 기존 `/api/interests` 요청 계약은 유지

4. 마이페이지 유저 카드 편집 UI
- `src/components/auth/DashboardContent.tsx`
  - 유저 카드 클릭/키보드 접근(Enter/Space)으로 프로필 편집 모달 오픈
  - 카드 내부에 현재 추가 프로필 정보 요약 표시
  - 모달에서 수정 후 localStorage 저장 및 카드 즉시 반영

## 검증
- 타입 체크
  - `npx tsc --noEmit` 통과
- 정적 검사
  - `npx eslint src/components/auth/InterestsForm.tsx src/components/auth/DashboardContent.tsx src/types/auth.ts src/lib/onboarding-profile.ts`
  - 결과: error 없음 (기존 `<img>` warning만 출력)
- dev 서버 확인
  - `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
  - 준비 완료 확인 후 `HEAD /interests`, `HEAD /my` 응답 200 확인

## 메모
- 이번 턴은 사용자 요청대로 UI만 빠르게 구성했으며, 추가 프로필 정보는 클라이언트 저장(localStorage)만 사용한다.
- Notion 업로드는 사용자 명시 요청이 없어 수행하지 않았다.
