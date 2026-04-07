# Recipe Detail Design Review

## 배경
- 레시피 카드 진입 후 보이는 `analysis / recipe / prompter` 상세 화면이 기능은 많지만 정보 위계와 시선 흐름이 약하다.
- 특히 recipe 탭의 cue 선택 영역과 하단 보조 패널이 본문과 경쟁하면서 화면이 복잡하게 느껴질 가능성이 크다.

## 목표
- 상세 화면이 "씬을 이해하고, 바로 촬영 준비를 하는 공간"으로 읽히도록 레이아웃과 시각 위계를 재정렬한다.
- 분석, 레시피, 프롬프터 탭 각각의 목적이 더 분명하게 느껴지도록 카드 구성과 인터랙션 밀도를 다듬는다.

## 범위
- `src/components/common/RecipeResult.tsx`
- 필요 시 `src/components/common/CameraShooting.tsx`
- 작업 기록 문서

## 변경 파일
- 상세 헤더, 탭, 본문 카드 레이아웃 재구성
- cue / recipe 정보의 시각적 그룹핑 및 밀도 조절
- 필요 시 prompter 화면의 chrome 및 편집 패널 시각 정리

## 테스트
- `npx eslint src/components/common/RecipeResult.tsx src/components/common/CameraShooting.tsx`
- `npx tsc --noEmit --pretty false`
- 로컬 브라우저 수동 QA
  - mock recipe detail에서 analysis / recipe / prompter 탭 흐름 확인
  - mobile 폭에서도 주요 정보 위계 유지 확인

## 롤백
- 상세 화면 개편이 과하면 기존 카드 구조로 되돌리고, cue 밀도 완화 정도만 남긴다.

## 리스크
- 레이아웃 개편 범위가 커지면 기존 상태 의존 로직과 하단 planner 패널의 위치 관계가 흔들릴 수 있다.
- prompter 편집 기능을 살리면서 시각만 정리해야 하므로, 기능 regression 없이 구조를 바꿔야 한다.

## 결과
- 완료
- 상세 화면 공통 header를 scene pager + stage tabs + planner CTA 구조로 재배치했다.
- `analysis` 탭은 hero / motion summary / transcript / why it works 위계로 다시 정리했다.
- `recipe` 탭은 visible cue와 optional cue를 분리해서 과밀한 cue grid를 줄였다.
- `prompter` 탭은 embedded chrome을 줄이고 bottom control tray / layout drawer를 더 일관된 구도로 정리했다.

## 연결 context
- `context/context_20260408_050508_recipe_detail_design_review.md`
