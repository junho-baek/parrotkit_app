# 프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing

## Summary

최근 context에서 가장 빠르게 진화한 부분은 prompter/shooting cue의 저장과 편집 방식이다. 공통 목표는 "사용자가 촬영 흐름을 끊지 않고 cue를 직접 수정하고, 이 변경이 빠르게 로컬에 반영되며, 서버에도 안정적으로 남는 것"이다.

## Current Understanding

- 로컬 반영은 `sessionStorage` 즉시 동기화가 우선이고, 서버 PATCH만 debounce하는 방식이 현재 기준선이다.
- pending 변경은 unmount나 recipe 전환 시 flush되어야 한다.
- cue는 inline edit, accent color, visible toggle, custom block 추가/제거를 포함하는 조작 단위다.
- built-in cue는 숨김 위주, custom cue는 제거까지 허용하는 등 block 종류별 동작 차이가 존재한다.
- shooting surface에서는 색상 팔레트, 숨김 패널, drag/drop, retake 흐름과 함께 동작한다.

## Evidence

- [원격 동기화와 최신 리뷰 | Sync Remote Review 59da22e](../sources/sync-remote-review-59da22e.md)
- [프롬프터 저장 안정화와 커스텀 큐 | Prompter Persistence And Custom Blocks](../sources/prompter-persistence-custom-blocks.md)
- [4월 8일 레시피/슈팅 UI 반복 정리 | April 8 Recipe/Shooting UI Iteration Bundle](../sources/apr-08-recipe-shooting-ui-iteration-bundle.md)

## Contradictions

- 같은 날 문맥에서도 편집 구현 방식이 `contentEditable` 지향과 `textarea overlay` 지향 사이에서 움직인다.
- cue 제거 의미가 block 종류마다 달라 UX 일관성 측면에서 더 정리할 여지가 있다.

## Open Questions

- 최종 편집 implementation detail은 실제 코드 기준으로 한 번 더 스냅샷을 남기면 좋다.
- 모바일 환경에서 inline edit, drag, 색상 선택, 숨김 패널이 동시에 섞일 때의 사용성 evidence가 더 필요하다.

## Related Pages

- [레시피 상세 UI 단순화 | Recipe Detail UI Simplification](recipe-detail-ui-simplification.md)
- [RecipeResult](../entities/recipe-result.md)
- [CameraShooting](../entities/camera-shooting.md)
