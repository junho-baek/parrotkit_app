# 20260411 References RN Wiki Snapshot

## 배경
- 작업트리에서 `references/` 디렉토리가 미추적으로 남아 있었고, 사용자는 내용을 확인한 뒤 `dev`로 푸시해 달라고 요청했다.
- 확인 결과 `references/`는 `/Users/junho/project/RN_practice/wiki`에서 가져온 React Native 학습 위키 스냅샷으로, 제품 소스와 분리된 참조용 문서 묶음이다.
- 저장소 운영 규칙상 작은 문서 추가도 `plans/` 문서를 먼저 남기고, 작업 완료 후 `context/`에 결과를 기록해야 한다.

## 목표
- `references/`에 포함된 RN 위키 스냅샷의 성격과 범위를 확인한다.
- 스냅샷 문서를 저장소에 추적 대상으로 추가하고 `dev`에 반영한다.
- 검증 내용과 리스크를 `context/` 문서로 남긴다.

## 범위
- `references/README.md`
- `references/rn-wiki/**`
- 신규 plan 문서 작성
- 신규 context 문서 작성

## 변경 파일
- `plans/20260411_references_rn_wiki_snapshot.md`
- `context/context_20260411_references_rn_wiki_snapshot.md`
- `references/README.md`
- `references/rn-wiki/**`

## 테스트
- `rg --files references`
- `du -sh references`
- `sed -n '1,220p' references/README.md`
- `sed -n '1,240p' references/rn-wiki/README.md`
- `sed -n '1,220p' references/rn-wiki/overview.md`
- `git rev-list --left-right --count HEAD...origin/dev`
- `git status --short --branch`

## 롤백
- `references/` 디렉토리와 이번 작업으로 추가한 plan/context 문서를 제거하면 작업 전 상태로 되돌릴 수 있다.
- 푸시 이후 롤백이 필요하면 새 커밋으로 `references/`와 관련 문서를 되돌린다.

## 리스크
- 스냅샷 일부 문서는 원본 개인 워크스페이스나 개인 스킬 경로(`/Users/junho/...`)를 그대로 가리킨다.
- 이 문서는 수동 스냅샷이므로 원본 위키와 자동 동기화되지 않는다.
- 제품 코드와 직접 연결된 문서는 아니어서, 시간이 지나면 참조 정보가 stale해질 수 있다.

## 결과
- 완료
- `references/`가 React Native 학습 위키 스냅샷이라는 점과 포함 범위를 확인했다.
- 신규 plan/context 문서를 추가해 스냅샷 반영 근거와 검증 내용을 남겼다.
- 로컬과 `origin/dev`가 `0  0` 상태로 동기화된 것을 확인한 뒤 `dev` 반영 준비를 마쳤다.

## 연결 context
- `context/context_20260411_references_rn_wiki_snapshot.md`
