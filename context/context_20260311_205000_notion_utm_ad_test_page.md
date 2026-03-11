# Context: Notion UTM Ad Test Page (2026-03-11 20:50 KST)

## 목적
- 외부 유입 링크 테스트에 바로 사용할 수 있는 UTM 전용 Notion 페이지를 생성.
- 홈 진입 링크와 Pricing 직행 링크를 각각 제공해 GA4 및 내부 이벤트 로그 검증에 활용.

## 입력/기준
- 배포 URL: `https://parrotkit-deploy.vercel.app/`
- Notion parent page id: `31cfdc54bb72803ba066c513dcebf6c4`
- 생성 방식: `NOTION_API_KEY` 기반 Notion API 직접 호출

## 수행 내용
1. 로컬 기준 문서 작성
   - `output/reports/20260311_parrotkit_notion_utm_ad_test_page_ko.md`
2. Notion parent page 아래 child page 생성
3. 클릭 가능한 UTM 링크 블록 추가
   - 홈 진입 링크 5개
   - Pricing 직행 링크 3개
4. 확인 방법 / 기대 결과 섹션 추가

## 생성 결과
- 제목: `20260311 Parrotkit 광고 테스트 링크 (UTM)`
- pageId: `320fdc54-bb72-8117-80c5-dd3b3289a195`
- URL: `https://www.notion.so/20260311-Parrotkit-UTM-320fdc54bb72811780c5dd3b3289a195`

## 링크 구성 원칙
- UTM은 외부 -> 앱 진입 링크에만 부착
- 앱 내부 이동 링크에는 부착하지 않음
- first touch 테스트는 새 시크릿 창 또는 새 브라우저 프로필 기준으로 진행

## 산출물
- 로컬 Markdown: `output/reports/20260311_parrotkit_notion_utm_ad_test_page_ko.md`
- 생성 결과 JSON: `output/reports/20260311_parrotkit_notion_utm_ad_test_page_result.json`

## 비고
- Notion MCP는 현재 인증이 붙어 있지 않아 사용하지 않았고, 저장된 `NOTION_API_KEY`와 `NOTION_REPORTS_PARENT_PAGE_ID`를 사용해 직접 페이지를 생성했다.
