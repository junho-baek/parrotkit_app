# 2026년 5월 네이티브 앱 시드/플랜/컨텍스트 묶음 | May 2026 Native App Seeds, Plans, And Context

## Summary

2026년 5월 중순 자료는 ParrotKit이 웹 parity를 넘어서 네이티브 앱 자체의 촬영 보드 제품으로 수렴한 기록이다. 원본 자료는 `context/`, `plans/`, `docs/superpowers/plans/`, `parrotkit-app/context/`, `parrotkit-app/plans/`, `parrotkit-app/docs/superpowers/plans/`, `parrotkit-app/seeds/`에 흩어져 있지만, 핵심 흐름은 네 가지다.

첫째, 4월 말 superpower 계획들은 웹의 `Analysis -> Recipe -> Shooting` 모델을 네이티브 앱으로 이식했다. 둘째, 5월 초 context들은 Home, Explore, Recipes, recipe create drawer, Shoot Board를 앱 중심으로 재배치했다. 셋째, 5월 14-16일 seed와 GitHub issue burn-down은 v1 navigation, Home Continue, Paste CTA, My Take 기반 completion을 좁은 acceptance criteria로 정리했다. 넷째, 5월 17일에는 Sandcastle식 분석을 보존하는 `Recipe Analysis Contract`와, 이를 UI에 흘려보내지 않기 위한 `Board / Breakdown` 경계 및 active shooting session board가 잡혔다.

## Key Points

- `docs/superpowers/plans/2026-04-26-parrotkit-app-web-recipe-parity.md`는 웹 `RecipeScene` 계약을 네이티브 앱의 scene-first recipe detail, cue selection, camera prompter로 옮기는 계획이었다.
- `docs/superpowers/plans/2026-04-26-parrotkit-native-prompter-web-parity.md`는 native camera prompter를 display-only에서 movable/editable/record/review/use-take 흐름으로 확장하는 계획이었다.
- `docs/superpowers/plans/2026-04-28-shoot-first-recipe-ownership.md`와 `context/context_20260428_shoot_first_recipe_ownership.md`는 Home/Explore/Recipes를 owned/downloaded/remixed recipe loop로 바꿨다.
- `context/context_20260503_native_shoot_board.md` 이후 `/recipe/:id`는 설명형 detail page가 아니라 촬영 실행용 Shoot Board로 읽어야 한다.
- 5월 14-15일 seed들은 Home Continue가 "마지막 미완료 recipe shooting board"를 여는 규칙을 고정했다. 완료 판정은 checklist가 아니라 required cut별 saved My Take가 주된 진실값이다.
- 5월 16일 navigation seed는 처음에 Home/Explore/My 3탭을 목표로 했다가, 사용자가 원래 ParrotKit 하단 내비게이션에는 중심 `Paste` CTA가 있었다고 정정하면서 Home/Explore/Paste/Recipes/My 5-slot 구조로 supersede됐다.
- 5월 16일 GitHub issue burn-down 계획은 Source route 제거, Paste drawer 복구, Explore card CTA 단순화, passive next-cut guidance, shooting board layout 정리를 한 묶음으로 다뤘다.
- 5월 17일 `Recipe Analysis Contract` seed는 Sandcastle 수준의 분석 taxonomy를 저장하되 shooting board에는 execution-first projection만 노출하는 결정을 남겼다.
- 5월 17일 `Board / Breakdown` 구현은 Supadata/Gemini ingestion보다 UI projection boundary를 먼저 안정화했다.

## Human Feedback Signals

- 사용자는 기존 recipe detail/execution 화면이 "AI가 정리한 문서"처럼 느껴진다고 피드백했고, 이 피드백은 `native_recipe_execution_cockpit`과 이후 `native_shoot_board`로 이어졌다.
- 사용자는 recipe create drawer에서 불필요한 설명, 중첩 박스, 어색한 niche 사진을 줄이되 goal card 사진은 유지하길 원했다.
- 5월 14일 navigation follow-up seed들은 사용자가 primary creation CTA를 `Shoot`, `New Shoot`, `Start Shoot`가 아니라 `레시피 생성`으로 유지하라고 정정한 결과다.
- 5월 15일 next-cut seed는 사용자가 다음 컷을 auto-open/focus하는 흐름이 불편하다고 정정하면서 passive guidance-only 원칙으로 바뀌었다.
- 5월 16일 issue #6 seed는 사용자가 3탭이 아니라 중심 `Paste` CTA가 있는 5-slot navigation이 원래 제품형이라고 정정하면서 supersede됐다.
- 5월 16일 QA screenshot 피드백은 Explore detail의 meta/chip/boxed note, Home My recipes의 progress/metadata/중복 CTA, shooting board의 낮은 reference placement와 과한 handle/copy를 걷어내는 계기가 됐다.
- 5월 17일 사용자는 Sandcastle AI 스크린샷 9장을 제공하며 ParrotKit이 배워야 할 durable recipe guidance를 보존하길 요청했다. 결정은 즉시 `A: Recipe Analysis Contract`, 미래 방향 `D: Reference Intelligence Layer`였다.
- 5월 17일 사용자는 shooting board에서 reference video와 My Take UI가 어디 갔는지 지적했고, 이로 인해 collapsed row의 reference anchor가 9:16 preview로 복구됐다.
- 같은 날 사용자는 현재 shooting board가 nested card와 구현 구조가 너무 보인다고 판단했고, short-form filming session/workout-session reference를 기준으로 dark session top bar, `Done`, 9:16 media, note row entry 모델이 codified됐다.

## Implementation Status

