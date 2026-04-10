# CameraShooting | CameraShooting

## Summary

`CameraShooting`은 카메라 프리뷰 위에 cue overlay를 띄우고, 위치/크기/가시성/색상/녹화 흐름을 다루는 촬영 실행 surface다.

## Relevant Facts

- block visible/size/preset 조정, drag/drop, color palette, hide panel, retake 흐름 등이 이 컴포넌트에 모인다.
- 같은 날 context들에서 inline edit, trash zone, overflow clipping, focus palette, hidden cue panel, mobile keyboard 안정화 등 세부 UX가 지속적으로 조정됐다.
- custom cue와 built-in cue의 조작 차이가 shooting UX의 중요한 특성이다.

## Timeline

- 2026-04-06: 3탭 refactor에서 camera overlay 기반 `Prompter` surface로 자리잡았다.
- 2026-04-08 09:55: retake 허용과 debounce 저장 관련 리뷰 컨텍스트에 함께 등장했다.
- 2026-04-08 10:19: custom cue 편집/제거와 layout panel 확장이 추가됐다.
- 2026-04-08 하루 동안: 탭 명칭 변경, 색상 팔레트, 숨김 패널, drag shape 고정, overflow clipping, mobile keyboard 안정화가 잇달아 반영됐다.

## Related Concepts

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)
- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](../concepts/prompter-persistence-and-inline-editing.md)
- [레시피 상세 UI 단순화 | Recipe Detail UI Simplification](../concepts/recipe-detail-ui-simplification.md)

## Sources

- [레시피 화면 3레이어 리팩터 | Recipe Screen Refactor: Analysis / Recipe / Shooting](../sources/recipe-screen-refactor-analysis-recipe-shooting.md)
- [원격 동기화와 최신 리뷰 | Sync Remote Review 59da22e](../sources/sync-remote-review-59da22e.md)
- [프롬프터 저장 안정화와 커스텀 큐 | Prompter Persistence And Custom Blocks](../sources/prompter-persistence-custom-blocks.md)
- [4월 8일 레시피/슈팅 UI 반복 정리 | April 8 Recipe/Shooting UI Iteration Bundle](../sources/apr-08-recipe-shooting-ui-iteration-bundle.md)
