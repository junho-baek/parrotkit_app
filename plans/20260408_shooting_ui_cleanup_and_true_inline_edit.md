# Shooting UI 정리 및 진짜 인라인 편집 계획

## 배경
현재 `Recipe`/`Prompter` cue의 더블클릭 편집은 입력 상태로 들어갈 때 카드 폭과 높이가 줄어들어 실제 카드 위에서 바로 수정하는 느낌이 약합니다. 또한 shooting 화면에는 `Back`, `Prompter` badge, agent 버튼처럼 촬영 순간에 필요 없는 UI가 남아 있습니다.

## 목표
cue 편집 시 편집 전후 레이아웃이 완전히 동일하게 유지되도록 만들고, shooting 화면에서 촬영에 불필요한 UI를 제거해 더 몰입된 촬영 화면으로 정리합니다.

## 범위
- `src/components/common/RecipeResult.tsx`에서 recipe cue 인라인 편집 시 카드 크기/타이포 레이아웃 유지
- `src/components/common/CameraShooting.tsx`에서 prompter cue 인라인 편집 시 카드 크기/타이포 레이아웃 유지
- `src/components/common/RecipeResult.tsx`에서 `Prompter` 탭 표시명을 `Shooting`으로 변경
- `src/components/common/CameraShooting.tsx`에서 화면 내 `Back` 버튼 제거
- `src/components/common/CameraShooting.tsx`에서 `Prompter` badge 제거
- `src/components/common/RecipeResult.tsx`에서 shooting 탭일 때 agent FAB 제거

## 변경 파일
- `plans/20260408_shooting_ui_cleanup_and_true_inline_edit.md`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `context/context_20260408_shooting_ui_cleanup_and_true_inline_edit.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- cue 편집을 기존 textarea 기반 인라인 상태로 복원
- shooting 화면 보조 UI를 다시 노출

## 리스크
- editing 중 card overlay를 유지하기 위해 absolute editor를 쓰면 긴 텍스트 overflow handling을 세심하게 맞춰야 합니다.

## 결과
- `Recipe`/`Prompter` 모두 편집 진입 시 기존 카드 크기를 유지한 채 같은 자리에서 바로 수정되도록 정리했습니다.
- `Prompter` 탭 표시는 `Shooting`으로 바꿨고, shooting 탭에서는 agent FAB가 뜨지 않게 했습니다.
- shooting 화면 내부의 `Back` 버튼과 `Prompter` badge를 제거해 촬영 UI를 더 단순하게 만들었습니다.
- 연결 context는 `context/context_20260408_shooting_ui_cleanup_and_true_inline_edit.md`에 기록했습니다.
