# Context - Camera Shooting 자동 녹화/녹음 진입 이슈 수정

## 작업 배경
- 사용자 제보: Shooting 화면으로 들어가면 계속 녹화/녹음 모드처럼 동작.
- 원인: `CameraShooting` 진입 시 `getUserMedia({ video, audio: true })`를 즉시 호출하여 마이크가 상시 활성화됨.

## 변경 목표
- 화면 진입 시에는 카메라 프리뷰만 활성화.
- `Shoot` 버튼을 눌렀을 때만 오디오 포함 녹화 시작.
- 언마운트/뒤로가기 시 진행 중 녹화가 남거나 원치 않는 캡처가 저장되지 않도록 정리.

## 변경 내용
- 파일: `src/components/common/CameraShooting.tsx`
  - 스트림 참조 추가:
    - `previewStreamRef` (프리뷰용 비디오 스트림)
    - `recordingStreamRef` (녹화용 스트림)
    - `skipCaptureRef` (언마운트 시 캡처 스킵 플래그)
  - 카메라 시작 로직 변경:
    - 기존: `getUserMedia({ video, audio: true })`
    - 변경: `getUserMedia({ video, audio: false })`
  - 녹화 시작 로직 변경:
    - 프리뷰 비디오 트랙을 `clone()`해 녹화 스트림 구성
    - 녹화 시작 시점에만 마이크 오디오 트랙 요청/결합
    - 오디오 권한 거부 시 비디오만 녹화(경고 로그)
  - 정리 로직 강화:
    - preview/recording 스트림 분리 정리 함수 추가
    - 언마운트 시 `skipCaptureRef=true`로 설정해 불필요한 `onCapture` 방지
    - recorder stop 후 스트림/상태 정리 일원화

## 검증
- `npm run build` 성공

## 기대 동작
- Shooting 탭 진입: 카메라 프리뷰만 활성화(마이크 상시 활성화 제거)
- Shoot 버튼 클릭: 그때부터 녹화(+가능 시 녹음) 시작
- Back/화면 이탈: 녹화 중이어도 안전하게 정리되고 임의 캡처 저장 없음
