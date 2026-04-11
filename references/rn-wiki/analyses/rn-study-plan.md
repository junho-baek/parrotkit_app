# RN 학습 계획

## 질문

실제 source study를 시작하기 전에, 이 React Native 학습 워크스페이스는 무엇을 기록해야 할까?

## 답변

이 저장소를 계획 우선 위키로 다룬다. 미래에 볼 소스는 `raw/` 아래에 staged 상태로 두고, 학습 루프와 도구 상태를 먼저 기록하며, 사용자가 명시적으로 시작하기 전까지는 상세한 source summary를 만들지 않는다.

## 근거

- 예정된 레거시 소스: `raw/noovies/`
- 최신 비교 기준: `vercel-react-native-skills`
- 개인용 스킬 축적 대상: `~/.codex/skills/oh-my-rn`
- 학습 워크플로우: [rn-study-workflow](../concepts/rn-study-workflow.md)

## 학습 입력값

- 나중에 학습 소스로 사용할 레거시 React Native 코스 프로젝트
- 최신 React Native best practice를 비교 기준으로 삼는 가이드
- 반복되는 교훈을 모아둘 개인용 스킬
- 이 워크스페이스 전용 원격 저장소: `https://github.com/junho-baek/RNPrac.git`
- hands-on bare RN 샌드박스: `AwesomeProject/`
- hands-on Expo 샌드박스: `nomad-diary/`

## 저장 원칙

- 소스 저장소와 스냅샷은 `raw/` 아래에 둔다.
- staged 소스는 아직 ingest가 끝난 소스로 취급하지 않는다.
- 계획 결정, 질문, 설정 상태는 `wiki/analyses/`에 저장한다.
- 오래 남을 학습 패턴은 `wiki/concepts/`에 저장한다.

## 예정된 루프

1. 환경 설정을 마치고 Android/iOS 시뮬레이터가 모두 동작하는지 확인한다.
2. 첫 실제 학습 범위를 정한다.
3. 해당 범위에 필요한 파일만 읽는다.
4. source note, concept note, 최신화 관찰 메모를 작성한다.
5. 반복되는 교훈은 개인용 스킬로 추출한다.

## 다음 단계

- 사용자가 시작하겠다고 하면 첫 챕터 또는 기능 노트를 만든다.
- 개인용 스킬을 얼마나 일반화할지, Nicolas 강의 스타일에 얼마나 맞출지 결정한다.
- `AwesomeProject/`를 bare RN 빌드, Pods, Metro 학습용 샌드박스로 유지한다.
- `nomad-diary/`를 Expo, `prebuild`, `expo run:ios` 흐름 학습용 샌드박스로 유지한다.
- 템플릿 옵션 없이 시작한 Expo 앱도 `prebuild`로 네이티브 단계까지 가져갈 수 있다는 점을 기준 지식으로 남긴다.
