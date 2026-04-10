# 4월 8일 레시피/슈팅 UI 반복 정리 | April 8 Recipe/Shooting UI Iteration Bundle

## Summary

2026-04-08에는 recipe detail과 shooting surface를 둘러싼 다수의 context가 짧은 간격으로 쌓였다. 공통 방향은 "실행용 화면을 더 단순하게 만들고, cue 편집은 더 직접적으로 만들며, 과한 디자인 요소는 걷어내는 것"이다. 동시에 same-day rollback과 drawer 복원도 있어, 이 묶음은 최종 확정안보다는 수렴 과정을 보여주는 source bundle로 보는 편이 맞다.

## Key Points

- `Prompter` 탭이 `Shooting`으로 이름이 바뀌고, shooting에서는 agent FAB와 과한 가이드 오버레이가 제거됐다.
- double-click 기반 inline cue 편집이 recipe와 shooting 모두의 공통 방향이 됐다.
- analysis/recipe는 light surface, shooting은 darker surface를 유지하는 방향으로 나뉘었다.
- `View Original Script` / `View Your Script` script drawer가 복원됐고, analysis 본문에서는 `Original Transcript`와 `Reference Signals`를 제거해 더 간결하게 만들었다.
- design review에서 과도한 박스/카피가 들어간 시안은 같은 날 rollback됐다.
- custom scene 추가/제목 변경, placeholder 썸네일, cue accent color, 숨김 패널 등 실행 중심의 미세 조정이 이어졌다.

## Entities

- [RecipeResult](../entities/recipe-result.md)
- [CameraShooting](../entities/camera-shooting.md)
- [ParrotKit](../entities/parrotkit.md)

## Concepts

- [레시피 상세 UI 단순화 | Recipe Detail UI Simplification](../concepts/recipe-detail-ui-simplification.md)
- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)
- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](../concepts/prompter-persistence-and-inline-editing.md)

## Contradictions

- 같은 날 문서들 사이에서도 `Prompter`와 `Shooting` 명칭이 섞인다.
- script 관련 정보는 본문 노출과 drawer 복원이 반복돼, 정보 밀도에 대한 팀의 선호가 아직 조정 중이었다.
- 일부 디자인 변경은 곧바로 rollback되어, context timestamp 순서만 읽으면 현재 상태를 오해할 수 있다.

## Open Questions

- analysis evidence를 어디까지 요약하고 어디까지 숨길지에 대한 장기적 IA 기준이 더 필요하다.
- inline edit의 최종 구현이 `contentEditable`인지 `textarea overlay`인지, code-level 최종 상태를 따로 확인해 둘 가치가 있다.
- cue 색상/숨김 패널/커스텀 큐 조합이 모바일 배포 환경에서 얼마나 잘 작동하는지 별도 QA 문서 연결이 필요하다.

## Source Details

- Source files:
  - `context/context_20260408_shooting_ui_cleanup_and_true_inline_edit.md`
  - `context/context_20260408_tab_script_overlay_restore.md`
  - `context/context_20260408_remove_analysis_transcript_reference_signals.md`
  - `context/context_20260408_recipe_light_mode_cue_controls.md`
  - `context/context_20260408_rollback_recipe_detail_design.md`
  - `context/context_20260408_recipe_scene_add_and_rename.md`
  - `context/context_20260408_recipe_prompter_only_cleanup.md`
  - `context/context_20260408_shooting_hide_panel_for_cues.md`
- Date: 2026-04-08
