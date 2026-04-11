# 애니메이션·제스처 스킬 추출 후보 | Animation and Gesture Skill Extraction Seeds

## 범위

- `raw/nomad-lang/`의 20개 애니메이션/제스처 분석 문서를 다시 훑으며,
  나중에 개인 RN 스킬 `oh-my-rn`으로 승격하기 쉬운 원재료를 정리한다.
- 이 문서는 각 문서에 추가한 `## 스킬 추출 후보` 섹션의 상위 요약본이다.

## 짧은 결론

- 이번 라운드에서 가장 강한 스킬 원재료는
  `animation value lifecycle`,
  `single source + derived styles`,
  `gesture phase separation`,
  `swipe deck action pipeline`,
  `drop-zone acceptance / transition separation`
  다섯 축이다.
- 즉 단순히 "옛날엔 PanResponder를 썼다" 수준보다,
  "지금은 어떤 트리거에서 어떤 기본값을 추천할지"로 번역 가능한 규칙이 모이기 시작했다.

## 바로 추출 가능한 규칙 묶음

### 1. 셋업과 런타임 준비

- 핵심 문서:
  - [Expo 기반 애니메이션 샌드박스 부트스트랩](expo-based-animation-sandbox-bootstrap.md)
- 후보 규칙:
  - 애니메이션 중심 Expo 앱은 `create-expo-app`과 visible scaffold로 시작한다.
  - native customization이 실제로 필요할 때만 prebuild를 연다.
  - Reanimated / Gesture Handler는 초반 runtime dependency로 함께 본다.

### 2. animation value 수명과 파생 스타일

- 핵심 문서:
  - [수동 프레임 루프와 Animated.Value의 도입](manual-frame-loop-and-animated-value-introduction.md)
  - [Animated.Value와 animatable component의 기본 규칙](animated-value-and-create-animated-component-basics.md)
  - [애니메이션 상태 토글과 stable value 수명](animation-state-toggle-and-stable-value-lifecycle.md)
  - [단일 위치 값에서 여러 스타일 보간](single-value-to-multi-style-interpolation.md)
  - [ValueXY와 다중 속성 보간](valuexy-and-multi-property-interpolation.md)
- 후보 규칙:
  - 프레임성 값은 React state가 아니라 animation value로 보관한다.
  - animation source는 stable ref/shared value로 유지한다.
  - 시각 피드백 여러 개가 같은 움직임을 설명한다면 source value는 하나로 두고 나머지는 파생한다.
  - semantic UI state와 motion progress를 분리한다.

### 3. gesture 추적과 release 정착

- 핵심 문서:
  - [PanResponder 기반 드래그 추적](panresponder-driven-drag-tracking.md)
  - [드래그 해제 후 스프링 복귀](spring-back-on-gesture-release.md)
  - [드래그 누적을 위한 setOffset과 flattenOffset](drag-offset-accumulation-with-setoffset-and-flattenoffset.md)
- 후보 규칙:
  - 새 drag interaction은 `Gesture.Pan()` + shared value를 기본값으로 삼는다.
  - gesture flow는 track, decide, settle 세 단계로 나눈다.
  - 누적형 drag는 base position과 current translation을 분리한다.

### 4. swipe card와 deck progression

- 핵심 문서:
  - [스와이프 카드의 압축·수평 드래그 기초](swipe-card-foundation-with-scale-and-horizontal-drag.md)
  - [회전 피드백과 스와이프 dismiss 임계값](swipe-dismiss-thresholds-and-rotation-feedback.md)
  - [스택형 카드 깊이감과 명시적 액션 버튼](stacked-card-depth-and-explicit-action-buttons.md)
  - [카드 덱 순환과 데이터 기반 아이콘 시퀀스](card-deck-index-cycling-and-data-driven-icon-sequences.md)
  - [dismiss 전환을 위한 스프링 정지 임계값 튜닝](spring-rest-threshold-tuning-for-dismiss-transitions.md)
