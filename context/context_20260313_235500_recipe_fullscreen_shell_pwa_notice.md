# Context - 레시피 풀스크린 셸 숨김 + 뒤로가기 강화 + PWA 안내 문구 보강

## 작업 일시
- 2026-03-13 Asia/Seoul

## 배경
- 사용자가 레시피 세그먼트 재생/슈팅 시 상단 헤더/하단 탭이 사라지는 몰입형 화면을 요청.
- 레시피/슈팅 양쪽에서 뒤로가기 동선을 더 명확히 보여달라는 요구.
- PWA 안내 시트에 미설치 시 UI 깨짐 가능성 문구를 추가해달라는 요청.

## 수행 내용
1. 레시피 모드에서 앱 셸 숨김 처리
   - 파일: `src/app/(tabs)/layout.tsx`, `src/app/globals.css`, `src/components/auth/DashboardContent.tsx`
   - `layout`의 상단 헤더/하단 탭/콘텐츠 래퍼에 `app-shell-*` 클래스 추가.
   - `Home` 컴포넌트에서 레시피 모드(`view=recipe` 또는 `recipeData` 존재) 진입 시 `body.recipe-fullscreen-mode` 클래스 토글.
   - `globals.css`에 `recipe-fullscreen-mode`일 때 상단/하단 셸 숨김 및 콘텐츠 패딩 제거 스타일 추가.

2. 뒤로가기 동선 강화
   - 파일: `src/components/common/CameraShooting.tsx`
   - 슈팅 화면 좌상단에 `← Back` 버튼 추가(`onBack` 직접 호출).
   - 파일: `src/components/common/RecipeVideoPlayer.tsx`, `src/components/common/RecipeResult.tsx`
   - 세그먼트 플레이어 내부에도 `← Back` 버튼 추가.
   - `RecipeResult`에서 플레이어에 `onBack={handleCameraBack}` 전달.

3. PWA 안내 문구 보강
   - 파일: `src/components/common/PWARegistration.tsx`
   - 설치 시트에 `PWA 미설치 시 일부 기기에서 촬영/레이아웃 UI가 깨질 수 있음` 경고 문구 추가.

## 검증
- 실행: `npm run build`
- 결과: 성공 (Next.js build/TypeScript/static generation 모두 통과)

## 메모
- 이번 작업은 DB 스키마/쿼리/RLS 계약 변경이 없어 `npm run db:schema` 대상이 아님.
- 전역 `body` 클래스는 레시피 모드 이탈/언마운트 시 cleanup 하도록 처리해 다른 화면에 영향이 남지 않도록 구성함.
