# Context - Recipe Player UI Cleanup

## 작업 배경
- Recipe 보기 화면에서 Back 버튼이 상단 헤더 + 플레이어 내부로 중복 노출됨.
- 재생 시간/진행 바가 촬영 집중을 방해한다는 피드백.
- Script 바텀시트가 열린 상태에서도 `View Script` 버튼이 남아 겹침.

## 변경 목표
- 상단 헤더의 Back만 유지.
- 플레이어 내부 재생 바 제거.
- Script 모달 오픈 시 `View Script` 버튼 숨김.

## 변경 내용
- 파일: `src/components/common/RecipeVideoPlayer.tsx`
  - 플레이어 내부 Back 버튼 제거.
  - 재생 시간/진행 바 UI 블록 제거.
  - 관련 상태 정리:
    - `progress`, `currentTime`, `formatTime` 제거
  - `View Script` 버튼 렌더링 조건 추가:
    - `!scriptOpen`일 때만 노출

## 검증
- `npm run build` 성공

## 현재 기대 동작
- Recipe 화면 진입 시 Back은 최상단 헤더 1개만 보임.
- 스크립트 바텀시트 오픈 시 `View Script` 버튼은 사라짐.
- 화면이 더 단순해져 촬영 전 준비 UI 집중도가 상승.
