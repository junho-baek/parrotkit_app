# nomad-diary 로컬 데이터 학습 계획 | Nomad Diary Local Data Study Plan

## 범위

- 새 active source로 추가한 `raw/nomad-diary/`를 대상으로 한다.
- 이 저장소는 노마드 코더의 레거시 React Native / Expo 저널 앱이며, 저장소 전체 이력이 정확히 10개 커밋으로 구성되어 있다.
- 이번 라운드의 목표는:
  - oldest → newest 순으로 10개 커밋을 읽고
  - 각 커밋마다 개념 중심 제목의 분석 문서를 하나씩 만들며
  - 당시 강의 개념, 현재 대응 개념, 현재 베스트 프랙티스, 스킬 추출 후보를 분리해 남기는 것이다.

## 현재 파악한 사실

- 커밋 흐름은 크게 네 묶음으로 보인다.
  - Expo / React Navigation 기반 앱 셸
  - 감정 기록 폼과 온디바이스 DB 도입
  - Realm 기반 읽기 / 쓰기 / 삭제와 LayoutAnimation
  - AdMob 설치, 표시, reward 이벤트 연계
- 사용자가 특히 보고 싶은 축은 다음과 같다.
  - 폰 안에 직접 저장되는 네이티브 DB
  - `AsyncStorage`의 string-only 제약을 넘는 방법
  - 백엔드 없이도 돌아가는 local-first 사고방식
  - 광고 SDK의 현재식 경계
  - 레이아웃 애니메이션과 이벤트 sequencing

## 이번 소스를 읽는 핵심 축

- key-value 저장소와 온디바이스 데이터베이스의 경계
- Realm이 해결하는 문제와 현재 Expo / RN 기준 대안
- reactive local collection 읽기와 삭제 UX
- 단순 `LayoutAnimation`과 현재식 list transition 설계
- 광고 SDK 설치와 build boundary
- reward ad가 side effect를 여는 이벤트 게이트가 될 때의 설계 문제

## 문서화 원칙

- 제목과 파일명은 강의 번호보다 오래 남는 개념을 먼저 드러낸다.
- 각 문서에는 최소한 다음 네 층을 분리한다.
  - 레거시 커밋이 실제로 하는 방식
  - 현재 대응 개념
  - 현재 기준 베스트 프랙티스
  - `oh-my-rn`으로 승격할 수 있는 스킬 추출 후보
- 로컬 DB, AsyncStorage 대안, 광고 SDK처럼 2026 기준으로 바뀐 내용은 가능하면 공식 문서를 비교 기준으로 사용한다.

## 예상 결과물

- `wiki/analyses/` 아래에 커밋당 분석 문서 10개
- `wiki/index.md`에 `nomad-diary` 라운드 연결
- `wiki/log.md`에 진행 기록 추가
- 반복 교훈은 이후 `oh-my-rn`의 local persistence / ads / form 규칙으로 승격 후보를 남긴다

## 열린 질문

- `realm`을 현재도 유지 가능한 선택지로 볼지, 아니면 Expo 기본 local-first persistence는 `expo-sqlite` 쪽으로 더 강하게 기울지
- `AsyncStorage` 대체를 단순 key-value 개선으로 볼지, 본격 DB 도입으로 읽을지 어떤 기준으로 나눌지
- reward ad를 코어 write action 앞에 두는 흐름을 학습용 예제로만 읽을지, 제품 설계 안티패턴으로 얼마나 강하게 남길지
- `LayoutAnimation`을 simple global layout transaction 용도로 남기고, item-level animation은 Reanimated layout animation으로 분리할지

## 관련 소스

- [raw/nomad-diary](/Users/junho/project/RN_practice/raw/nomad-diary)
- [RN 학습 워크플로우](../concepts/rn-study-workflow.md)
- [nomad-lang 애니메이션 학습 계획](nomad-lang-animation-study-plan.md)

