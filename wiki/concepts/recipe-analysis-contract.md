# 레시피 분석 계약 | Recipe Analysis Contract

## Summary

`Recipe Analysis Contract`는 reference short-form video에서 배울 만한 전략 정보를 ParrotKit recipe에 오래 남기는 저장 계약이다. 핵심은 Sandcastle식 분석 깊이를 보존하되, 촬영 중인 creator에게는 그 전체 taxonomy를 그대로 노출하지 않는 것이다. 분석은 저장하고, shooting board는 실행에 필요한 projection만 보여준다.

## Current Understanding

- immediate center는 `Recipe Analysis Contract`다.
- future-facing layer는 `Reference Intelligence Layer`다. Ideas, hooks, story formats, visual layouts, channels 같은 vault는 나중 단계다.
- hook은 video-level이거나 opening beat 수준이어야 하며, 모든 cut에 generic `Hook` label을 반복해 붙이지 않는다.
- shooting board projection은 `execution_title`, `line_to_say`, `shot_guide`, `reference_usage`, `my_take_relationship` 정도로 제한된다.
- creator-facing copy는 짧고 구체적인 촬영 지시여야 한다.
- UI는 `DESIGN.md`의 no box-in-box, no analysis-console clutter, labels only when useful 원칙을 따라야 한다.

## Durable Fields

- `reference_summary`: reference video가 무엇을 하고 누구에게 작동하는지 설명한다.
- `topic`, `idea_seed`, `unique_angle`: 영상의 subject와 reusable idea를 분리한다.
- `common_belief_to_challenge`, `contrarian_reality`: 왜 대비나 재프레이밍이 생기는지 보존한다.
- `supporting_evidence`: 제품 claim, demonstration, observation, proof point를 보존한다.
- `hook`: category, formula, spoken hook, why it works, user application을 video-level로 가진다.
- `storytelling_format`: listicle, review, demo, before/after, case study, tutorial 같은 전개 방식을 가진다.
- `visual_layout`: subject/product/caption/framing/movement 구조와 사용자 적용 방법을 가진다.
- `reference_principle`, `your_application`: 가장 중요한 reusable lesson과 현재 creator의 적용법을 분리한다.
- `shooting_board_projection`: 촬영 UI에 내려보낼 제한된 실행 정보다.

## Implementation Notes

- 2026-05-17 Ouroboros CLI auto session은 10 interview rounds까지 갔지만 `interview phase exceeded 120s`로 A-grade seed를 생성하지 못했다.
- 수동 seed는 사용자 결정(`A` primary, `D` future-facing), Sandcastle screenshot 분석, partial Ouroboros interview artifacts, `DESIGN.md`, 기존 recipe/shooting board context를 합쳐 작성됐다.
- 이후 `Board / Breakdown` 구현은 raw video analysis나 Supadata/Gemini ingestion보다 이 contract의 UI projection boundary를 먼저 만들었다.
- `Breakdown`은 video-level analysis를 보여주고, `Board`는 compact filming actions를 유지한다.

## UI Projection Rules

- `Board`: 촬영자가 지금 찍을 action row를 본다.
- `Breakdown`: idea angle, video hook, story format, visual layout, apply-to-your-shoot 같은 video-level insight를 본다.
- collapsed cut row의 primary title은 내부 taxonomy label이 아니라 실행 title이어야 한다.
- Reference media는 배워야 할 source anchor이고, My Take는 사용자의 촬영 결과/action state다.
- `No take yet`, `0 takes`, decorative progress label 같은 상태 copy는 My Take affordance가 이미 의미를 전달하면 제거한다.

## Contradictions

- 분석 depth는 늘어났지만, UI는 오히려 더 적게 보여주는 방향으로 갔다. 따라서 "분석 계약이 생겼다"를 "촬영 보드에 분석 라벨을 많이 보여준다"로 해석하면 안 된다.
- Hook/Proof/CTA 같은 role label은 분석 taxonomy에는 남을 수 있지만, cut row의 user-facing structure에서는 반복 노출을 피해야 한다.

## Open Questions

- 이 contract가 실제 DB schema, prompt schema, API response schema 중 어디서 먼저 source of truth가 될지는 아직 정해지지 않았다.
- Sandcastle-style storage schema/prompt 문서가 `parrotkit-app/docs/reference-analysis/`에 추가됐지만, 아직 위키 source로 별도 ingest되지는 않았다.
- future vaults는 어떤 UI 진입점으로 드러날지 정리되지 않았다.

## Evidence

- [2026년 5월 네이티브 앱 시드/플랜/컨텍스트 묶음 | May 2026 Native App Seeds, Plans, And Context](../sources/may-2026-native-app-seeds-plans-context.md)

## Related Pages

- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](analysis-recipe-shooting-stack.md)
- [네이티브 촬영 보드 | Native Shooting Board](native-shooting-board.md)
- [ParrotKit App | Parrotkit App](../entities/parrotkit-app.md)
