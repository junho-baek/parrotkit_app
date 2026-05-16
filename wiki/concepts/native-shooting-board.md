# 네이티브 촬영 보드 | Native Shooting Board

## Summary

네이티브 촬영 보드는 `parrotkit-app`의 `/recipe/:id` 기본 경험이 설명형 recipe detail에서 active short-form filming session으로 이동한 결과다. 2026년 5월 기준 이 보드는 reference를 보고, cut별 line/guide를 확인하고, My Take를 저장하며, 필요한 경우 Breakdown에서 video-level 분석을 확인하는 실행 surface다.

## Current Understanding

- `/recipe/:id`의 기본 역할은 recipe 설명 페이지보다 shooting board다.
- board overview는 camera로 바로 jump하지 않는다. 사용자가 cut 또는 film action을 눌러야 camera/prompter로 진입한다.
- Home Continue는 미완료 board overview를 열고, 다음 required missing cut은 auto-open/focus가 아니라 passive marker로만 안내한다.
- 완료 판정은 required cut별 saved My Take가 주된 신호다. checklist는 supporting progress다.
- reference media는 source anchor이고 My Take는 결과/action state다.
- `Board / Breakdown` switch 이후 Board는 filming actions, Breakdown은 video-level analysis로 나뉜다.
- 2026-05-17 session redesign 이후 board는 dark active-session top bar, body title, note row entry, 9:16 Reference/My Take media, execution-first cut row를 기준으로 한다.

## Timeline

- 2026-04-26: native app이 web recipe parity를 받아 scene-first `Analysis / Recipe / Shoot` 구조를 갖췄다.
- 2026-04-26: native prompter가 movable/editable cue, record/review/use-take 흐름을 갖추기 시작했다.
- 2026-04-29: recorded take는 자동 gallery save가 아니라 local take project에 먼저 저장되는 흐름으로 바뀌었다.
- 2026-05-03: `/recipe/:id` 기본 화면이 detail page에서 Shoot Board로 교체됐다.
- 2026-05-14~15: Home Continue와 completion rule이 required My Take 중심으로 정리됐다.
- 2026-05-16: Explore card, passive next-cut, shooting board layout burn-down이 진행됐다.
- 2026-05-17: `Board / Breakdown` boundary, 9:16 reference anchor 복구, active session board redesign, cut row label cleanup이 이어졌다.

## Design Rules

- board는 page처럼 읽혀야 하며 card pile이나 nested sheet처럼 보여서는 안 된다.
- note/checklist content는 default boxed checklist block이 아니라 note row entry에서 열린다.
- collapsed row는 execution item이어야 한다. `Hook`, `Proof`, `CTA` 같은 고정 role label을 제목으로 반복하지 않는다.
- reference thumbnail은 발견 가능해야 하지만, `Reference` overlay나 time overlay처럼 의미 없는 label은 줄인다.
- next cut highlight는 과한 purple outline보다 조용한 accent와 짧은 label로 충분하다.
- My Take state는 My Take button/count가 소유한다. 별도 bordered state treatment를 중복하지 않는다.

## Human Feedback Incorporated

- 사용자는 recipe execution 화면이 문서처럼 느껴진다고 했고, 이 피드백은 execution cockpit과 Shoot Board로 이어졌다.
- 사용자는 next cut auto-open/focus가 불편하다고 했고, passive guidance rule로 바뀌었다.
- 사용자는 reference video와 My Take UI가 사라진 것처럼 보인다고 지적했고, collapsed row의 reference anchor가 9:16 preview로 복구됐다.
- 사용자는 board가 nested card/implementation structure처럼 보인다고 봤고, active short-form filming session 디자인으로 재정의됐다.

## Verification Pattern

- focused `sucrase-node` source-contract tests가 UI 회귀 방지에 많이 쓰인다.
- `tsc --noEmit`, `npm run check:architecture`, `@google/design.md lint DESIGN.md`, `git diff --check`가 반복 검증 조합이다.
- Android screenshot evidence는 비교적 안정적으로 확보됐다.
- iPhone fresh capture는 `simctl` timeout, Xcode/CoreSimulator mismatch, native dev-client linker 문제로 반복 차단됐다. iOS evidence는 pass마다 fresh/Expo Go/existing evidence 여부를 구분해서 읽어야 한다.

## Contradictions

- 5월 초에는 `Shoot`라는 탭/CTA 언어가 강조됐지만, 5월 14일 이후 v1 product language는 primary creation CTA를 `레시피 생성`으로 유지하라는 방향이 강하다.
- shooting board는 reference를 충분히 보여줘야 하지만, 과한 reference labels나 boxed media blocks는 줄여야 한다. 즉, visibility와 visual noise 사이의 균형이 계속 조정 중이다.

## Open Questions

- 실제 서버 저장이 붙을 때 board note, checklist, My Take, final take, completion marker의 영속화 경계가 필요하다.
- Reference video playback과 thumbnail/frame segmentation이 연결되면 current mock reference anchor가 어떤 media model로 대체될지 정해야 한다.
- `Breakdown`의 video-level analysis를 creator가 언제, 얼마나 자주 열어보는지 실제 사용 evidence가 필요하다.

## Evidence

- [2026년 5월 네이티브 앱 시드/플랜/컨텍스트 묶음 | May 2026 Native App Seeds, Plans, And Context](../sources/may-2026-native-app-seeds-plans-context.md)
- [레시피 분석 계약 | Recipe Analysis Contract](recipe-analysis-contract.md)

## Related Pages

- [모바일 네이티브 셸 | Mobile Native Shell](mobile-native-shell.md)
- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](analysis-recipe-shooting-stack.md)
- [ParrotKit App | Parrotkit App](../entities/parrotkit-app.md)
