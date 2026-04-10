# 분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack

## Summary

ParrotKit의 현재 제품 모델은 하나의 레퍼런스 해석 흐름을 세 레이어로 나누어 다루는 방식이다. `Analysis`는 근거, `Recipe`는 실행 지시, `Shooting`은 실제 촬영 surface다.

## Current Understanding

- 데이터 구조는 `scene.analysis`, `scene.recipe`, `scene.prompter` nested shape로 정리되는 방향이 기준선이다.
- UI 역시 이 구조를 반영한 탭/시트/오버레이로 수렴하고 있다.
- 레시피는 단순 요약 카드가 아니라 creator가 다시 찍을 수 있는 shot list여야 한다.
- shooting surface는 카메라 프리뷰 위에 cue overlay가 얹히는 실행 도구여야 한다.

## Evidence

- [도메인 제품 전략 | Domain AGENTS Product Strategy](../sources/domain-agents-product-strategy.md)
- [레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting](../sources/recipe-screen-refactor-analysis-recipe-shooting.md)
- [4월 8일 레시피/슈팅 UI 반복 정리 | April 8 Recipe/Shooting UI Iteration Bundle](../sources/apr-08-recipe-shooting-ui-iteration-bundle.md)

## Contradictions

- user-facing 용어는 `Prompter`와 `Shooting` 사이에서 이동했다.
- analysis 탭의 evidence를 본문에 둘지, script drawer로 분리할지는 context마다 조금씩 조정됐다.

## Open Questions

- native shooting surface 강화가 product architecture에 어떤 추가 entity/page를 요구할지는 아직 미정이다.
- analysis evidence의 최소 본문 밀도 기준이 더 명확해질 필요가 있다.

## Related Pages

- [브랜드 컨텍스트 정규화 | Brand Context Normalization](brand-context-normalization.md)
- [레시피 상세 UI 단순화 | Recipe Detail UI Simplification](recipe-detail-ui-simplification.md)
- [ParrotKit](../entities/parrotkit.md)
- [RecipeResult](../entities/recipe-result.md)
- [CameraShooting](../entities/camera-shooting.md)
