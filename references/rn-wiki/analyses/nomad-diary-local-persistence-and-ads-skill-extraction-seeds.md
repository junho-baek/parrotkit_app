# nomad-diary 로컬 퍼시스턴스·광고 스킬 추출 후보 | Nomad Diary Local Persistence and Ads Skill Extraction Seeds

## 범위

- `raw/nomad-diary/` 10개 커밋에서 local persistence, 작은 작성 폼, `LayoutAnimation`, 광고 SDK, reward 이벤트 흐름 관련 규칙만 다시 모은다.
- 목적은 이 라운드의 교훈을 `oh-my-rn`으로 승격하기 쉬운 규칙 묶음으로 압축하는 것이다.

## 짧은 결론

- `nomad-diary` 라운드의 가장 강한 원재료는 다섯 축으로 정리된다.
  - 저장소는 query shape로 고른다
  - DB connection owner와 screen command trigger를 분리한다
  - local list는 reactive query가 직접 구동한다
  - simple reflow만 `LayoutAnimation`에 맡긴다
  - 광고는 native build boundary이고, rewarded flow는 optional gate + event phase 모델로 읽는다

## 규칙 묶음

### 1. Local Persistence Boundary

- 대표 문서:
  - [Realm으로 여는 기기 로컬 객체 DB 부트스트랩](device-local-object-db-bootstrap-with-realm.md)
  - [Realm 컨텍스트 주입과 쓰기 트랜잭션](realm-context-injection-and-write-transactions.md)
- 추출 가능한 규칙:
  - 저장소는 습관이 아니라 query shape로 고른다.
  - key-value와 local DB를 같은 문제처럼 다루지 않는다.
  - provider가 connection을 소유하고 screen은 command를 트리거한다.

### 2. Reactive Local Lists

- 대표 문서:
  - [반응형 Realm 컬렉션 읽기와 리스트 렌더링](reactive-realm-collection-reading-and-list-rendering.md)
  - [탭 삭제와 LayoutAnimation 리스트 전환](tap-to-delete-with-layout-animation.md)
- 추출 가능한 규칙:
  - reactive query result를 list UI에 직접 연결한다.
  - live collection을 useState에 불필요하게 다시 복사하지 않는다.
  - destructive action은 confirm/undo와 함께 설계한다.

### 3. Small Compose Forms

- 대표 문서:
  - [감정 선택기와 검증된 저널 폼](emotion-picker-and-validated-journal-form.md)
- 추출 가능한 규칙:
  - 작은 작성 폼은 local state로 시작한다.
  - discrete selection과 free-form text를 분리한다.
  - disabled state와 validation affordance를 같이 둔다.

### 4. Ads Build Boundary

- 대표 문서:
  - [모바일 광고 SDK 설치와 빌드 경계](mobile-ads-sdk-installation-and-build-boundaries.md)
  - [저널 플로우의 배너 광고와 리워드 게이트](banner-ads-and-rewarded-gates-in-journal-flow.md)
- 추출 가능한 규칙:
  - ads SDK는 native build boundary다.
  - config plugin, app id, test ids, ATT, consent를 같이 본다.
  - banner는 stable slot, rewarded는 optional gate에 더 잘 맞는다.

### 5. Event-gated Side Effects

- 대표 문서:
  - [저장 전 리워드 광고 이벤트 시퀀싱](rewarded-ad-event-sequencing-before-persist.md)
- 추출 가능한 규칙:
  - subscribe before show
  - phase 모델 명시
  - cleanup와 duplicate submit guard

## 현재 v1로 승격한 규칙

- `choose-local-persistence-by-query-shape-not-habit`
- `db-provider-owns-connection-screen-triggers-command`
- `reactive-local-query-drives-list-ui`
- `layoutanimation-for-simple-list-reflow-only`
- `small-compose-forms-start-with-local-state`
- `expo-sqlite-migrations-live-in-oninit-with-user-version`
- `small-compose-forms-handle-keyboard-and-local-first-commit`
- `ads-sdk-is-a-native-build-boundary`
- `rewarded-ads-should-gate-optional-value-not-core-crud`
- `subscribe-before-show-for-event-gated-side-effects`

## 다음 액션

- 상위 규칙은 이미 `~/.codex/skills/oh-my-rn/references/v1-rules.md`로 승격했다.
- supporting note는
  `~/.codex/skills/oh-my-rn/references/local-persistence-and-monetization.md`
  에 따로 정리했다.
- 다음 단계는:
  - local-first list mutation을 optimistic local write, undo, sync queue까지 더 넓히기
  - `expo-sqlite` migration 규칙을 multi-table / seed / rollback 전략까지 넓히기
  - ads rule을 product policy / consent checklist와 더 직접 연결하기

## 관련 페이지

- [nomad-diary 로컬 데이터 학습 계획](nomad-diary-local-data-study-plan.md)
- [noovies UI·데이터 스킬 추출 후보](noovies-ui-and-data-skill-extraction-seeds.md)
- [애니메이션·제스처 스킬 추출 후보](animation-and-gesture-skill-extraction-seeds.md)
