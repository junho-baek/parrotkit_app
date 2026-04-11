# nomad-lang 애니메이션 학습 계획 | Nomad Lang Animation Study Plan

## 범위

- 새 staged source로 추가한 `raw/nomad-lang/`를 대상으로 한다.
- 이 저장소는 노마드 코더의 React Native 애니메이션 중심 샘플 앱이며, 저장소 전체 이력이 정확히 20개 커밋으로 구성되어 있다.
- 이번 라운드의 목표는:
  - 커밋 20개를 oldest → newest 순으로 읽고
  - 각 커밋마다 diff를 기준으로
  - 개념 중심 제목의 분석 문서를 하나씩 만들며
  - 당시 강의 개념, 현재 대응 개념, 현재 베스트 프랙티스를 분리해서 기록하는 것이다.

## 현재 파악한 사실

- 저장소 README는 이 앱을 "language learning application full of cool interactions and animations"라고 설명한다.
- 기술 스택은 대체로:
  - Expo SDK 42
  - React Native 0.63
  - React 16
  - `react-native-reanimated` 2.2
  - `react-native-gesture-handler`
  - `styled-components`

기반의 레거시 React Native / Expo 조합이다.
- 커밋 목록은 `3.1 Setup`부터 `3.19 Drag and Drop Project part Three`까지 총 20개다.

## 이번 소스를 읽는 핵심 축

- 애니메이션 상태 모델
- Reanimated 2 초기 패턴과 현재식 대응
- interpolation, gesture, pan, offset, threshold 설계
- drag and drop 상호작용 구조
- 레거시 Expo / RN 버전 제약과 현재 RN/Expo 기준의 번역

## 문서화 원칙

- 제목과 파일명은 강의 번호보다 오래 남는 개념을 먼저 드러낸다.
- 각 문서에는 최소한 다음 세 층을 분리한다.
  - 레거시 커밋이 실제로 하는 것
  - 현재 대응 개념
  - 현재 베스트 프랙티스
- 필요한 경우 `vercel-react-native-skills`를 비교 기준으로 쓰되, 애니메이션과 gesture 쪽은 현재 Reanimated / Gesture Handler 관점에서 따로 풀어 쓴다.

## 예상 결과물

- `wiki/analyses/` 아래에 커밋당 분석 문서 20개
- `wiki/index.md`에 새 분석 문서들 연결
- `wiki/log.md`에 진행 기록 누적
- 반복 교훈은 이후 `oh-my-rn` 쪽으로 승격 후보를 남긴다

## 열린 질문

- 중복되거나 오타가 있는 커밋 제목(`3.17 Drag and Drop Project part One`이 두 번 보임)을 문서 제목에 어떻게 반영하지 않을지
- 현재 기준에서 `PanResponder`를 어디까지 레거시 패턴으로 보고, 어디서부터 Gesture Handler / Reanimated gesture API로 번역할지
- 애니메이션 데모 커밋과 실제 reusable interaction pattern을 어떤 단위로 분리해 메모할지

## 관련 소스

- [raw/nomad-lang](/Users/junho/project/RN_practice/raw/nomad-lang)
- [RN 학습 워크플로우](../concepts/rn-study-workflow.md)
