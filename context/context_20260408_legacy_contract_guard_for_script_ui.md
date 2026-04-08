# Context - Legacy Contract Guard For Script UI

## 작업 요약
- 최근 script drawer 중심 UI가 다시 무너지지 않도록, prompt / json / ui 계약에서 레거시 필드의 역할을 분명히 했습니다.
- `reference_signals`는 새 generation 계약에서 제거하고, normalize 단계에서는 “있으면 읽고 없으면 만들지 않는” legacy read-only 필드로 낮췄습니다.
- original transcript drawer는 `getSceneOriginalScriptLines()` 공용 helper로 읽도록 옮겨 UI 레벨 재구현을 줄였습니다.

## 변경 파일
- `src/types/recipe.ts`
- `src/lib/recipe-scene.ts`
- `src/app/api/analyze/route.ts`
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_legacy_contract_guard_for_script_ui.md`

## 구현 메모
- `SceneAnalysis.referenceSignals`에 legacy-only 주석 추가
- `RecipeScene.description/script/transcriptSnippet`에 backward compatibility 주석 추가
- analyze prompt JSON shape에서 `reference_signals` 제거
- analyze prompt requirements에 `reference_signals`는 legacy only이며 무시된다고 명시
- normalizeSceneAnalysis()는 `referenceSignals` fallback 자동 생성 중단
- `RecipeResult`의 local transcript helper 제거 후 `recipe-scene` 공용 helper 사용

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- 기존 저장 데이터에는 여전히 `referenceSignals`가 남아 있을 수 있으므로, 완전 삭제가 아니라 읽기 호환 상태로 유지됩니다.
