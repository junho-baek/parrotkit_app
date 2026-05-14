# Teleprompter Shooting UI Plan

## 배경
- 사용자는 ParrotKit 촬영 화면을 카메라 위 텔레프롬프터형 실행 UI로 재구성하는 PRD를 제공했다.
- 기존 촬영 화면은 카메라, coach overlay, take tray, scene switcher가 기능적으로는 있지만 대본 중심/촬영 앱 느낌이 약하다.
- 데모 영상에서는 대본을 읽고 찍는 화면, 다음 컷 연결, 속도/스타일 조절, New clue 추가가 한 화면에서 보여야 한다.

## 목표
- 촬영 화면을 dark translucent camera UI로 바꾼다.
- 현재 컷 대본을 가장 큰 시각 요소로 배치하고, 다음 컷 대본을 흐리게 preview한다.
- 속도, pause/play, 이전/다음 컷, record, New clue, opacity, color, style 조절을 하단 floating controls로 제공한다.
- Drag up teleprompter mode, pinch resize, double-tap edit을 MVP 수준으로 구현한다.

## 범위
- In scope:
  - `RecipePrompterCameraScreen` UI 재구성
  - Prompter overlay state: speed, pause, font size, opacity, color preset, style preset, top mode
  - Double tap edit modal
  - New clue modal and current scene block append
  - Thin top progress indicator
  - 기존 recording/take 저장 흐름 유지
- Out of scope:
  - 음성 인식 adaptive scrolling
  - 실제 timeline 기반 자동 컷 편집
  - 서버 저장/동기화
  - 복잡한 gesture animation library 도입

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- Add/Modify: `context/context_20260510_teleprompter_shooting_ui.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- iOS Simulator에서 촬영 화면 진입 후:
  - 현재/다음 컷 대본 표시 확인
  - speed/pause/prev/next/record controls 확인
  - New clue 추가 확인
  - opacity/color/style 변경 확인
  - title/edit modal 동작 확인

## 롤백
- `recipe-prompter-camera-screen.tsx`를 기존 coach overlay/bottom control 구조로 되돌린다.

## 리스크
- Gesture는 기본 React Native `PanResponder` 기반 MVP라, dedicated gesture library 대비 물리감은 제한적이다.
- New clue는 현재 runtime state에만 추가되며 mock workspace recipe 원본에는 저장되지 않는다.

## 결과
- `RecipePrompterCameraScreen`를 dark camera-based teleprompter UI로 재구성했다.
- 현재 컷 대본, 다음 컷 preview, top scene pill, thin progress indicator를 추가했다.
- 속도, pause/play, 이전/다음 컷, record, New clue, opacity, color, style 하단 dock을 추가했다.
- Drag up/down teleprompter mode, pinch resize, double-tap edit, New clue modal을 MVP 수준으로 구현했다.
- 검증 기록: `context/context_20260510_teleprompter_shooting_ui.md`
