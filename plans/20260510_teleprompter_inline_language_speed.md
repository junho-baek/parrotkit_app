# Teleprompter Inline Edit, Language, Speed Plan

## 배경
- 이전 촬영 UI 패스에서 대본 수정이 modal로 열려 촬영 흐름을 끊는 문제가 남았다.
- 사용자는 촬영 UI 안에서 바로 수정하는 방식, pinch 크기 조절의 명확한 동작, 영어/한국어 버전 분리, 그리고 속도 조절을 하단 palette 탭으로 이동하는 방식을 요청했다.

## 목표
- 대본 더블탭 시 현재 script panel 안에서 직접 편집하게 바꾼다.
- 촬영 화면에서 EN/KO 언어 탭을 명확히 제공하고, 현재/다음 컷 대본과 UI copy를 언어별로 분리한다.
- pinch resize 초기화/이동 로직을 보강해 두 손가락 제스처가 중간 진입해도 크기 변경이 반영되게 한다.
- 하단 palette에 속도 아이콘 탭을 `투명도`와 `색상` 사이에 추가하고, 탭하면 속도 선택 sheet를 띄운다.

## 범위
- In scope:
  - `RecipePrompterCameraScreen` inline edit state/UI
  - language state and localized prompter script helpers
  - speed sheet state/UI
  - pinch responder stability improvement
  - context update
- Out of scope:
  - 실제 번역 API
  - persistent language-specific scene storage
  - advanced gesture animation library 도입

## 변경 파일
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- Add/Modify: `context/context_20260510_teleprompter_inline_language_speed.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `git diff --check`
- iOS Simulator에서:
  - EN/KO toggle copy 전환 확인
  - 더블탭 inline edit 상태 확인
  - 속도 palette sheet 확인
  - main shooting layout regression 확인

## 롤백
- inline edit/speed sheet 변경 전 커밋으로 되돌리거나, script panel을 이전 modal edit 구조로 복원한다.

## 리스크
- KO copy는 현재 mock recipe에 별도 ko 필드가 없으므로 템플릿/일반 recipe 패턴 기반 local fallback을 사용한다.
- Pinch 검증은 simulator 자동화에서 제한적이라 code-level 강화와 manual simulator layout 확인을 병행한다.

## 결과
- 촬영 UI의 EN/KO 토글을 제거하고 앱 설정 언어를 따르게 변경했다.
- 대본 수정은 modal 대신 prompter panel 내부 inline edit로 처리한다.
- 속도는 하단 palette의 `투명도`와 `색상` 사이에 있는 `속도` action에서 sheet로 열리게 변경했다.
- prompter hide/show action을 추가해 대본 패널을 완전히 숨길 수 있게 했다.
- script panel one-finger drag 위치 이동과 two-finger pinch 글자 크기 조절을 보강했다.
- 녹화 중 script scroll이 고정 42px 이동이 아니라 대본 길이/줄높이/속도 기반 거리와 시간으로 위로 이동하도록 변경했다.
- 검증 기록: `context/context_20260510_teleprompter_inline_language_speed.md`
