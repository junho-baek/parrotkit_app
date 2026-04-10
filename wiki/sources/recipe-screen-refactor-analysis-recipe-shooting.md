# 레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting

## Summary

2026-04-06 context는 ParrotKit의 recipe 화면을 제품 전략에 맞게 재구성한 핵심 전환점이다. 데이터 구조는 `scene.analysis`, `scene.recipe`, `scene.prompter` nested shape로 정리됐고, UI는 `Analysis / Recipe / Prompter` 3탭 구조로 다시 설계됐다.

## Key Points

- scene 계약이 nested 구조로 재정의됐고, legacy `description`, `script`, `transcriptSnippet`는 읽기 호환 fallback으로 남겼다.
- `brandBrief` top-level 구조와 PDF 추출 유틸이 추가돼 analyze/chat/recipes API가 같은 계약을 읽고 저장하게 맞춰졌다.
- `RecipeResult`는 scene 업데이트를 nested 구조와 legacy fallback을 함께 저장하는 방식으로 흡수했다.
- `Prompter` 탭은 웹 카메라 위에 block overlay를 띄우고 visible/size/preset 조정이 가능하도록 구현됐다.
- 로컬 QA, 타입체크, eslint, Playwright smoke까지 비교적 넓게 검증이 수행된 드문 context다.

## Entities

- [ParrotKit](../entities/parrotkit.md)
- [RecipeResult](../entities/recipe-result.md)
- [CameraShooting](../entities/camera-shooting.md)

## Concepts

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)
- [브랜드 컨텍스트 정규화 | Brand Context Normalization](../concepts/brand-context-normalization.md)
- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](../concepts/prompter-persistence-and-inline-editing.md)

## Contradictions

- 이후 2026-04-08 문맥에서는 `Prompter` 탭이 `Shooting`으로 리네이밍되며 용어가 조정된다.
- analysis 영역에서 transcript와 reference signals를 본문에 둘지 drawer로 밀어넣을지는 이 시점 이후 계속 재조정된다.

## Open Questions

- 실제 외부 URL + 실제 PDF 조합의 analyze end-to-end는 이 시점 context 기준 아직 충분히 검증되지 않았다.
- prompter block drag의 정밀한 상호작용은 이후 문서에서 더 다뤄진다.

## Source Details

- Source file: `context/context_20260406_224900_recipe_screen_refactor_analysis_recipe_prompter.md`
- Date: 2026-04-06
