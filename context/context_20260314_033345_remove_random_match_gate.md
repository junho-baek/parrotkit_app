# Context - Remove Random Match Gate from Shooting

## 배경
- Shooting 완료 후 뜨는 성공/실패 팝업이 실제 분석이 아니라 랜덤 판정(`Math.random`)이었다.
- 사용자 입장에서 동일 촬영 결과가 임의로 실패/성공 처리되는 것처럼 보여 신뢰 저하 요소였다.

## 변경 목표
- 촬영 성공 기준을 랜덤 매칭이 아닌 "저장 성공"으로 단순화.
- 촬영 직후 사용자가 다음 씬으로 바로 진행 가능하도록 플로우 개선.

## 변경 내용
- 파일: `src/components/common/RecipeResult.tsx`
  - 랜덤 매칭 시뮬레이션 블록 제거:
    - `Math.random() > 0.3`
    - `Perfect match` / `Try again` alert
  - `matchResults` 상태/참조 및 관련 업데이트 코드 제거.
  - 촬영 직후 즉시 씬 리스트로 복귀:
    - `setSelectedScene(null)`
    - `setActiveTab('recipe')`
  - 성공 판정 기준:
    - 서버 모드: 업로드 성공 시 `capturedScenes` 확정
    - 로컬 모드: 로컬 저장 즉시 확정

## 현재 사용자 체감 동작
- 촬영 버튼 -> 즉시 리스트 복귀.
- 해당 씬 카드가 `Uploading...` -> `Done` 또는 `Retry Shoot`로 전환.
- 더 이상 랜덤 실패 팝업이 뜨지 않음.

## 검증
- `npm run build` 성공
