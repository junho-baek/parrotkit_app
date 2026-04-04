# Paste Route-Backed Drawer

## 작업 요약
- `/paste`를 유지한 채, `(tabs)` 내부 soft navigation에서는 route-backed drawer로 열리도록 parallel route slot과 intercepted route를 추가했다.
- paste 입력 UI를 page/drawer 공용 구조로 재작성하고, drawer에 맞는 헤더와 레이아웃을 적용했다.
- 필수 입력값 검증을 `alert`에서 inline error로 바꾸고 `label`, `name`, `autocomplete`, `aria-live`를 추가해 입력 경험을 정리했다.
- 상단 홈 로고는 `next/image` + `priority`로 바꿔 렌더 안정성을 높였다.

## 변경 파일
- `package.json`
- `package-lock.json`
- `src/app/(tabs)/layout.tsx`
- `src/app/(tabs)/paste/page.tsx`
- `src/app/(tabs)/@overlay/default.tsx`
- `src/app/(tabs)/@overlay/(.)paste/page.tsx`
- `src/components/auth/URLInputForm.tsx`
- `src/components/ui/drawer.tsx`
- `plans/20260405_paste_route_backed_drawer.md`

## 검증
- `npx eslint src/app/(tabs)/layout.tsx src/app/(tabs)/paste/page.tsx src/app/(tabs)/@overlay/default.tsx src/app/(tabs)/@overlay/(.)paste/page.tsx src/components/auth/URLInputForm.tsx src/components/ui/drawer.tsx`
  - 통과
- `npm run dev`
  - 로컬 서버 정상 기동 확인
- headless 브라우저 검증
  - 테스트 계정 로그인 후 `/home`에서 `Paste` 탭 클릭 시 drawer 오픈 확인
  - drawer 오픈 상태에서 홈 화면 컨텍스트 유지 확인
  - drawer close 후 `/home` 복귀 확인
  - `http://localhost:3000/paste` 직접 진입 시 full page 렌더 확인
  - 확인 결과:
    - `drawerVisible: true`
    - `pageStillVisible: true`
    - `directCloseCount: 0`
    - `directHeading: true`

## 메모
- 로컬 브라우저 자동화는 프로젝트 의존성에 Playwright가 없어서, npx 캐시된 Playwright 경로를 `NODE_PATH`로 지정해 headless 검증했다.
- 검증 중 생성된 임시 QA 파일/결과 디렉토리는 정리했다.
