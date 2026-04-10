# RecipeResult | RecipeResult

## Summary

`RecipeResult`는 ParrotKit에서 recipe 목록과 상세 화면, scene 편집, script drawer, assistant 연동, prompter persistence를 거의 모두 오케스트레이션하는 핵심 UI 컴포넌트다.

## Relevant Facts

- scene nested 구조를 읽고 쓰며, legacy fallback까지 함께 관리한다.
- `Analysis / Recipe / Prompter(Shooting)` 탭 전환과 script sheet/chat sheet 상호 배제를 담당한다.
- scene 추가/이름 변경, cue inline edit, accent color, custom cue 관련 로직이 지속적으로 이 컴포넌트에 축적됐다.
- prompter 변경의 sessionStorage 동기화와 서버 PATCH debounce도 이 컴포넌트 중심으로 조정됐다.

## Timeline

- 2026-04-06: 3탭 구조와 nested scene persistence를 수용하는 핵심 컴포넌트로 재정리됐다.
- 2026-04-08 09:55: debounce 저장 리스크가 리뷰에서 지적됐다.
- 2026-04-08 10:19: pending flush, custom cue 편집, cleanup 보강이 추가됐다.
- 2026-04-08 하루 동안: script drawer 복원, 탭 라벨 조정, 상세 UI 단순화, custom scene 흐름, cue 편집/색상 관련 반복 수정이 이어졌다.

## Related Concepts

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)
- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](../concepts/prompter-persistence-and-inline-editing.md)
- [레시피 상세 UI 단순화 | Recipe Detail UI Simplification](../concepts/recipe-detail-ui-simplification.md)

## Sources

- [레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting](../sources/recipe-screen-refactor-analysis-recipe-shooting.md)
- [원격 동기화와 최신 리뷰 | Sync Remote Review 59da22e](../sources/sync-remote-review-59da22e.md)
- [프롬프터 저장 안정화와 커스텀 큐 | Prompter Persistence And Custom Blocks](../sources/prompter-persistence-custom-blocks.md)
- [4월 8일 레시피/슈팅 UI 반복 정리 | April 8 Recipe/Shooting UI Iteration Bundle](../sources/apr-08-recipe-shooting-ui-iteration-bundle.md)
