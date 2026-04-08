# Context - Prompter 인라인 입력 확장 편집

## 작업 요약
- shooting 프롬프터 편집을 textarea overlay에서 contentEditable 기반 인라인 편집으로 바꿨습니다.
- 편집 중에는 기본적으로 가로로 먼저 늘어나고, 줄바꿈하면 세로가 자연스럽게 늘어나도록 정리했습니다.
- Enter는 기본 줄바꿈으로 두고, blur 또는 Cmd/Ctrl+Enter로 저장되게 맞췄습니다.

## 변경 파일
- `src/components/common/CameraShooting.tsx`
- `plans/20260408_prompter_inline_expand_edit.md`

## 구현 메모
- contentEditable element를 `inline-block` + `w-max` 블록 안에서 렌더링해 입력 길이에 따라 너비가 자연스럽게 커지도록 했습니다.
- 편집 시작 시 caret은 텍스트 끝으로 자동 이동합니다.
- commit 시 값은 contentEditable의 `innerText` 기준으로 읽어 저장합니다.

## 검증
- 별도 실행 검증은 이번 턴에서 수행하지 않았습니다.

## 남은 리스크
- 브라우저별 contentEditable 줄바꿈 처리 차이로 아주 복잡한 붙여넣기 텍스트는 추가 정리가 필요할 수 있습니다.
