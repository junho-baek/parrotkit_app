# Context - Tab Script Overlay Restore

## 작업 요약
- recipe 상세의 `Analysis / Recipe / Prompter` 탭 구조는 유지하면서, `Analysis`와 `Recipe` 탭에 예전 `View Script` 계열 접근을 복원했습니다.
- `Analysis` 탭에서는 `View Original Script`, `Recipe` 탭에서는 `View Your Script` 플로팅 버튼이 보이고, 클릭 시 스크립트 전용 바텀시트가 열리도록 했습니다.
- chat assistant sheet와 script sheet가 겹치지 않도록 script sheet를 열 때 chat을 닫고, chat을 열 때 script sheet를 닫도록 맞췄습니다.

## 변경 파일
- `src/components/common/RecipeResult.tsx`
- `plans/20260408_tab_script_overlay_restore.md`

## 구현 메모
- original script는 `scene.analysis.transcriptOriginal`을 우선 사용하고, 비어 있으면 `transcriptSnippet` fallback을 사용합니다.
- your script는 기존 `getSceneScriptLines(scene)` 결과를 그대로 사용합니다.
- 플로팅 CTA는 `Prompter` 탭에서는 숨기고, `selectedScene` 상세 화면에서만 노출합니다.
- script sheet 본문은 스크립트 라인만 보여주도록 분리했습니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 참고 커밋
- 예전 `View Script` 흐름과 가장 가까운 히스토리로는 `1e24e07 feat: refactor recipe detail into analysis recipe prompter`를 확인했습니다.

## 남은 리스크
- 현재 main content 안의 inline transcript / recommended script 섹션은 유지되어, 사용자에 따라 정보 중복으로 느껴질 수 있습니다.
- 실제 배포 화면에서 버튼 위치와 하단 sheet 높이는 한 번 더 시각 QA가 있으면 더 안전합니다.
