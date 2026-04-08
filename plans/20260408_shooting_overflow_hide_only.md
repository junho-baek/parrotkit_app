# Shooting 프롬프터 Overflow 숨김 처리 계획

## 배경
현재 shooting 화면의 프롬프터 블록은 드래그 위치를 안전 영역 안으로 강하게 제한하고 있어, 화면 밖으로 자연스럽게 잘리는 대신 시스템이 모양/배치를 만지는 느낌을 줄 수 있습니다.

## 목표
프롬프터 블록이 화면 바깥으로 넘어갈 때는 크기나 모양을 바꾸지 않고, 단순히 overflow hidden으로 잘리도록 정리합니다.

## 범위
- `src/components/common/CameraShooting.tsx`에서 드래그 좌표 clamp를 완화해 블록이 가장자리 바깥으로 일부 나갈 수 있게 조정
- 화면 container의 hidden clipping 동작을 그대로 사용

## 변경 파일
- `plans/20260408_shooting_overflow_hide_only.md`
- `src/components/common/CameraShooting.tsx`
- `context/context_20260408_shooting_overflow_hide_only.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- 드래그 좌표 clamp를 기존 safe inset 기준으로 복원

## 리스크
- 블록을 너무 멀리 가장자리로 보내면 일부가 많이 가려질 수 있습니다.

## 결과
- shooting 프롬프터의 x축 드래그 제한을 완화해, 화면 밖으로 넘어간 영역은 크기/모양 변경 없이 그냥 잘리도록 정리했습니다.
- y축은 기존 shooting 안정성을 유지하도록 기존 제한을 그대로 뒀습니다.
- 연결 context는 `context/context_20260408_shooting_overflow_hide_only.md`에 기록했습니다.
