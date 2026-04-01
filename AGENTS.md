# AGENTS

## Git 운영 원칙 (dev-only / multi-clone)

- 기본 Git 운영은 `dev-only`를 원칙으로 한다. 별도 브랜치 전략보다 `작업별 로컬 clone 분리 + dev 자주 동기화`를 우선한다.
- 로컬 clone 하나는 작업 하나만 담당한다. 하나의 clone에서 여러 주제의 변경을 섞지 않는다.
- 새 작업 시작 전에는 현재 clone이 최신 `origin/dev` 기준인지 먼저 맞춘다. 오래된 clone을 재사용하기보다 필요 시 새 clone을 만들거나, 최소한 `fetch` 후 `origin/dev` 기준으로 동기화한다.
- macOS `._*` / AppleDouble 메타파일 정리가 필요할 때는 임의 `find`/수동 삭제보다 프로젝트 표준 명령 `make cl`을 먼저 사용한다. 특히 `git fetch`, `rebase`, Drizzle 메타 처리, 빌드 산출물 정리 전후에 관련 오류가 보이면 `make cl`부터 시도한다.
- 충돌은 `push` 후 해결하는 것이 아니라 `push` 직전 로컬에서 해결한다. 구현 후 바로 push하지 말고 먼저 `origin/dev`를 반영해 rebase 또는 동등한 방식으로 충돌을 정리한 뒤 push한다.
- `dev`는 항상 실행 가능하고 배포 가능한 기준선으로 유지한다. 큰 리팩터링이나 장기 작업은 한 번에 오래 끌지 말고, 작은 단위로 쪼개 빠르게 통합한다.
- 검증은 `로컬 최소 검증 + 배포 후 실제 QA`의 2단계로 본다. 로컬에서는 비용이 낮은 확인을 우선하고, 최종 판단은 배포 환경에서의 동작 확인까지 포함한다.
- 프론트엔드/배포 연동 작업은 push 후 배포 상태를 반드시 확인한다. 특히 Vercel 등 배포 플랫폼에서 build/runtime/env 차이가 있을 수 있으므로, 배포 성공 여부와 주요 사용자 흐름 QA를 함께 확인한다.
- `dev`에는 force push를 기본 금지한다. 배포가 깨진 상태에서 다른 작업을 이어서 올리지 말고, 먼저 현재 배포 가능 상태를 복구한다.
- 장시간 방치된 clone은 신뢰하지 않는다. 동기화 비용이 커졌거나 문맥이 섞였다고 판단되면 과감히 폐기하고 최신 `dev` 기준 clone으로 다시 시작한다.
- 패키지 설치 비용이 큰 프로젝트에서는 multi-clone 운영 시 디스크/설치 시간을 고려한다. 필요하면 패키지 매니저 전환이나 캐시 전략을 검토하되, 현재 프로젝트 표준 명령이 있으면 우선 그 규칙을 따른다.

## 작업 기본 흐름

0. 현재 clone이 이번 작업 전용인지, 최신 `origin/dev` 기준인지 먼저 확인한다.
1. 프로젝트 구조와 현재 작업 범위를 먼저 파악한다.
2. 코드 변경 전 최신 `context_*.md`와 관련 `plans/*.md`를 확인한다.
3. `git status`를 확인하고, 이번 작업용 `plans/` 문서를 먼저 작성한다.
4. 구현 후 검증과 테스트를 수행한다.
5. 기본 검증은 `npm run dev` 기반 수동 확인으로 진행하고, `npm run build`는 사용자 명시 요청, 배포 직전 점검, 빌드 오류 재현이 필요한 경우에만 실행한다.
6. 결과 요약과 검증 내용을 `context_*.md`에 남긴다.
7. 작업 완료 후 `git status`를 다시 확인하고, `origin/dev`를 반영해 충돌을 로컬에서 정리한 뒤 `dev`에 커밋/푸시한다.
8. 프론트엔드/배포 연동 작업은 push 후 배포 상태와 주요 사용자 흐름 QA까지 확인한다.

