# 20260427 Native Prompter Drag Smoothness

## 배경
- 실기기 촬영 화면에서 프롬프터 cue를 눌러 이동할 때 손가락을 매끄럽게 따라오지 않는다.
- 현재 native overlay는 `PanResponder` move 이벤트마다 provider recipe 상태를 업데이트해 recipe normalize/render를 반복한다.

## 목표
- 드래그 중에는 overlay가 즉시 손가락을 따라 움직이게 한다.
- 위치와 scale은 gesture 종료 시 한 번만 저장한다.
- 기존 더블탭 편집, 롱프레스 편집, pinch scale, toolbar scale/color/edit/hide 기능은 유지한다.

## 범위
- native shooting prompter overlay gesture 처리만 수정한다.
- recipe detail 구조, camera recording, provider data model은 변경하지 않는다.

## 변경 파일
- `parrotkit-app/src/features/recipes/components/native-prompter-block-overlay.tsx`
- `plans/20260427_native_prompter_drag_smoothness.md`
- 작업 완료 후 `context/context_20260427_native_prompter_drag_smoothness.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- 실행 중인 Expo dev-client Metro에서 iPhone 번들 갱신 확인
- 실기기 shooting 화면에서 cue drag, double-tap edit, pinch/toolbar scale smoke QA

## 롤백
- overlay gesture 변경만 되돌리면 기존 provider 즉시 저장 방식으로 복귀한다.

## 리스크
- RN `Animated` 기반 gesture는 JS thread를 사용하므로 매우 무거운 렌더 상황에서는 완전한 native-thread gesture보다 덜 부드러울 수 있다.
- 하지만 현재 병목인 provider 상태 업데이트를 move 루프에서 제거하므로 체감 지연은 크게 줄어들어야 한다.

## 결과
- `NativePrompterBlockOverlay`의 drag/pinch move 루프에서 provider 업데이트를 제거했다.
- gesture 중에는 `Animated.ValueXY`와 `Animated.Value`로 위치/scale을 즉시 반영하고, release/terminate 시점에만 `x/y/scale`을 저장하도록 변경했다.
- focused border가 1px에서 2px로 바뀌며 눌렀을 때 살짝 튀는 문제를 줄이기 위해 기본 border width를 2px로 고정했다.
- 검증:
  - `cd parrotkit-app && npx tsc --noEmit` 통과.
  - iPhone dev-client를 `192.168.0.104:8081` Metro로 재실행해 새 bundle 수신 확인.
- 연결 context: `context/context_20260427_native_prompter_drag_smoothness.md`
