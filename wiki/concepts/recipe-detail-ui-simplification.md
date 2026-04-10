# 레시피 상세 UI 단순화 | Recipe Detail UI Simplification

## Summary

2026-04-08의 recipe/shooting 관련 context 다수는 모두 "화면을 덜 설명적이고 더 실행 가능하게 만들기"라는 방향으로 읽힌다. 즉, 과한 헤더/박스/카피를 걷어내고, 필요한 script와 analysis는 drawer나 가벼운 카드로 옮기며, cue 자체를 중심으로 보는 구조로 수렴하는 과정이다.

## Current Understanding

- recipe detail은 2열 피드보다 1열 shot-list 쪽으로 이동했다.
- scene title, cue, script 접근성이 우선되고 부가 카피와 장식적 라벨은 줄어들었다.
- analysis 탭은 `Motion View`와 `Why It Works` 중심으로 정리되고, transcript/reference signals는 drawer 기반 접근으로 옮겨졌다.
- script는 `View Original Script` / `View Your Script` 식의 빠른 플로팅 접근으로 복원됐다.
- 과도한 시안은 사용자 피드백으로 rollback되었다.

## Evidence

- [4월 8일 레시피/슈팅 UI 반복 정리 | April 8 Recipe/Shooting UI Iteration Bundle](../sources/apr-08-recipe-shooting-ui-iteration-bundle.md)
- [레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting](../sources/recipe-screen-refactor-analysis-recipe-shooting.md)

## Contradictions

- simplification의 기준선은 있었지만, 어떤 정보를 본문에 남기고 어떤 정보를 drawer로 내릴지는 같은 날 문서들 사이에서도 진동했다.
- design rollback 때문에 timestamp만 따라가면 "추가된 것"과 "실제로 남은 것"을 혼동할 수 있다.

## Open Questions

- 최종적으로 analysis 탭이 얼마나 "학습용" 정보를 유지해야 하는지 product 기준이 더 필요하다.
- recipe와 shooting의 용어, 컬러 시스템, FAB 노출 기준은 배포 사용자 관찰과 함께 더 고정할 수 있다.

## Related Pages

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](analysis-recipe-shooting-stack.md)
- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](prompter-persistence-and-inline-editing.md)
- [RecipeResult](../entities/recipe-result.md)
- [CameraShooting](../entities/camera-shooting.md)
