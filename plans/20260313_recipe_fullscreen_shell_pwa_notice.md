# 레시피 풀스크린 셸 숨김 + 뒤로가기 강화 + PWA 안내 문구 보강

## 배경
- 모바일에서 레시피 세그먼트 재생/슈팅 중 상단 헤더와 하단 탭이 남아 몰입감이 떨어지고 조작 간섭 가능성이 있음.
- 특히 슈팅 화면에서 즉시 복귀 가능한 뒤로가기 동선이 더 명확해야 함.
- 설치 안내 시트에 PWA 미설치 사용 시 일부 UI 이슈 가능성을 명시해 기대치를 맞출 필요가 있음.

## 목표
- 레시피 플로우(`view=recipe`)에서 앱 셸(상단/하단 바)을 숨겨 완전 몰입형 화면 제공.
- 세그먼트 재생/슈팅 화면에서 뒤로가기 동선을 명확히 제공.
- PWA 안내 시트에 미설치 시 UI 깨짐 가능성을 명시.

## 범위
- 탭 레이아웃 셸 요소에 숨김 제어용 클래스 추가.
- 레시피 모드 진입/종료 시 전역 body 클래스 토글.
- 카메라 슈팅 화면 상단 뒤로가기 버튼 추가.
- 레시피 플레이어 내부 빠른 뒤로가기 버튼 추가.
- PWA 안내 문구 강화.

## 변경 파일
- `src/app/(tabs)/layout.tsx`
- `src/app/globals.css`
- `src/components/auth/DashboardContent.tsx`
- `src/components/common/CameraShooting.tsx`
- `src/components/common/RecipeVideoPlayer.tsx`
- `src/components/common/RecipeResult.tsx`
- `context/context_20260313_*.md` (작업 완료 후 기록)

## 테스트
- `npm run build`
- 수동 검증:
  - `/home?view=recipe` 진입 시 상단/하단 바 숨김 여부
  - Scene 진입 후 Recipe/Shooting 각각에서 뒤로가기 동작
  - PWA 설치 시트 문구 노출 확인

## 롤백
- 위 변경 파일 revert 시 기존 동작으로 즉시 복원 가능.

## 리스크
- `body` 클래스 기반 셸 숨김이 다른 풀스크린 UI와 충돌할 수 있어 클래스명 충돌을 피해야 함.
- 레시피 모드 해제 시 클래스 클린업 누락 시 다른 화면에도 셸이 숨겨질 수 있으므로 cleanup 로직 검증 필요.

## 결과
- 구현 완료:
  - 레시피 모드에서 상단 헤더/하단 탭 숨김(`body.recipe-fullscreen-mode` + `app-shell-*` 클래스)
  - 슈팅 화면(`CameraShooting`) 좌상단 뒤로가기 버튼 추가
  - 세그먼트 플레이어(`RecipeVideoPlayer`) 좌상단 뒤로가기 버튼 추가
  - PWA 설치 시트에 미설치 시 UI 깨짐 가능성 안내 문구 추가
- 검증 결과:
  - `npm run build` 통과
- 연결 context:
  - `context/context_20260313_235500_recipe_fullscreen_shell_pwa_notice.md`
