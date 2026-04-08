# Explore Partner Creators Strip

## 배경
- `/explore` 상단은 현재 Explore 헤더와 카테고리 필터, 트렌딩 카드만 있어 레퍼런스처럼 자주 보는 파트너 크리에이터 영역이 없습니다.
- 사용자는 상단에 영어 라벨과 하트 이모지를 사용한 `Partner Creators` 스트립을 원합니다.

## 목표
- Explore 상단에 수평 스크롤형 `Partner Creators` UI를 추가합니다.
- 각 파트너 크리에이터는 아바타와 이름을 가볍게 훑어볼 수 있도록 배치합니다.

## 범위
- `src/components/auth/ExploreContent.tsx`
- `context/context_20260408_explore_partner_creators_strip.md`

## 변경 파일
- `plans/20260408_explore_partner_creators_strip.md` (신규)
- `src/components/auth/ExploreContent.tsx` (수정 예정)
- `context/context_20260408_explore_partner_creators_strip.md` (작성 예정)

## 테스트
- 로컬 `/explore` 화면에서 상단 파트너 크리에이터 스트립 시각 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- Explore 상단의 파트너 크리에이터 섹션을 제거하고 기존 헤더-카테고리 구조로 되돌림

## 리스크
- 상단 콘텐츠가 늘어나면서 첫 화면 밀도가 높아질 수 있음
- 정적 파트너 데이터이므로 이후 실제 데이터 연동이 필요할 수 있음