- 후보 규칙:
  - swipe card는 먼저 interaction axis를 하나로 제한한다.
  - dismiss는 거리 비율과 velocity를 함께 본다.
  - swipe와 explicit action button은 같은 dismiss pipeline으로 묶는다.
  - deck progression은 animation completion 뒤 한 경로에서 처리한다.
  - spring tuning은 감각 언어와 completion timing을 함께 다룬다.

### 5. drag-and-drop 분류형 상호작용

- 핵심 문서:
  - [분류형 드래그를 위한 세로 드롭존 셸](vertical-drop-zone-shell-for-classification-drag.md)
  - [중앙 드래그 카드와 드롭 타깃 상호작용 기초](draggable-center-card-and-drop-target-interaction-foundation.md)
  - [드롭존 확대 피드백과 승인 드롭 시퀀스](drop-zone-scaling-and-accepted-drop-sequences.md)
  - [드롭 완료 후 다음 항목으로 진행하는 상태 전이](next-item-advance-after-drop-completion.md)
- 후보 규칙:
  - 분류형 drag-and-drop은 gesture보다 먼저 drop zone semantics를 고정한다.
  - hover 강조, acceptance 판정, 성공 후 transition을 분리한다.
  - acceptance는 가능하면 geometry 기반으로 판단한다.
  - drop completion 뒤 animation reset과 data advance를 하나의 전이 함수로 묶는다.

## 추천 스킬 규칙명 초안

- `animation-value-instead-of-react-state`
- `stable-animation-source-lifecycle`
- `single-motion-source-derived-styles`
- `gesture-pan-over-panresponder`
- `gesture-release-track-decide-settle`
- `accumulated-drag-base-plus-translation`
- `swipe-card-single-axis-first`
- `swipe-dismiss-ratio-plus-velocity`
- `deck-dismiss-single-action-pipeline`
- `deck-progression-after-animation-completion`
- `drop-zone-semantics-before-gesture`
- `drop-hover-accept-transition-separation`
- `drop-geometry-over-axis-threshold`

## 지금 기준 우선 승격 후보

### 1. `single-motion-source-derived-styles`

- 이유:
  interpolation, swipe, drop-zone feedback까지 반복해서 재사용된다.

### 2. `gesture-pan-over-panresponder`

- 이유:
  레거시 RN 학습과 현재식 RN 구현을 가르는 가장 분명한 기준선 중 하나다.

### 3. `gesture-release-track-decide-settle`

- 이유:
  drag, swipe, drop 어디에나 적용되는 interaction phase 모델이다.

### 4. `deck-progression-after-animation-completion`

- 이유:
  animation과 데이터 상태를 연결하는 규칙이라 제품 코드에서 재사용성이 높다.

### 5. `drop-hover-accept-transition-separation`

- 이유:
  drag-and-drop UI를 설계할 때 흔히 뒤섞이는 책임을 잘 잘라준다.

## 현재 v1로 먼저 승격한 규칙

- `single-motion-source-derived-styles`
- `gesture-release-track-decide-settle`

## 다음 액션

- 이 후보들을 바탕으로 `~/.codex/skills/oh-my-rn` 초안을 만들었다.
- 상위 규칙은 `~/.codex/skills/oh-my-rn/references/v1-rules.md`로 먼저 승격해
  rule / why / avoid / exceptions / example 형태로 다듬었다.
- 다음 단계는:
  - `deck-progression-after-animation-completion`,
    `drop-hover-accept-transition-separation`도 같은 형식으로 승격하기
  - 실제 자주 쓰는 출력 포맷 예시 추가
  - 필요하면 references를 더 세분화하기

## 관련 페이지

- [nomad-lang 애니메이션 학습 계획](nomad-lang-animation-study-plan.md)
- [Expo 기반 애니메이션 샌드박스 부트스트랩](expo-based-animation-sandbox-bootstrap.md)
- [PanResponder 기반 드래그 추적](panresponder-driven-drag-tracking.md)
- [드롭존 확대 피드백과 승인 드롭 시퀀스](drop-zone-scaling-and-accepted-drop-sequences.md)
