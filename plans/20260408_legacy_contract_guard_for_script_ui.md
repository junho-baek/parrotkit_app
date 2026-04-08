# Script UI 레거시 계약 가드 계획

## 배경
최근 `Analysis` / `Recipe` 탭에서 script drawer 중심으로 UI를 정리했지만, analyze 프롬프트와 normalize/json 계약에는 여전히 `reference_signals` 및 legacy fallback이 남아 있어 추후 refactor 때 중복 UI가 다시 살아날 수 있습니다.

## 목표
prompt / json / ui 전반에서 “새 표준 계약”과 “읽기 전용 레거시 호환”의 경계를 분명히 해, transcript/reference 정보가 다시 인라인 주역으로 복귀하지 않도록 가드합니다.

## 범위
- `analyze` 프롬프트에서 `reference_signals`를 정식 출력 계약에서 제외
- normalize 단계에서 `referenceSignals`는 legacy read-only로만 유지하고 자동 fallback 생성은 중단
- drawer에서 쓰는 original script line helper를 공용화
- 타입에 legacy compatibility 용도 주석 추가

## 변경 파일
- `plans/20260408_legacy_contract_guard_for_script_ui.md`
- `src/types/recipe.ts`
- `src/lib/recipe-scene.ts`
- `src/app/api/analyze/route.ts`
- `src/components/common/RecipeResult.tsx`
- `context/context_20260408_legacy_contract_guard_for_script_ui.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- analyze prompt의 `reference_signals` 요구 복원
- normalize 단계의 `referenceSignals` fallback 생성 복원
- `RecipeResult`의 local transcript helper 복원

## 리스크
- 기존에 `reference_signals`를 풍부하게 생성하던 recipe는 새 generation부터 해당 필드가 비어 있을 수 있습니다.

## 결과
- `reference_signals`를 analyze 생성 계약에서 제외하고 legacy read-only 필드로 격하했습니다.
- drawer용 original script line helper를 공용화했고, 연결 context는 `context/context_20260408_legacy_contract_guard_for_script_ui.md`에 기록했습니다.
