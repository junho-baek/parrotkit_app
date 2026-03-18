# 온보딩 추가 프로필 필드 + 마이페이지 카드 편집 UI

## 배경
- 현재 사인업 온보딩에서 관심사만 수집하고 있으며, 나이대/성별/도메인/팔로워/활동 목적 같은 추가 컨텍스트를 받을 수 없다.
- 마이페이지 유저 카드에서도 해당 정보를 수정할 수 있는 빠른 편집 UI가 필요하다.
- 이번 요청은 빠른 프로토타이핑 목적의 UI 구성으로, API/DB 스키마 변경은 범위에서 제외한다.

## 목표
- 온보딩(`InterestsForm`)에 다음 프로필 입력 UI를 추가한다.
  - 나이대(예: Gen Z)
  - 성별
  - 도메인
  - 팔로워 규모
  - 활동 목적
- 마이페이지(`Settings`)에서 유저 카드를 탭/클릭하면 동일 항목을 수정할 수 있는 편집 UI를 제공한다.
- 입력값은 우선 클라이언트 저장소(localStorage) 기반으로 유지한다.

## 범위
- 프론트엔드 UI/상태/로컬 저장 로직 추가
- 기존 `/api/interests`, `/api/user/profile` 서버 계약은 유지
- `dev` 기준 동작 검증

## 변경 파일
- `src/types/auth.ts`
- `src/lib/onboarding-profile.ts` (신규)
- `src/components/auth/InterestsForm.tsx`
- `src/components/auth/DashboardContent.tsx`
- `plans/20260318_onboarding_profile_ui.md`
- `context/context_20260318_*_onboarding_profile_ui.md`

## 테스트
- `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- `npx tsc --noEmit`
- 온보딩 화면에서 추가 필드 입력/저장 확인
- 마이페이지 유저 카드 클릭 시 편집 모달 오픈/수정/저장 확인

## 롤백
- 신규 유틸(`onboarding-profile.ts`) 제거
- `InterestsForm`, `DashboardContent`, `auth.ts`에서 추가 UI/상태 로직 제거

## 리스크
- UI-only 저장(localStorage)은 디바이스/브라우저 간 동기화되지 않는다.
- 서버 저장이 아니므로 로그아웃/브라우저 데이터 삭제 시 값이 유실될 수 있다.
- 추후 API 연동 시 필드 값 enum/검증 규칙 재정렬이 필요할 수 있다.

## 결과
- 완료
- 요약:
  - 온보딩에 나이대/성별/도메인/팔로워/활동 목적 UI를 추가했다.
  - 마이페이지 유저 카드 클릭 시 편집 모달로 동일 항목을 수정할 수 있게 했다.
  - 저장은 localStorage 기반으로 연결했고 기존 API 계약은 유지했다.
- 연결 context:
  - `context/context_20260318_191415_onboarding_profile_ui.md`
