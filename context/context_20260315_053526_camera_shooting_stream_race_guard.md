# Context - Camera Shooting 스트림 race guard 보강

## 작업 배경
- 사용자 피드백: 여전히 녹화가 꺼지지 않는 것처럼 보이는 케이스가 존재.
- 분석 결과: `getUserMedia` 비동기 응답이 컴포넌트 언마운트 이후 도착하면 스트림이 늦게 살아나는 race 가능성이 있었다.

## 변경 목표
- 언마운트 이후 resolve된 스트림을 즉시 stop하여 유령 카메라/녹화 상태를 차단.
- 녹화 시작 경로에서도 active 상태를 확인해 불필요한 스트림 생성을 막기.

## 변경 내용
- 파일: `src/components/common/CameraShooting.tsx`
  - `isActiveRef` 추가
    - mount 시 `true`, cleanup 시 `false`
  - `startCamera` 보강
    - stream 획득 후 `!isActiveRef.current || !videoRef.current`면 즉시 track stop 후 반환
  - `startRecording` 보강
    - 시작 전 active 체크
    - 오디오 요청 후 active 체크 재검증
    - 비활성 상태라면 생성한 track 즉시 stop 후 반환

## 검증
- `npm run build` 성공

## 기대 동작
- Shooting 화면을 빠르게 열고 닫아도 카메라/녹화 스트림이 뒤늦게 살아남지 않음.
- 화면 이탈 후에는 녹화/미디어 상태가 안정적으로 정리됨.
