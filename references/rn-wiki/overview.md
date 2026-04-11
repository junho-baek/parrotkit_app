# 개요 | Overview

## 방향

- 이 위키는 노마드 코더 React Native 마스터클래스와 `raw/noovies/`, 애니메이션 중심 샘플 앱 `raw/nomad-lang/`, local DB / ads 중심 샘플 앱 `raw/nomad-diary/`, 그리고 Firebase auth / public crypto API / detail chart 중심 샘플 앱 `raw/social-coin/`를 staged source로 삼아 학습 기록을 누적한다.
- 레거시 React Native 패턴, 최신 React Native 권장 방식, 현재 사용자가 실제로 채택한 방향을 분리해서 남긴다.
- 최신 React Native 비교 기준은 [`vercel-react-native-skills`](/Users/junho/.agents/skills/vercel-react-native-skills/SKILL.md)로 두고, `oh-my-rn`은 그 위에 얹는 개인 overlay로 다룬다.
- 반복해서 살아남는 교훈은 개인용 RN 스킬 `oh-my-rn`으로 점진적으로 승격하는 것을 목표로 한다.

## 범위

- React Native 환경 설정과 빌드 메모
- 실제 학습이 시작된 뒤의 챕터별 또는 기능별 학습 노트
- 레거시 React Native 방식과 최신 React Native 방식 비교
- 나중에 개인용 Codex 스킬로 승격할 수 있는 재사용 가능한 교훈

## 현재 가설

- 이 워크스페이스는 세팅 단계만이 아니라, 선택된 소스를 커밋 단위로 깊게 읽어 durable note로 바꾸는 단계에 들어왔다.
- `noovies`는 노마드 코더 React Native 마스터클래스의 핵심 staged source지만, 아직 실제 ingest가 진행된 소스는 아니다.
- `nomad-lang`는 애니메이션과 gesture 상호작용 중심 active source이며, 20개 커밋을 개념 중심 문서 20개로 이미 정리했다.
- `nomad-diary`는 온디바이스 DB, `AsyncStorage` 대안, layout animation, 광고와 reward event 흐름을 읽는 새 active source다.
- `social-coin`은 Firebase auth, public crypto query, detail chart를 읽는 active source이며, 8개 커밋을 개념 중심 문서 8개로 정리했다.
- 지금의 우선 목표는 "로컬 퍼시스턴스와 광고 같은 native boundary를 현재식으로 번역하는 규칙"까지 `oh-my-rn`으로 승격 가능한 형태로 남기는 것이다.
- 동시에 auth provider 선택, public API query, chart data pipeline을 Firebase와 Supabase 관점에서 어떻게 번역할지도 같이 정리한다.
- 첫 bare React Native 연습 앱은 이미 생성되었고, Android와 iOS 기본 빌드 흐름을 확인했다.
- Expo 샌드박스도 별도로 만들었고, 기본 생성 뒤 `prebuild`로 네이티브 디렉터리를 얻는 흐름을 확인했다.
- 따라서 당장은 모든 강의 챕터를 요약하기보다, 실제로 시작한 소스를 커밋당 개념 문서로 읽고 `oh-my-rn` 후보를 함께 추출하는 흐름이 더 중요하다.

## 열린 질문

- `noovies`를 언제 예정된 소스에서 실제 학습 소스로 전환할까?
- `nomad-lang`의 20개 애니메이션 커밋을 커밋당 1문서로 먼저 훑은 뒤, 반복 패턴을 어떤 축으로 다시 묶을까?
- `nomad-diary`의 local DB 흐름을 현재 기준에서 `expo-sqlite` 기본값과 Realm 예외 규칙으로 어떻게 나눌까?
- `social-coin`의 Firebase auth 패턴을 RNFirebase, Firebase JS SDK, Supabase 중 어디까지 일반화할까?
- reward ad가 코어 write action을 여는 구조를 어디까지 학습용 예제로만 제한하고, 어떤 규칙으로 product 안티패턴으로 승격할까?
- 노트 구조를 챕터 기준, 화면 기준, 개념 기준 중 무엇으로 잡는 게 가장 좋을까?
- 개인용 스킬 `oh-my-rn`은 얼마나 일반화할지, 아니면 Nicolas 강의 스타일에 더 맞출지 어떻게 정할까?

## 핵심 문서

- [rn-study-plan](analyses/rn-study-plan.md)
- [nomad-lang-animation-study-plan](analyses/nomad-lang-animation-study-plan.md)
- [nomad-diary-local-data-study-plan](analyses/nomad-diary-local-data-study-plan.md)
- [social-coin-firebase-auth-and-chart-study-plan](analyses/social-coin-firebase-auth-and-chart-study-plan.md)
- [rn-study-workflow](concepts/rn-study-workflow.md)
- [rn-setup-status](analyses/rn-setup-status.md)
- [expo-prebuild-flow](analyses/expo-prebuild-flow.md)
