# Context - Shooting 포커스 컬러 팔레트

## 작업 요약
- shooting 화면에서 focused cue가 있을 때만 하단 컬러 팔레트가 나타나도록 추가했습니다.
- 컬러 팔레트에서 선택한 색은 해당 cue의 `accentColor`에 바로 반영됩니다.
- 드래그 중에는 trash zone UI와 겹치지 않도록 팔레트를 숨기게 했습니다.

## 변경 파일
- `src/components/common/CameraShooting.tsx`
- `plans/20260408_shooting_focus_color_palette.md`

## 구현 메모
- focused 상태는 `focusedBlockId`로 관리하고, pointer down 또는 편집 시작 시 해당 block으로 맞췄습니다.
- 팔레트 색은 기존 ParrotKit 계열 `blue/yellow/coral/green/pink` 순서를 그대로 사용했습니다.
- 기본 accent가 없는 block도 type 기준 기본 accent를 계산해 팔레트 선택 상태를 보여줍니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- 포커스 해제 제스처는 아직 별도 추가하지 않아, 다른 cue를 누르기 전까지 팔레트가 유지됩니다.
