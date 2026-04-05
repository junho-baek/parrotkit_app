# Domain AGENTS Product Strategy

## 배경
- 최근 논의에서 ParrotKit의 핵심 가치가 단순 레시피 생성이 아니라, 원본 영상 분석과 브랜드 컨텍스트를 함께 반영한 촬영 실행 도구라는 점이 분명해졌다.
- 프로젝트 루트 `AGENTS.md`는 운영 규칙 중심이라, 제품 도메인 자체에 대한 판단 원칙은 소스 트리 안쪽에 따로 남겨둘 필요가 있다.
- 현재 소스 트리에는 명확한 `domain/` 폴더가 없으므로, 실제 적용 범위를 넓게 가져갈 수 있는 `src/AGENTS.md`가 가장 자연스럽다.

## 목표
- 제품 도메인 관점의 핵심 원칙을 `src/AGENTS.md`에 정리한다.
- 앞으로 recipe / analysis / shooting / prompter / brand context 관련 작업 시 일관된 판단 기준을 제공한다.
- 이번 논의를 문서로 고정해 future agent가 다시 같은 제품 결정을 뒤집지 않도록 한다.

## 범위
- `src/AGENTS.md` 신규 작성
- 제품 구조, 입력 구조, 출력 구조, 프롬프터, 네이티브 카메라 방향 정리
- 작업 기록용 context 문서 작성

## 변경 파일
- `.gitignore`
- `src/AGENTS.md`
- `plans/20260406_domain_agents_product_strategy.md`
- `context/context_20260406_012220_domain_agents_product_strategy.md`

## 테스트
- 문서 내용 검토
- `git diff --stat` 및 파일 내용 확인

## 롤백
- `src/AGENTS.md` 삭제
- plan/context 문서 제거

## 리스크
- `src` 전체에 적용되는 문서이므로, 너무 구현 세부 규칙으로 쓰면 오히려 경직될 수 있다.
- 현재 구조상 완전한 단일 도메인 폴더는 아니기 때문에, 향후 폴더 구조가 정리되면 위치 재조정이 필요할 수 있다.

## 결과
- 완료
- 제품 도메인 규칙을 `src/AGENTS.md`에 정리했다.
- `원본 분석 / 실행 레시피 / 브랜드 컨텍스트 / 프롬프터 / 추후 네이티브 촬영 surface`를 별도 판단 축으로 문서화했다.
- 명확한 단일 도메인 폴더가 없는 현재 구조를 고려해, 프로젝트 루트 대신 `src` 범위에 적용되는 문서로 배치했다.
- `.gitignore`에 `!src/AGENTS.md` 예외를 추가해 도메인용 AGENTS 문서가 실제로 Git 추적되도록 맞췄다.

## 연결 Context
- `context/context_20260406_012220_domain_agents_product_strategy.md`
