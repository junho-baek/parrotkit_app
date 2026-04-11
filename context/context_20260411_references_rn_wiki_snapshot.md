# Context - References RN Wiki Snapshot

## 작업 요약
- 루트 작업트리의 미추적 `references/` 디렉토리를 확인했고, React Native 학습 위키 스냅샷이라는 점을 검증했다.
- 스냅샷은 총 104개 Markdown 중심 파일, 약 860KB 규모로 구성되어 있으며 `README`, `index`, `overview`, `log`와 다수의 `analyses`, `concepts`, `sources` 문서를 포함한다.
- 핵심 주제는 React Native 학습 워크플로우, 스토리지 선택 기준, animation/gesture, Expo/Router, local persistence, auth/query/chart 패턴 정리다.
- 참조용 스냅샷 특성상 일부 문서는 개인 로컬 경로(`/Users/junho/...`)를 유지하지만, 코드 실행 자산이나 대용량 바이너리는 포함하지 않는다.

## 변경 파일
- `plans/20260411_references_rn_wiki_snapshot.md`
- `context/context_20260411_references_rn_wiki_snapshot.md`
- `references/README.md`
- `references/rn-wiki/**`

## 검증
- `rg --files references`
  - 결과: `references/` 아래 파일 104개 확인
- `du -sh references`
  - 결과: 약 `860K`
- `sed -n '1,220p' references/README.md`
  - 결과: 참조용 스냅샷 목적과 포함 범위를 명시한 README 확인
- `sed -n '1,240p' references/rn-wiki/README.md`
  - 결과: 원본 경로, 포함/제외 범위, portability note 확인
- `sed -n '1,220p' references/rn-wiki/overview.md`
  - 결과: RN 학습 위키의 방향, 범위, active source, 열린 질문 확인
- `sed -n '1,220p' references/rn-wiki/index.md`
  - 결과: concepts / sources / analyses 중심 목차 확인
- `git rev-list --left-right --count HEAD...origin/dev`
  - 결과: `0  0`으로 로컬과 `origin/dev` 동기화 상태 확인

## 남은 리스크
- 스냅샷 문서의 일부 링크는 현재 저장소 바깥 경로나 개인 스킬 저장소를 가리켜 여기서 그대로 열리지 않을 수 있다.
- 위키 스냅샷은 이후 원본 학습 워크스페이스와 수동으로만 동기화되므로, 장기적으로 갱신 타이밍을 관리해야 한다.

## 메모
- 이번 작업은 제품 코드 변경 없이 참조 문서와 추적용 plan/context를 저장소에 반영하는 목적이다.
