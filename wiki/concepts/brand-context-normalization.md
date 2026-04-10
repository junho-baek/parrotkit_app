# 브랜드 컨텍스트 정규화 | Brand Context Normalization

## Summary

ParrotKit은 레퍼런스 영상과 브랜드 문서를 같은 입력으로 취급하지 않는다. 브랜드 PDF/브리프는 원문을 계속 재주입하는 대신 구조화된 `brandBrief`로 정규화해 recipe 생성의 source of truth로 삼는 방향이다.

## Current Understanding

- reference video URL은 분석 대상이다.
- 기업 PDF, 제품 소개서, 브리프 문서는 브랜드 컨텍스트다.
- 정규화 대상 항목은 브랜드명, 제품명, 캠페인 목적, 타겟, 핵심 소구점, 필수/금지 문구, 촬영/편집 가이드, CTA 등이다.
- analyze/chat/recipes API는 이 structured brief를 읽고 저장하는 동일한 계약을 향해 맞춰지고 있다.

## Evidence

- [도메인 제품 전략 | Domain AGENTS Product Strategy](../sources/domain-agents-product-strategy.md)
- [레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting](../sources/recipe-screen-refactor-analysis-recipe-shooting.md)

## Contradictions

- 별도 명시적 충돌보다는 구현 세부가 더 덜 정리된 상태다. 위키상으로는 방향성은 선명하지만 스키마 진화 히스토리는 아직 얕다.

## Open Questions

- `brandBrief`의 필드 안정성, 버전 업 규칙, DB 저장 위치를 더 깊게 정리할 source ingest가 필요하다.
- 실제 PDF 예시와 실패 케이스를 다루는 별도 QA/analysis 페이지가 아직 없다.

## Related Pages

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](analysis-recipe-shooting-stack.md)
- [ParrotKit](../entities/parrotkit.md)
- [레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting](../sources/recipe-screen-refactor-analysis-recipe-shooting.md)
