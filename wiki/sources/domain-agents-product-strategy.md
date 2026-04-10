# 도메인 제품 전략 | Domain AGENTS Product Strategy

## Summary

`src/AGENTS.md`와 이를 도입한 2026-04-06 context는 ParrotKit을 "영상 분석 도구"가 아니라 `원본 분석 -> 레시피 -> 촬영 실행`으로 이어지는 하나의 제품으로 정의한다. 이후 recipe/shooting 관련 UI 판단은 이 레이어 구분을 따르는지 여부로 평가하는 것이 기본 기준이다.

## Key Points

- 원본 분석은 "왜 이 레퍼런스가 작동하는가"를 설명하는 근거 레이어다.
- 레시피는 creator가 실제로 다시 찍을 수 있는 실행 지시 레이어다.
- 프롬프터/슈팅은 촬영 중 보는 실행 surface이며, 사용자가 선택한 정보만 큰 타이포와 안전영역 기준으로 봐야 한다.
- 브랜드 PDF/브리프는 reference video와 별개의 입력이며, raw text 재주입보다 구조화된 brief JSON으로 정규화하는 방향이 명시됐다.
- 추후 native camera surface를 강화하더라도 제품은 둘로 나뉘지 않고 같은 product flow 안에 있어야 한다.

## Entities

- [ParrotKit](../entities/parrotkit.md)
- [RecipeResult](../entities/recipe-result.md)
- [CameraShooting](../entities/camera-shooting.md)

## Concepts

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)
- [브랜드 컨텍스트 정규화 | Brand Context Normalization](../concepts/brand-context-normalization.md)

## Contradictions

- 이후 UI context에서는 `Prompter`와 `Shooting` 명칭이 혼용되지만, 이 문서가 강조하는 제품 레이어 자체는 일관되다.

## Open Questions

- structured brief의 안정적인 저장 스키마와 버전 관리 규칙은 아직 위키에 별도 페이지로 분리되지 않았다.
- native shooting surface를 실제로 언제, 어느 범위까지 웹과 분리할지는 이후 evidence가 더 필요하다.

## Source Details

- Source file: `src/AGENTS.md`
- Related context: `context/context_20260406_012220_domain_agents_product_strategy.md`
- Date: 2026-04-06
