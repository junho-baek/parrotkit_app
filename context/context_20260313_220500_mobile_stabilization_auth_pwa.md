# Context - 모바일 안정화 + /my 인증 리다이렉트 + PWA 기본 구성

## 작업 일시
- 2026-03-13 Asia/Seoul

## 배경
- 모바일 입력 중 키보드가 올라왔을 때 하단 탭 네비게이션이 조작을 가리는 UX 이슈가 있었음.
- 비로그인 상태에서 `/my` 진입 시 로그인 페이지로 즉시 보내야 하는 요구가 있었음.
- 모바일 설치(PWA) 가능 상태를 MVP 범위에서 기본 수준으로 갖추기 위해 manifest/service worker 구성이 필요했음.

## 수행 내용
1. 하단 탭 키보드 대응 추가
   - 파일: `src/components/common/BottomTabBar.tsx`
   - 포커스 대상(`input/textarea/select/contentEditable`) 및 `visualViewport` 축소를 감지해 키보드 노출로 판단될 때 하단 탭을 숨김.

2. `/my` 탭 접근 인증 가드 강화
   - 파일: `src/app/(tabs)/my/page.tsx`
   - 클라이언트 진입 시 토큰이 없으면 `router.replace('/signin')`로 즉시 리다이렉트.
   - 인증 확인 전에는 `null` 렌더로 화면 깜빡임 최소화.

3. 프로필 API 401 처리 보강
   - 파일: `src/components/auth/DashboardContent.tsx`
   - `/api/user/profile` 응답이 401이면 로컬 토큰 정리 후 `/signin`으로 리다이렉트.

4. PWA 기본 구성 추가
   - 신규 파일:
     - `public/manifest.webmanifest`
     - `public/sw.js`
     - `public/icon-192.png`
     - `public/icon-512.png`
     - `src/components/common/PWARegistration.tsx`
   - 수정 파일:
     - `src/components/common/index.ts`
     - `src/app/layout.tsx`
   - `layout` metadata에 manifest/icons/viewport theme color를 추가하고, 클라이언트에서 service worker 등록 로직을 실행하도록 구성.

## 검증
- 실행: `npm run build`
- 결과: 성공
  - TypeScript 검사 통과
  - 정적 페이지/동적 라우트 빌드 완료

## 메모
- 이번 변경은 DB 스키마/RLS/쿼리 계약 변경이 없어 `npm run db:schema` 대상이 아님.
- PWA 설치 프롬프트 노출 시점은 브라우저 정책(사용자 상호작용/설치 이력)에 따라 달라질 수 있음.
