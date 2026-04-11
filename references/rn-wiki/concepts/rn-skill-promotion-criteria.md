# RN 스킬 승격 기준 | RN Skill Promotion Criteria

## 왜 이 문서가 필요한가

- 위키에 좋은 문장이 많다고 해서 전부 스킬이 되지는 않는다.
- 스킬은 반복해서 꺼내 쓰는 판단 규칙이어야 하고, 문서 원문보다 더 짧고 더 재사용 가능해야 한다.
- 이 문서는 어떤 교훈을 `oh-my-rn`으로 바로 승격하고, 어떤 교훈은 seed로 남길지 정하는 기준이다.

## 현재 baseline

- 현재 RN 비교 기준은 [`vercel-react-native-skills`](/Users/junho/.agents/skills/vercel-react-native-skills/SKILL.md)다.
- `oh-my-rn`은 그 baseline 위에 얹는 personal overlay다.
- 따라서 승격 판단도 먼저 "baseline과 같은가", "baseline을 보완하는가", "의도적 차이인가"를 본다.

## 승격 판단의 핵심 질문

### 1. 반복되는가

- 한 문서에서만 번뜩인 아이디어면 아직 seed에 가깝다.
- 여러 커밋, 여러 화면, 여러 프로젝트에서 다시 등장하면 승격 후보가 된다.

### 2. 선택을 바꾸는가

- 읽고 나서 실제 구현 기본값이 바뀌는 규칙인가?
- 예:
  - `TouchableOpacity`보다 `Pressable`
  - full object params보다 minimal route params
  - local DB 기본값으로 `expo-sqlite`

### 3. 트리거가 분명한가

- "언제 이 규칙을 적용해야 하는가"가 선명해야 한다.
- 트리거가 흐리면 스킬에서 잘 안 꺼내 쓴다.

### 4. 예외를 설명할 수 있는가

- 좋은 규칙은 무조건론이 아니라 default다.
- 언제 예외를 허용하는지까지 짧게 말할 수 있어야 한다.

### 5. 라이브러리 이름보다 문제 구조를 설명하는가

- 특정 버전 API 사용법만 적으면 금방 낡는다.
- 반대로 "owner 분리", "query shape 기준 선택", "phase 분리"처럼 구조를 설명하면 오래 간다.

### 6. baseline과의 관계가 명확한가

- `vercel-react-native-skills`에 이미 있는 규칙이면 중복 승격하지 않는다.
- 다만 우리 문맥에서 더 강한 해석이나 예외 기준이 있으면 overlay 규칙으로 승격할 수 있다.

## 세 단계 분류

### 1. 바로 v1로 승격

- 반복 등장
- 선택을 실제로 바꿈
- 트리거와 예외가 있음
- baseline과 관계가 분명함
- 한두 문장 규칙 이름으로 압축 가능

예:

- `choose-local-persistence-by-query-shape-not-habit`
- `query-refresh-indicator-comes-from-query-state`
- `small-compose-forms-handle-keyboard-and-local-first-commit`

### 2. seed로 남김

- 아직 반복 수가 적음
- 아이디어는 좋지만 예외가 많음
- 현재는 문서 문맥 없이는 오해될 수 있음

예:

- 특정 애니메이션 threshold 수치
- 특정 강의 예제에만 맞는 라이브러리 선택
- 제품 맥락이 강하게 필요한 ad placement 규칙

### 3. 승격하지 않음

- 버전/패키지 이름만 말하는 일회성 메모
- 긴 코드 조각 없이는 의미가 없는 팁
- baseline과 충돌하지만 왜 다른지 설명이 없는 주장

## 실제 체크리스트

- 이 규칙이 두 개 이상 문서에서 반복되었는가
- 현재 baseline 대비 선택 기준을 더 선명하게 만드는가
- 규칙 이름을 kebab-case 한 줄로 지을 수 있는가
- 트리거, 권장 기본값, 안티패턴, 예외, 최소 코드 스케치를 붙일 수 있는가
- 특정 강의가 아니라 다른 RN 앱에도 옮겨 쓸 수 있는가
- 6개월 뒤 다시 봐도 여전히 유효할 가능성이 높은가

## 권장 포맷

스킬 원재료는 아래 다섯 칸으로 압축될 때 승격하기 쉽다.

- 트리거
- 권장 기본값
- 안티패턴
- 예외
- 최소 코드 스케치

이 다섯 칸으로 못 줄어들면 아직 seed일 가능성이 높다.

## baseline과 overlay를 나누는 법

### baseline으로만 두는 경우

- `vercel-react-native-skills`가 이미 충분히 명확하고
- 우리 쪽에서 더할 해석이 거의 없을 때

예:

- `ui-expo-image`
- `ui-pressable`
- `navigation-native-navigators`

### `oh-my-rn`으로 overlay 승격하는 경우

- baseline을 그대로 반복하는 게 아니라
- 레거시 강의 번역 맥락이나 개인 기본값이 추가될 때

예:

- `detail params는 최소 식별자 + optional preview seed`
- `query refresh와 navigator reset을 같은 문제처럼 다루지 않는다`
- `Realm은 학습 대상으로 읽고, 새 Expo 앱 기본 로컬 DB는 SQLite부터 검토`

## 현재 워크스페이스에서의 적용

### noovies 라운드

- navigation, feed virtualization, query-driven refresh, search state 분리, minimal detail params 같은 규칙은 반복성과 선택 전환력이 충분해 승격 가치가 컸다.

### nomad-lang 라운드

- single motion source, track-decide-settle, drop transition phase separation처럼 gesture 구조를 바꾸는 규칙이 승격 가치가 컸다.

### nomad-diary 라운드

- local persistence 선택 기준, DB owner 분리, reactive local query, keyboard-aware local-first compose, ads build boundary는 승격 가치가 컸다.
- 반대로 특정 ad placement 카피나 demo용 UX는 seed로 남기는 편이 더 안전하다.

## 스킬 승격 시 주의점

- 레거시 코드를 "낡았으니 버린다" 식으로 승격하지 않는다.
- baseline과 중복되는 규칙을 다른 이름으로 다시 만들지 않는다.
- 규칙 이름은 개념 중심으로 짓고, 강의 번호나 커밋 해시는 제목으로 올리지 않는다.
- 한 규칙이 너무 많은 예외를 필요로 하면 두 규칙으로 쪼갠다.

## 지금 우리 기본 운영 규칙

- 기준선은 항상 `vercel-react-native-skills`
- 반복 교훈은 먼저 위키 seed 문서에 모음
- 반복성과 트리거가 확인되면 `oh-my-rn/references/v1-rules.md`로 승격
- supporting nuance는 별도 reference 문서에 남김

## 관련 문서

- [개요](../overview.md)
- [RN 학습 워크플로우](rn-study-workflow.md)
- [noovies UI·데이터 스킬 추출 후보](../analyses/noovies-ui-and-data-skill-extraction-seeds.md)
- [애니메이션·제스처 스킬 추출 후보](../analyses/animation-and-gesture-skill-extraction-seeds.md)
- [nomad-diary 로컬 퍼시스턴스·광고 스킬 추출 후보](../analyses/nomad-diary-local-persistence-and-ads-skill-extraction-seeds.md)
