# Shooting 포커스 컬러 팔레트 계획

## 배경
현재 shooting 화면에서는 cue 색상을 바꾸려면 recipe 탭으로 돌아가야 하거나 사전에 정한 색을 그대로 써야 해서, 촬영 중 미세 조정 흐름이 끊깁니다.

## 목표
shooting 화면에서 특정 prompter cue에 포커스가 가면 하단에 컬러 팔레트를 띄워, 촬영 맥락 안에서 바로 색을 바꿀 수 있게 합니다.

## 범위
- `src/components/common/CameraShooting.tsx`에서 focused/selected cue 상태 추가
- focused cue가 있을 때 하단 컬러 팔레트 표시
- 팔레트 클릭 시 해당 cue의 `accentColor` 즉시 변경

## 변경 파일
- `plans/20260408_shooting_focus_color_palette.md`
- `src/components/common/CameraShooting.tsx`
- `context/context_20260408_shooting_focus_color_palette.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- shooting focus palette UI 제거 및 기존 상태로 복원

## 리스크
- 드래그/리사이즈/편집과 포커스 상태가 겹칠 때 팔레트 노출 타이밍이 약간 더 복잡해질 수 있습니다.

## 결과
- shooting 화면에서 cue를 누르거나 편집 시작하면 하단에 컬러 팔레트가 나타나도록 추가했습니다.
- 팔레트 클릭 시 현재 focused cue의 색이 즉시 바뀌도록 연결했습니다.
- 드래그 중에는 trash UX가 우선이라 컬러 팔레트가 잠시 숨겨지도록 정리했습니다.