## 개발 규칙 (Orchestrator)

1. 코드 변경 전 최신 context\_\*.md 확인 (context 폴더의 타임라인 기준 최신 파일부터 읽기)
2. git status 확인
3. 변경 후 기본 검증은 `npm run dev` / `next dev` 기준 로컬 QA로 수행한다. `npm run build`는 사용자가 명시적으로 요청한 경우에만 실행한다.
4. 결과 요약 기록 (context\_\*.md에 추가 또는 새 context 문서 작성)
5. 작업 완료 후 반드시 git push 수행
6. GitHub push 전에 관련 리포트/QA 산출물이 있더라도 Notion 업로드는 사용자가 명시적으로 요청한 경우에만 수행한다.

## 작업 절차 (고정)

1. 프로젝트 구조 파악
2. 최신 context 파악
3. plans 디렉토리 기존 플랜 파악
4. 이번 작업 plan 문서 작성
5. 구현 및 `dev` 기준 검증/테스트 수행 (`build`는 사용자 요청 시에만 실행)
6. context 업데이트
7. git 상태 확인 후 커밋/푸시

## plans 디렉토리 운영 규칙

- 모든 작업은 `plans/`에 작업 시작 plan을 먼저 작성한다.
- 파일명 규칙: `YYYYMMDD_<topic>.md`
- 필수 섹션: 배경, 목표, 범위, 변경 파일, 테스트, 롤백, 리스크
- 작업 완료 시 plan 문서에 결과 및 연결된 context 파일명을 남긴다.

## Supabase 작업 규칙

