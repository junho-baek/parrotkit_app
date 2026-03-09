# Tracking Strategy + Notion Report Plan (2026-03-09)

## 배경
- 사용자가 GTM, GA4, Lemon Squeezy test checkout을 수동으로 연결하고 있으며 현재 트리거와 코드 연결 방식을 명확히 이해할 필요가 있다.
- 동시에 향후 운영 기준의 GTM / UTM / Meta Pixel 전략을 한국어 문서로 정리해 팀 공유용 Notion에 올려야 한다.

## 목표
- 현재 코드에서 어떤 이벤트가 어디서 발생하고 GTM 트리거와 어떻게 연결되는지 정리한다.
- GTM / UTM / Meta Pixel 운영 전략을 MVP 기준으로 문서화한다.
- 문서를 Notion reports 데이터소스에 업로드한다.

## 범위
- 포함: 이벤트 호출 경로 확인, GA4/GTM 트리거 해석, UTM 전략 제안, Meta Pixel 운영 전략 제안, Notion 업로드
- 제외: 추가 코드 구현, GTM/Meta 실제 publish 대행, 대규모 이벤트 taxonomy 리팩터링

## 변경 파일
- `plans/20260309_tracking_strategy_and_notion_report.md`
- `output/reports/20260309_parrotkit_tracking_strategy_ko.md`
- `context/context_20260309_*_tracking_strategy.md`

## 테스트
- 코드 기반 이벤트 발생 위치 검토
- GTM preview에서 확인된 이벤트와 코드 정의 일치 여부 검토
- Notion 업로드 성공 여부 확인

## 롤백
- 문서/컨텍스트만 추가하므로 필요 시 문서 삭제로 롤백 가능

## 리스크
- GTM/GA4/Meta 콘솔 설정은 외부 시스템이라 문서와 실제 설정 상태가 잠시 어긋날 수 있음
- 현재 앱에는 UTM 저장 로직이 없으므로 전략 문서에는 '권장안'과 '현재 상태'를 분리해서 적어야 함

## 결과
- 현재 코드 기준 이벤트 호출 경로를 확인하고 문서화했다.
- GTM / UTM / Meta Pixel 운영 전략 문서를 `output/reports/20260309_parrotkit_tracking_strategy_ko.md`로 작성했다.
- Notion reports 데이터소스에 전략 문서를 업로드했다: `https://www.notion.so/31efdc54bb72815182f1ed977785d2f6`

## 연결 Context
- `context/context_20260309_204903_tracking_strategy_and_notion_report.md`
