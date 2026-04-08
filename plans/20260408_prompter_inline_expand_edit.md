# Prompter 인라인 입력 확장 편집 계획

## 배경
현재 shooting 프롬프터를 더블클릭해 수정할 때 입력 UI가 카드 안에서 고정 박스처럼 동작해, 사용자가 원하는 "가로로 먼저 자연스럽게 늘어나고 줄바꿈 시 세로가 늘어나는" 입력감이 부족합니다.

## 목표
프롬프터 편집 상태에서 입력 내용이 기본적으로 가로로 확장되고, Enter로 줄바꿈하면 세로가 늘어나는 자연스러운 인라인 편집 경험을 제공합니다.

## 범위
- `src/components/common/CameraShooting.tsx`에서 prompter 더블클릭 편집 UI를 contentEditable 기반 인라인 편집으로 전환
- blur / Escape / Enter 줄바꿈 동작을 새 편집 모델에 맞게 정리

## 변경 파일
- `plans/20260408_prompter_inline_expand_edit.md`
- `src/components/common/CameraShooting.tsx`
- `context/context_20260408_prompter_inline_expand_edit.md` (작업 후 기록)

## 테스트
- 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- prompter 편집을 기존 textarea overlay 방식으로 복원

## 리스크
- contentEditable은 브라우저별 줄바꿈 처리 차이가 조금 있을 수 있어, 긴 멀티라인 문장은 실제 장치에서 한 번 더 체감 확인이 필요할 수 있습니다.

## 결과
- prompter 더블클릭 편집을 contentEditable 기반으로 바꿔 입력 시 기본적으로 가로 확장, 줄바꿈 시 세로 확장이 일어나도록 정리했습니다.
- 저장은 blur 또는 Cmd/Ctrl+Enter 기준으로 맞췄습니다.
- 연결 context는 `context/context_20260408_prompter_inline_expand_edit.md`에 기록했습니다.
