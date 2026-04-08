# Context - Shooting 프롬프터 Overflow 숨김 처리

## 작업 요약
- shooting 프롬프터의 x축 드래그 제한을 기존 safe inset보다 넓혀, 화면 밖으로 넘긴 부분은 그대로 hidden clipping 되도록 바꿨습니다.
- 블록 크기나 모양은 건드리지 않고, container의 `overflow-hidden` 동작만 활용하도록 정리했습니다.

## 변경 파일
- `src/components/common/CameraShooting.tsx`
- `plans/20260408_shooting_overflow_hide_only.md`

## 구현 메모
- x 좌표 clamp를 `0.08~0.92`에서 `0~1`로 완화했습니다.
- y 좌표 제한은 기존 값을 유지해 shooting 화면에서 위/아래로 완전히 사라지는 상황은 최소화했습니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- 아주 넓은 cue를 완전히 가장자리로 보내면 일부 문장이 더 많이 가려질 수 있습니다.
