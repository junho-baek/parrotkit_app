# Camera Shooting 자동 녹화/녹음 진입 이슈 수정

## 배경
- Shooting 화면 진입 시 마이크까지 즉시 활성화되어 사용자가 "계속 녹화/녹음 모드"로 체감하는 문제가 있었다.
- 실제 의도는 화면 진입 시 프리뷰만 켜고, `Shoot` 버튼 클릭 시에만 녹화를 시작하는 것이다.

## 목표
- Shooting 진입 시에는 카메라 프리뷰(영상)만 활성화한다.
- 녹화 버튼 클릭 시에만 오디오 트랙을 포함한 녹화를 시작한다.
- 화면 이탈/언마운트 시 진행 중 녹화가 안전하게 정리되고 불필요한 캡처가 발생하지 않도록 한다.

## 범위
- `CameraShooting` 스트림 초기화/정리 로직 수정
- 녹화 시작 시점 오디오 트랙 결합 로직 추가
- 언마운트 시 캡처 스킵 처리
- 빌드 검증

## 변경 파일
- `src/components/common/CameraShooting.tsx`
- `context/context_20260315_*.md`

## 테스트
- `npm run build`

## 롤백
- `CameraShooting`을 기존 단일 스트림(`audio: true`) 방식으로 되돌린다.
- `skipCaptureRef`/preview-recording stream 분리 로직 제거.

## 리스크
- 마이크 권한 거부 시 영상만 녹화되므로 사용자가 음성 누락을 인지하지 못할 수 있다.
- 브라우저별 `MediaRecorder`/track clone 동작 차이로 엣지 케이스가 발생할 수 있다.

## 결과
- 완료
- Shooting 진입 시 mic 상시 활성화 제거
- Shoot 클릭 시에만 녹화/녹음 시작
- 검증: `npm run build` 통과
- 연결 context: `context/context_20260315_041829_camera_shooting_recording_guard.md`
