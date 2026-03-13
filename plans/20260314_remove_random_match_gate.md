# 랜덤 매칭 게이트 제거 (업로드 성공 기준 단일화)

## 배경
- 현재 Shooting 성공/실패 팝업이 실제 포즈 분석이 아니라 랜덤(`Math.random`)으로 동작하고 있음.
- 사용자 입장에서 신뢰성이 떨어지고 재촬영 유도가 혼란을 유발함.

## 목표
- 랜덤 매칭 로직 제거.
- 성공 기준을 업로드(또는 로컬 저장) 성공으로 단일화.
- 촬영 직후 씬 리스트로 복귀하여 업로드 스피너/상태를 확인 가능하도록 개선.

## 범위
- `RecipeResult`의 촬영 후 판정/알림 로직 수정.
- 랜덤 성공/실패 alert 제거.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260314_remove_random_match_gate.md`
- `context/context_20260314_*.md`

## 테스트
- `npm run build`
- 수동 점검:
  - 촬영 후 랜덤 실패 팝업 미노출
  - 촬영 후 즉시 리스트 복귀
  - 업로드 성공 시 Done 반영
  - 업로드 실패 시 Retry Shoot 반영

## 롤백
- `RecipeResult.tsx` 변경 revert 시 기존 랜덤 매칭 플로우 복원 가능.

## 리스크
- 기존 `match_results` 업데이트가 중단되므로 향후 실제 포즈 매칭 기능이 들어오면 별도 통합 필요.

## 결과
- `RecipeResult`에서 랜덤 매칭(`Math.random`) 기반 성공/실패 판정을 제거했다.
- `Perfect match` / `Position doesn't match` alert를 제거했다.
- 촬영 직후 즉시 씬 리스트로 복귀하도록 변경했다. (업로드 상태는 카드의 Uploading/Done/Retry로 확인)
- 성공 기준을 "서버 업로드 성공(또는 로컬 저장 성공)"으로 단일화했다.
- 빌드 검증: `npm run build` 통과.
- 연결 context: `context/context_20260314_033345_remove_random_match_gate.md`
