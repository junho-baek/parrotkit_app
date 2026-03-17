# AGENTS QA / Notion Policy Update

## 배경
- 사용자 요청으로 기본 검증 흐름을 `build`가 아니라 `dev` 기반 QA로 바꾸고자 한다.
- 또한 Notion 업로드는 자동 기본값이 아니라 사용자가 명시적으로 요청했을 때만 수행하도록 규칙을 조정할 필요가 있다.

## 목표
- `AGENTS.md`에 로컬 QA 기본값을 `dev` 기준으로 명시한다.
- `npm run build`는 사용자 요청 시에만 수행하도록 규칙을 바꾼다.
- Notion 업로드는 사용자 요청 시에만 수행하도록 규칙을 바꾼다.

## 범위
- `AGENTS.md` 정책 문구 수정
- plan/context 기록

## 변경 파일
- `AGENTS.md`
- `plans/20260318_agents_qa_notion_policy.md`
- `context/context_20260318_*_agents_qa_notion_policy.md`

## 테스트
- 문서 규칙 변경 작업이므로 별도 build/test 미실행

## 롤백
- `AGENTS.md`의 QA / Notion 관련 문구를 이전 기본 정책으로 복원

## 리스크
- 기존 자동화 전제를 따르던 작업 흐름과 달라질 수 있으므로 문구를 명확히 남겨야 한다.

## 결과
- 완료
- `AGENTS.md`의 기본 QA 흐름을 `dev` 기준으로 변경
- `npm run build`는 사용자 명시 요청 시에만 수행하도록 규칙 수정
- Notion 업로드는 사용자 명시 요청 시에만 수행하도록 규칙 수정
- 별도 build / Notion 업로드는 실행하지 않음
- 연결 context: `context/context_20260318_034459_agents_qa_notion_policy.md`
