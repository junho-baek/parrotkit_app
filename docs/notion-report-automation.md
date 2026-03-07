# Notion Report Automation

## 목적

- PDF/PPT 같은 테스트 결과 산출물을 Notion에 반복적으로 업로드한다.
- Markdown 요약을 Notion page body로 변환해 보고서 맥락을 남긴다.
- 생성/업로드 경로를 코드화해서 다른 에이전트도 같은 절차를 재사용한다.

## 인증 모델

두 인증 경로를 분리한다.

1. `NOTION_API_KEY`
- 내부 Integration token.
- headless script와 수동 업로드에 사용한다.
- 파일 업로드 자동화는 이 경로를 기준으로 한다.

2. `codex mcp login notion`
- Codex용 interactive OAuth login.
- 탐색, 검색, 수동 편집용이다.
- 파일 업로드 자동화 대체재가 아니다.

## 데이터베이스 스키마

`make notion-setup`은 아래 속성을 가진 database + initial data source를 만든다.

- `Name` (`title`)
- `Project` (`select`)
- `Report Type` (`select`)
- `Status` (`select`)
- `Created At` (`date`)
- `Branch` (`rich_text`)
- `Commit` (`rich_text`)
- `Source URL` (`url`)
- `Recipe ID` (`rich_text`)
- `Artifacts` (`files`)
- `Notes` (`rich_text`)

`Status`를 `status` property가 아닌 `select`로 둔 이유:
- Notion `2025-09-03` API 기준으로 새 `status` property 생성은 API에서 완전 지원되지 않는다.
- setup script를 완전 자동화하려면 create 가능한 property 타입만 써야 한다.

## 명령어

```bash
make notion-setup
make notion-upload-dry-run
make report-and-upload
make report-template REPORT=output/pdf/example.pdf
make deck-template REPORT=output/ppt/example.pptx
make deck-and-upload REPORT=output/ppt/example.pptx
```

특정 파일 업로드:

```bash
make notion-upload \
  REPORT=output/pdf/example.pdf \
  SUMMARY_MD=output/reports/example.md \
  REPORT_TYPE=e2e \
  STATUS=Uploaded
```

## 제약

- 현재 구현은 Notion single-part file upload 기준이다.
- 20MB 이하 파일을 기본 가정으로 둔다.
- 더 큰 파일이 필요하면 multipart 업로드를 별도 구현해야 한다.
