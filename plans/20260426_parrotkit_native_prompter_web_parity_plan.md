# ParrotKit Native Prompter Web Parity Plan

## 배경
- 이전 구현은 웹의 recipe 데이터 구조와 장면 중심 화면까지는 맞췄지만, 실제 웹 shooting surface의 핵심 기능을 구현하지 못했다.
- 사용자가 지적한 누락 기능은 `프롬프터 이동`, `단어 수정`, `크기 조정`, `실제 촬영`이다.
- 웹에서는 `src/components/common/CameraShooting.tsx`에서 이 기능들이 제공된다.

## 목표
- 네이티브 prompter에서 cue block을 움직일 수 있게 한다.
- cue text를 촬영 화면에서 수정할 수 있게 한다.
- cue 크기/scale을 조정할 수 있게 한다.
- custom cue 추가/숨김을 지원한다.
- Expo Camera로 실제 영상 녹화, review, use take 흐름을 구현한다.

## 범위
- 대상 브랜치: `codex/app-recipe-web-parity`
- 대상 파일: `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`, recipe components/lib/provider, `app.json`, package dependency.
- 이번 문서는 구현 전 상세 플랜 작성이다.

## 변경 파일
- `docs/superpowers/plans/2026-04-26-parrotkit-native-prompter-web-parity.md`
- `plans/20260426_parrotkit_native_prompter_web_parity_plan.md`

## 테스트
- 구현 시 `cd parrotkit-app && npx tsc --noEmit`
- Expo dev-client iOS simulator 수동 QA
- 녹화/review/use-take 플로우 확인

## 롤백
- recording 관련 문제가 생기면 recording/review screen commit만 revert한다.
- layout/edit 문제가 생기면 overlay/toolbar commit만 revert한다.

## 리스크
- `expo-video` dependency 추가가 필요하다.
- iOS simulator camera feed는 실제 장치와 다르게 placeholder/dark feed일 수 있다.
- 녹화 권한과 microphone permission은 app config/prebuild 영향이 있으므로 native rebuild가 필요할 수 있다.

## 결과
- native prompter web parity 구현 플랜을 작성했다.
- 연결 플랜: `docs/superpowers/plans/2026-04-26-parrotkit-native-prompter-web-parity.md`