- Supabase 테이블/쿼리/RLS/타입에 영향 있는 작업 시작 시 `npm run db:schema`를 먼저 실행한다.
- 작업 전 최신 `context/context_*_supabase_schema_snapshot.md`와 `src/types/supabase.generated.ts`를 확인한다.
- DB 스키마/계약 변경 후 `npm run db:schema`를 재실행해 스냅샷을 갱신한다.
- 실행/결과 요약을 `context/context_*.md`에 기록한다.
- 새 Supabase 프로젝트에서는 legacy `anon` / `service_role` 키를 새로 도입하지 않는다.
- 기본 env 이름은 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`로 유지한다.
- 이유: publishable/secret 키는 프로젝트 JWT signing secret과 독립적으로 회전할 수 있어 운영 중 키 교체 리스크가 더 낮다.
- 브라우저/일반 auth 흐름은 publishable key를 사용하고, 관리자 API/백필/마이그레이션만 secret key를 사용한다.
- secret key는 서버 전용이다. `NEXT_PUBLIC_` 접두사를 붙이거나 클라이언트 번들로 흘려보내지 않는다.
- Next.js 앱 런타임용 `DATABASE_URL`은 우선 pooled connection string을 사용한다. direct connection은 장기 세션이 꼭 필요한 오프라인 관리 작업에만 쓴다.
- 다단계 쓰기, queue 처리, 정책 민감 로직은 HTTP에서 여러 round trip을 조합하기보다 Postgres function + Supabase RPC로 먼저 검토한다.
- RPC 함수는 기본적으로 `SECURITY INVOKER`를 우선하고, `SECURITY DEFINER`가 필요하면 고정 `search_path`, schema-qualified 이름, 명시적 auth 체크를 같이 남긴다.
- PGMQ를 사용할 때는 enqueue/dequeue/ack를 idempotent하게 설계하고, 긴 소비 작업을 request handler 안에서 돌리지 않는다.
- 새 RPC/queue 소비 경로가 추가되면 filter/order/join 컬럼에 필요한 인덱스를 같이 검토하고 hot path는 `EXPLAIN`으로 확인한다.

## Notion 리포트 자동화 규칙

- Notion 자동 업로드는 MCP가 아니라 `NOTION_API_KEY` 기반 스크립트(`scripts/setup-notion-reports.cjs`, `scripts/upload-report-to-notion.cjs`)를 기준으로 유지한다.
- 이유: Notion MCP는 대화형 읽기/쓰기에는 유용하지만 PDF/PPT 같은 파일 업로드 자동화는 headless API 토큰 기반이 더 안정적이다.
- GitHub push 전에 관련 리포트가 있어도 Notion 업로드는 사용자가 명시적으로 요청한 경우에만 수행한다.
- 사용자가 업로드를 요청한 경우에만 `make notion-upload-dry-run`으로 확인 후 `make report-and-upload` 또는 `make deck-and-upload`까지 수행한다.
- 관련 리포트가 아직 없는데 사용자가 업로드까지 요청했다면 `make report-template` 또는 `make deck-template`으로 summary 초안을 만든 뒤 Notion 업로드를 완료한다.
- `NOTION_REPORTS_PARENT_PAGE_ID`는 database 최초 생성에만 사용하고, 생성 후에는 `NOTION_REPORTS_DATABASE_ID`와 `NOTION_REPORTS_DATA_SOURCE_ID`를 `.env.local`에 유지한다.
- Notion API 버전은 기본적으로 `2025-09-03`로 고정한다. 이유: database/data source 분리 이후 요청 형태가 달라졌기 때문에 버전을 고정해야 스크립트 계약이 안정적이다.
- 새 automation을 추가할 때는 먼저 `make notion-upload-dry-run`으로 메타데이터/summary 파싱 결과를 확인한 뒤 실제 업로드를 수행한다.
- 업로드 대상 파일은 기본적으로 20MB 이하 single-part를 가정한다. 더 큰 파일이 필요해지면 multipart 업로드를 별도 구현하고 문서화한다.
- 반복 산출물 업로드 시 `report-and-upload`를 우선 사용하고, `SUMMARY_MD`가 없으면 동일 stem의 `output/reports/*.md`를 자동 탐색한다.
- PDF/PPT summary 초안이 없으면 `make report-template` 또는 `make deck-template`으로 먼저 Markdown 템플릿을 만든다.
- PPT/PPTX 산출물은 `make deck-and-upload` 또는 `make notion-upload REPORT=<pptx> REPORT_TYPE=deck` 경로로 업로드한다.

## 배포환경 QA 규칙

- 기본 배포환경 테스트 주소는 `https://parrotkit-deploy.vercel.app/`로 고정한다.
- 사용자가 "배포환경에서 테스트"라고 하면 별도 URL을 주지 않는 한 위 주소를 기준으로 검증한다.
- 배포 QA는 기본적으로 headed browser로 진행한다.
- 1회성 플로우 검증은 `playwright` 기준으로 진행하고, 같은 세션을 유지한 반복 디버깅/재검증은 `playwright-interactive` 기준으로 진행한다.
- 배포 QA 산출물은 반드시 남긴다: 스크린샷은 `output/playwright/`, Markdown 리포트는 `output/reports/`, PDF 리포트는 `output/pdf/`.
- 배포 QA 리포트에는 최소한 테스트 시간, 대상 URL, 테스트 목적, 검증 범위, 주요 결과, 실패/리스크, 스크린샷 증거, 다음 액션 추천을 포함한다.
- PDF 리포트는 `pdf` 스킬 기준으로 생성하고 렌더링 품질까지 확인한다.
- 배포 QA가 끝난 뒤 Notion 업로드는 사용자가 명시적으로 요청한 경우에만 수행한다.
- 배포 QA 중 로그인/온보딩/결제처럼 환경 의존성이 큰 플로우는 로컬보다 배포 URL을 우선 진실값으로 본다.

## 재사용 테스트 계정

- Email: `parrotkitcodextest@mailinator.com`
- Username: `parrotkitcodextest`
- Password: `ParrotkitE2E2026!`
- 용도: 로컬/Vercel smoke test 시 기본 로그인 계정으로 재사용
- 메모: 2026-03-07 기준 Supabase Auth signup은 email send rate limit에 막혀 있어, 이 계정은 admin provision 후 브라우저 로그인 검증까지 마친 상태다.
