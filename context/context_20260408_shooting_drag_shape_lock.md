# Context - Shooting 드래그 형태 고정 및 Trash 축소

## 작업 요약
- shooting 프롬프터 block에 `w-max`를 적용해 가장자리로 드래그해도 block 폭이 shrink-to-fit으로 줄어들지 않게 했습니다.
- trash drop UI는 더 작고 덜 튀는 크기로 축소했습니다.

## 변경 파일
- `src/components/common/CameraShooting.tsx`
- `plans/20260408_shooting_drag_shape_lock.md`

## 구현 메모
- absolute positioned block이 `left`만 가진 상태에서 width auto면 사용 가능한 폭 기준 shrink-to-fit이 걸려 모양이 바뀌므로 `w-max`로 고정했습니다.
- `max-w-[82%]`는 그대로 유지해 긴 문장은 기존처럼 적당히 줄바꿈되지만, 드래그 위치 때문에 추가 축소되지는 않습니다.
- trash zone은 더 작은 원형 크기로 줄였습니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- 매우 긴 cue는 여전히 `max-w` 기준으로 줄바꿈되므로, 필요하면 이후 size별 max width를 더 미세 조정할 수 있습니다.
