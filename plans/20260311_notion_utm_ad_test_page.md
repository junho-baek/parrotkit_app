# Notion UTM Ad Test Page (2026-03-11)

## 배경
- GA4 최소 이벤트 세트와 UTM 저장 로직이 준비된 상태에서, 외부 유입 링크 테스트를 바로 수행할 수 있는 Notion 테스트 페이지가 필요하다.
- Meta Pixel은 계정 준비 이슈로 보류 중이며, 우선 Notion 기반 UTM 유입 테스트 경로를 만든다.

## 목표
- 연결된 Notion 부모 페이지 아래에 UTM이 붙은 테스트 링크 전용 페이지를 생성한다.
- 홈 진입 링크와 Pricing 직행 링크를 함께 제공해 GA4/UTM 검증에 바로 사용할 수 있게 한다.
- 로컬에도 동일한 기준 문서를 남긴다.

## 범위
- 포함: 로컬 Markdown 기준 문서 작성, Notion API 기반 child page 생성, UTM 테스트 링크 삽입, context 기록
- 제외: 앱 코드 변경, GTM/GA4/Meta 설정 변경, DB 스키마 변경

## 변경 파일
- `plans/20260311_notion_utm_ad_test_page.md`
- `output/reports/20260311_parrotkit_notion_utm_ad_test_page_ko.md`
- `context/context_20260311_*_notion_utm_ad_test_page.md`

## 테스트
- Notion API 호출 성공 확인
- 생성된 Notion page URL 확인
- 링크 파라미터 형식 검토 (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`)

## 롤백
- 잘못 생성된 경우 Notion 페이지 수동 삭제 가능
- 로컬 산출물 커밋 revert 가능

## 리스크
- Notion parent page 권한이 토큰과 맞지 않으면 생성이 실패할 수 있다.
- UTM은 외부 유입 링크에만 의미가 있으므로 앱 내부 링크로 재사용하면 attribution이 오염될 수 있다.

## 결과
- 진행 후 업데이트 예정

## 결과
- 완료
- 생성 페이지: `https://www.notion.so/20260311-Parrotkit-UTM-320fdc54bb72811780c5dd3b3289a195`
- pageId: `320fdc54-bb72-8117-80c5-dd3b3289a195`
- 로컬 원본: `output/reports/20260311_parrotkit_notion_utm_ad_test_page_ko.md`
- context: `context/context_20260311_205000_notion_utm_ad_test_page.md`
