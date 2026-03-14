# Camera Shooting 스트림 race condition 가드 보강

## 배경
- 이전 수정 후에도 간헐적으로 "계속 녹화되는 것 같다"는 체감 이슈가 남아있었다.
- 원인 후보: 컴포넌트 언마운트 타이밍과 `getUserMedia` 비동기 resolve 타이밍 경합으로 스트림이 늦게 붙는 race condition.

## 목표
- 언마운트된 컴포넌트에는 스트림이 attach되지 않도록 차단.
- 녹화 시작 시점에서도 비동기 완료 후 컴포넌트 생존 여부를 검사해 유령 스트림을 제거.

## 범위
- `CameraShooting`에 mount/unmount 상태 가드 추가
- startCamera/startRecording에서 active 여부 검사
- 빌드 검증

## 변경 파일
- `src/components/common/CameraShooting.tsx`
- `context/context_20260315_*.md`

## 테스트
- `npm run build`

## 롤백
- `isActiveRef` 기반 가드 로직 제거
- startCamera/startRecording의 active 체크 제거

## 리스크
- 장치 권한 승인 응답이 매우 느릴 때 브라우저/OS별 예외 동작 가능성은 남아 있음.

## 결과
- 완료
- 언마운트 후 늦게 resolve된 스트림 자동 stop 처리
- 빌드 검증 통과
- 연결 context: `context/context_20260315_053526_camera_shooting_stream_race_guard.md`
