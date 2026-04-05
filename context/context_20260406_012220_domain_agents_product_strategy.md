# Domain AGENTS Product Strategy

## 작업 요약
- 프로젝트 루트가 아닌 `src/AGENTS.md`에 제품 도메인 규칙을 새로 작성했다.
- 이번 문서는 운영 규칙이 아니라 제품 판단 기준을 담는다.
- 핵심 내용은 다음 다섯 축으로 정리했다.
  - 원본 분석은 레시피와 분리된 근거 레이어다.
  - 레시피는 실행용 결과물이다.
  - 기업 PDF는 브랜드 컨텍스트 입력으로 받아 구조화된 brief JSON으로 정규화해야 한다.
  - 프롬프터는 촬영 실행 도구이며, 선택 가능한 정보와 위치 조정 가능성을 전제로 설계해야 한다.
  - 추후 네이티브 카메라 surface를 도입하더라도 제품은 하나로 유지해야 한다.

## 변경 파일
- `.gitignore`
- `src/AGENTS.md`
- `plans/20260406_domain_agents_product_strategy.md`

## 검증
- 문서 내용 검토
- `git status --short --branch`
  - `.gitignore`
  - `src/AGENTS.md`
  - `plans/20260406_domain_agents_product_strategy.md`
  - `context/context_20260406_012220_domain_agents_product_strategy.md`
  - `.gitignore` 수정 1건과 신규 문서 3건이 잡히는 상태 확인

## 메모
- 현재 코드베이스에는 명확한 단일 도메인 폴더가 없어서, 소스 전체에 적용 가능한 `src/AGENTS.md`를 도메인 문서 위치로 선택했다.
- 기존 `.gitignore`가 새 `AGENTS.md`를 전역 ignore하고 있어, `!src/AGENTS.md` 예외를 추가해 이번 문서가 실제로 추적되도록 했다.
- 이후 recipe / analysis / shooting / prompter 관련 코드를 별도 feature 폴더로 재구성하면 이 문서를 더 안쪽으로 이동할 수 있다.
