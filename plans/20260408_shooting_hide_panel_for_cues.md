# Shooting cue 숨김 패널 전환

## 배경
- Shooting 화면에서 cue를 드래그해 쓰레기통에 숨기는 방식은 빠르지만, 숨긴 cue를 다시 켜는 흐름이 직관적이지 않았다.
- Recipe에서 비활성화된 cue를 Shooting에서 다시 보고 싶거나, Shooting 중 일시적으로 숨겼다가 다시 켜고 싶은 상황이 있다.

## 목표
- Shooting 화면에서 쓰레기통 중심 흐름을 eye-off 기반 숨김/다시보기 패널로 전환한다.
- 숨겨진 cue와 보이는 cue를 같은 플로팅 UI에서 active/inactive 토글할 수 있게 한다.
- 기존 색상 팔레트와 충돌하지 않도록 하단 UI를 간결하게 유지한다.

## 범위
- Shooting cue visibility control UI 개선
- 숨김 cue 재활성화 흐름 추가
- 작업 기록 및 dev 반영

## 변경 파일
- src/components/common/CameraShooting.tsx
- plans/20260408_shooting_hide_panel_for_cues.md
- context/context_20260408_shooting_hide_panel_for_cues.md

## 테스트
- 사용자 요청에 따라 별도 build/test는 수행하지 않음

## 롤백
- Shooting 하단 eye-off 패널 관련 커밋만 되돌리면 기존 쓰레기통 흐름으로 복구 가능

## 리스크
- 기존 드래그-삭제 제스처에 익숙한 사용자는 처음엔 숨김 토글 방식이 더 느리게 느껴질 수 있다.
- 하단 버튼이 늘어나면 shooting 화면 시각 밀도가 약간 올라갈 수 있다.

## 결과
- Shooting 하단 색상 팔레트 옆에 eye-off 버튼을 추가했다.
- eye-off 버튼을 누르면 모든 cue가 패널에 나타나고, 탭으로 visible 상태를 즉시 토글할 수 있게 했다.
- 드래그 중 숨김 대상 UI도 trash 대신 eye-off 아이콘으로 맞췄다.
- context: context/context_20260408_shooting_hide_panel_for_cues.md
