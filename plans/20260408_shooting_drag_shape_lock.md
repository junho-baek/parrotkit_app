# Shooting 드래그 형태 고정 및 Trash 축소 계획

## 배경
shooting 화면에서 cue를 가장자리로 끌면 absolute shrink-to-fit 때문에 카드 폭이 줄어들며 모양이 변하고, trash UI도 촬영 조작 대비 너무 크게 보입니다.

## 목표
드래그 중에도 cue 카드 폭/형태가 바뀌지 않게 고정하고, trash UI는 더 작고 덜 거슬리게 줄입니다.

## 범위
- `src/components/common/CameraShooting.tsx`에서 draggable cue block width를 content 기준으로 고정
- `src/components/common/CameraShooting.tsx`에서 trash drop UI를 축소

## 변경 파일
- `plans/20260408_shooting_drag_shape_lock.md`
- `src/components/common/CameraShooting.tsx`
- `context/context_20260408_shooting_drag_shape_lock.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- draggable cue block width를 기존 auto/shrink-to-fit 상태로 복원
- trash UI를 기존 크기로 복원

## 리스크
- 아주 긴 문장은 `max-w-[82%]` 기준으로는 계속 줄바꿈되지만, 드래그 위치 때문에 추가로 더 좁아지지는 않습니다.

## 결과
- shooting cue block에 `w-max`를 적용해 드래그 중 위치와 무관하게 카드 폭/형태가 유지되도록 정리했습니다.
- trash drop UI는 더 작은 원형 버튼 크기로 줄였습니다.
- 연결 context는 `context/context_20260408_shooting_drag_shape_lock.md`에 기록했습니다.