- 웹 parity: native recipe domain, normalizer, scene-first detail, cue block selection, native prompter route가 4월 26-27일 구현됐다.
- 네이티브 prompter: cue 이동, 편집, scale, add/hide, 색상, record/review/use-take, local take project 흐름이 4월 26-29일 확장됐다.
- 앱 IA: 5월 초에는 Home/Explore/Recipes, recipe create drawer, generated/local assets, link generation timeout fallback, Recipe Asset save/publish mock flow가 빠르게 쌓였다.
- Shoot Board: 5월 3일부터 recipe detail 기본 화면은 촬영 보드로 이동했고, 5월 6-17일 동안 reference/take viewer, reorder, Board/Breakdown, active session header, label cleanup으로 계속 단순화됐다.
- Navigation/Paste: 5월 16일 기준 Source route 모델은 제거 또는 compatibility 처리되고, Paste는 중심 action으로 drawer를 여는 구조가 현재 방향이다.
- QA: Android fresh evidence는 여러 차례 확보됐지만, iPhone fresh capture는 CoreSimulator/Xcode wrapper timeout 또는 native dev-client linker 문제로 반복적으로 막혔다. 일부 pass에서는 Expo Go 또는 같은 날 existing iPhone evidence가 사용됐다.

## Contradictions

- 4월 28일에는 첫 탭을 `Shoot`로 바꾸는 shoot-first ownership 방향이 있었지만, 5월 14일 이후 v1 seed에서는 primary creation CTA를 `레시피 생성`으로 유지하라는 correction이 강하게 들어왔다.
- 5월 16일에는 3탭 Home/Explore/My seed가 먼저 만들어졌지만, 바로 다음 seed가 이를 supersede해 Home/Explore/Paste/Recipes/My 5-slot nav를 목표로 삼았다.
- `Recipe detail`은 한때 marketplace detail/description page로 확장됐다가, 이후 `/recipe/:id` 기본 진실값은 촬영 실행 보드 쪽으로 재정렬됐다.
- analysis taxonomy는 매우 풍부해졌지만, shooting board는 그 taxonomy를 그대로 보여주지 않는 방향으로 더 강하게 제한됐다.

## Open Questions

- `Recipe Analysis Contract`를 실제 Supabase schema/API/prompt output으로 언제 고정할지 아직 열려 있다.
- Reference Intelligence Layer, idea/hook/channel vault, multi-video ingestion은 명시적으로 future-facing으로 남아 있다.
- iPhone fresh QA가 계속 막히는 원인을 Xcode/CoreSimulator runtime mismatch로 볼지, dev-client native linker 문제까지 포함한 별도 platform reliability 과제로 볼지 분리해야 한다.
- root `context/`와 nested `parrotkit-app/context/`의 ownership 규칙이 명문화돼 있지 않아, 앞으로도 app 작업 문맥이 어디에 쌓일지 혼재될 수 있다.

## Source Details

- App parity and shooting plans:
  - `docs/superpowers/plans/2026-04-26-parrotkit-app-web-recipe-parity.md`
  - `docs/superpowers/plans/2026-04-26-parrotkit-native-prompter-web-parity.md`
  - `docs/superpowers/plans/2026-04-27-parrotkit-native-recipe-detail-web-parity.md`
  - `docs/superpowers/plans/2026-04-28-shoot-first-recipe-ownership.md`
  - `docs/superpowers/plans/2026-04-29-local-take-projects.md`
- App implementation contexts:
  - `context/context_20260426_parrotkit_app_web_recipe_parity.md`
  - `context/context_20260426_parrotkit_native_prompter_web_parity.md`
  - `context/context_20260427_native_recipe_detail_web_parity.md`
  - `context/context_20260428_shoot_first_recipe_ownership.md`
  - `context/context_20260429_local_take_projects.md`
  - `context/context_20260503_native_shoot_board.md`
  - `context/context_20260510_recipe_create_drawer_tabs.md`
  - `context/context_20260510_recipe_create_blank_no_scenes.md`
  - `context/context_20260510_mobile_reference_generation_timeout.md`
- Seeds and issue plans:
  - `parrotkit-app/context/parrotkit_home_continue_mytake_seed_20260514.yaml`
  - `parrotkit-app/context/seed_next_cut_highlight_20260515.yaml`
  - `parrotkit-app/context/seed_issue_6_native_nav_home_hierarchy_20260516.yaml`
  - `parrotkit-app/context/seed_issue_6_paste_nav_home_routes_20260516.yaml`
  - `parrotkit-app/docs/superpowers/plans/2026-05-16-github-issue-burn-down.md`
  - `parrotkit-app/docs/superpowers/plans/2026-05-16-issues-7-9-4-ui-burn-down.md`
- May 17 sources:
  - `parrotkit-app/seeds/parrotkit_recipe_analysis_contract_20260517.yaml`
  - `parrotkit-app/context/context_20260517_recipe_analysis_contract_seed.md`
  - `docs/superpowers/plans/2026-05-17-recipe-board-breakdown-ui.md`
  - `parrotkit-app/context/context_20260517_recipe_board_breakdown_ui.md`
  - `parrotkit-app/context/context_20260517_shooting_session_board_design_plan.md`
  - `parrotkit-app/context/context_20260517_shooting_session_board_redesign.md`
  - `parrotkit-app/context/context_20260517_reference_anchor_restore.md`
  - `parrotkit-app/context/context_20260517_cut_row_label_cleanup.md`

## Related Pages

- [레시피 분석 계약 | Recipe Analysis Contract](../concepts/recipe-analysis-contract.md)
- [네이티브 촬영 보드 | Native Shooting Board](../concepts/native-shooting-board.md)
- [2026년 5월 앱 context 맵 | Context Map for May 2026 App Work](../analyses/context-map-may-2026-app.md)
- [ParrotKit App | Parrotkit App](../entities/parrotkit-app.md)
