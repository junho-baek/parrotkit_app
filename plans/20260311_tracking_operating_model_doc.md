# Tracking Operating Model Document Plan (2026-03-11)

## 배경
- 사용자는 ParrotKit의 이벤트 추적 구조가 실제로 어떻게 동작하는지, 표준 이벤트 설계가 충분히 괜찮은지, 그리고 GTM / GA4 / Meta Pixel 운영을 어떤 원리와 역할 분리로 가져가야 하는지 한 번에 이해할 수 있는 문서를 원한다.
- 기존 전략 문서는 GTM / UTM / Meta Pixel 중심 정리였고, 이번에는 "분석 원리", "개발자/마케터 역할 분리", "현재 구현 상태", "표준 이벤트 품질 평가"까지 묶은 운영 모델 문서가 필요하다.

## 목표
- 현재 이벤트 파이프라인과 실제 코드 구현 경로를 한국어로 정리한다.
- 현재 표준 이벤트 설계 수준을 평가하고, 부족한 점과 보완 방향을 명확히 문서화한다.
- 개발자와 마케터의 역할 분리 원칙을 운영 모델 형태로 제시한다.
- 새 운영 모델 문서를 Notion reports 데이터소스에 업로드한다.

## 범위
- 포함: 코드 기반 이벤트 흐름 정리, 이벤트 설계 평가, 분석 원리, GTM / GA4 / Meta Pixel 운영 방식, 역할 분리, Notion 업로드
- 제외: 실제 코드 리팩터링, GTM/Meta 태그 추가 구현, UTM 저장 로직 구현

## 변경 파일
- `plans/20260311_tracking_operating_model_doc.md`
- `output/reports/20260311_parrotkit_event_operating_model_ko.md`
- `output/reports/20260311_parrotkit_event_operating_model_ko.txt`
- `output/reports/20260311_parrotkit_event_operating_model_notion_summary_ko.md`
- `context/context_20260311_*_tracking_operating_model_doc.md`

## 테스트
- 최신 코드 기준 이벤트 발생 위치 재검토
- 기존 GTM Preview / 결제 성공 상태와 문서 내용 정합성 확인
- Notion 업로드 dry-run 및 실제 업로드 확인

## 롤백
- 문서/컨텍스트 추가 작업만 수행하므로, 필요 시 추가된 문서와 Notion 페이지만 제거하면 된다.

## 리스크
- GTM publish 상태와 Meta Pixel live 상태는 외부 콘솔의 현재 시점과 문서 작성 시점이 잠시 어긋날 수 있다.
- 현재 앱에 UTM 저장 로직이 없으므로, 문서에서는 "현재 구현"과 "권장 운영"을 분리해서 적어야 한다.

## 결과
- 이벤트 운영 모델 문서를 `output/reports/20260311_parrotkit_event_operating_model_ko.md`로 작성했다.
- Notion 본문용 축약 요약을 `output/reports/20260311_parrotkit_event_operating_model_notion_summary_ko.md`로 작성했다.
- Notion 파일 업로드가 Markdown MIME을 지원하지 않아 첨부용 텍스트 아티팩트 `output/reports/20260311_parrotkit_event_operating_model_ko.txt`를 추가했다.
- Notion 업로드를 완료했다: `https://www.notion.so/20260311-ParrotKit-31ffdc54bb7281b19fdec33331a62e8c`

## 연결 Context
- `context/context_20260311_205800_tracking_operating_model_doc.md`
