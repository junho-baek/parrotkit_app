# 모바일 안정화 + /my 인증 리다이렉트 + PWA 설치 가능화

## 배경
- 모바일 입력 중 키보드가 올라오면 하단 탭 네비게이션이 겹쳐 조작성이 떨어지는 문제가 있음.
- 비로그인 상태에서 `/my` 접근 시 즉시 로그인 페이지로 유도되어야 함.
- MVP 마감 기준으로 모바일 PWA 설치 가능 상태를 준비할 필요가 있음.

## 목표
- 키보드 노출 시 하단 탭이 콘텐츠를 가리지 않도록 동작 보완.
- 비인증 사용자의 `/my` 접근을 로그인 페이지로 안정적으로 리다이렉트.
- 기본 PWA 구성(manifest + service worker 등록)으로 모바일 설치 가능 조건 충족.

## 범위
- UI 동작 보완: 하단 탭 바 표시 조건
- 인증 UX 보완: `/my` 탭 접근 가드
- PWA 기본 자산/등록 코드 추가
- 최소 빌드 검증

## 변경 파일
- `src/components/common/BottomTabBar.tsx`
- `src/app/(tabs)/my/page.tsx`
- `src/app/layout.tsx`
- `src/components/common/index.ts`
- `src/components/common/PWARegistration.tsx` (신규)
- `src/app/manifest.webmanifest` (신규)
- `public/sw.js` (신규)
- `public/icon-192.png` (신규)
- `public/icon-512.png` (신규)

## 테스트
- `npm run build`
- 모바일 뷰포트 수동 확인
  - 입력 포커스 시 하단 탭 숨김/비가림
  - 비로그인 `/my` 접근 시 `/signin` 리다이렉트
- PWA 기본 자산 응답 확인
  - `/manifest.webmanifest`
  - `/sw.js`

## 롤백
- 위 변경 파일 revert 시 기존 동작으로 즉시 복원 가능.

## 리스크
- 하단 탭 숨김 조건이 과도하면 일부 단말에서 예기치 않게 탭이 숨겨질 수 있음.
- PWA 설치 프롬프트는 브라우저 정책/사용자 상호작용 조건에 따라 즉시 노출되지 않을 수 있음.

## 결과
- (작업 후 업데이트)

- 구현 완료:
  - 키보드/포커스 시 하단 탭 자동 숨김 (`BottomTabBar`)
  - `/my` 진입 시 비로그인 사용자 즉시 `/signin` 리다이렉트 (`MyPage` 가드)
  - 프로필 API 401 응답 시 토큰 정리 후 로그인 리다이렉트 (`Settings`)
  - PWA 기본 구성 추가 (`manifest.webmanifest`, `sw.js`, 아이콘, SW 등록)
- 검증 결과:
  - `npm run build` 통과
  - 정적 페이지 및 API 라우트 빌드 성공
- 연결 context:
  - `context/context_20260313_220500_mobile_stabilization_auth_pwa.md`

- 추가 구현(설치 안내 시트):
  - Android: `beforeinstallprompt` 수신 시 안내 시트에 `설치하기` 버튼 노출 및 브라우저 설치 프롬프트 호출
  - iOS: Safari 환경에서 `공유 버튼 -> 홈 화면에 추가` 안내 시트 노출
  - iOS 비-Safari: Safari로 열어 설치하라는 안내 문구 노출
  - 공통: standalone(PWA 실행)일 때 안내 시트 미노출
  - 공통: 사용자가 닫은 경우 7일 쿨다운(localStorage) 적용
- 검증 추가:
  - `npm run build` 재검증 통과
- 연결 context(추가):
  - `context/context_20260313_223200_pwa_install_sheet_flow.md`
