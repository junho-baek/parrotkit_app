# 2026-04-08 Shooting cue 숨김 패널 전환

## 요약
- Shooting 화면의 하단 색상 팔레트 옆에 eye-off 플로팅 버튼을 추가했다.
- 버튼을 누르면 visible / hidden 상태와 무관하게 모든 cue가 패널에 나타나고, 탭으로 즉시 active / inactive 전환할 수 있게 했다.
- 드래그 중 나타나는 숨김 대상 표시도 trash can 대신 eye-off 아이콘으로 맞췄다.

## 변경 파일
- src/components/common/CameraShooting.tsx
- plans/20260408_shooting_hide_panel_for_cues.md

## 상세
### 1. visibility panel 추가
- `visibilityPanelOpen` 상태를 추가해 하단 플로팅 패널을 열고 닫을 수 있게 했다.
- focused cue가 있으면 기존 색상 팔레트와 같이 노출되고, focus가 없어도 eye-off 버튼은 계속 보여서 숨겨진 cue를 다시 켤 수 있다.
- 패널은 모든 `prompterBlocks`를 보여주며, 각 cue는 현재 visible 상태에 따라 밝기와 표면 스타일이 달라진다.

### 2. active / inactive 토글
- `toggleBlockVisibility`를 추가해 cue를 즉시 visible true/false로 전환한다.
- hidden cue를 다시 켜면 해당 cue를 focused 상태로 바꿔 바로 색상 편집까지 이어질 수 있게 했다.
- 현재 focused cue를 숨기면 다음 visible cue로 포커스를 넘기거나, 없으면 focus를 해제한다.

### 3. hide affordance 정리
- 드래그 중 하단 중앙에 나타나는 hide target도 trash can 대신 eye-off icon으로 맞췄다.
- 삭제가 아니라 “잠깐 안 보기”라는 의미가 더 잘 전달되도록 hover 색도 amber 톤으로 정리했다.

## 검증
- 사용자 요청에 따라 별도 build/test는 수행하지 않았다.
