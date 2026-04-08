# Explore Partner Creators Marquee Cleanup

## 배경
- `/explore` 상단 파트너 크리에이터 섹션에 박스형 배경, 보조 문구, `curated` 뱃지가 함께 들어가면서 사용자가 원하는 더 가볍고 동적인 느낌과 거리가 생겼습니다.
- 사용자는 박스선/희끄무리한 배경/보조 문구/뱃지를 제거하고, 옆으로 흐르는 동적 애니메이션을 원합니다.

## 목표
- 파트너 크리에이터 섹션을 박스 없는 마퀴 형태로 단순화합니다.
- `Partner Creators` 제목만 남기고, 아바타 스트립이 자동으로 옆으로 흐르도록 만듭니다.

## 범위
- `src/components/auth/ExploreContent.tsx`
- `context/context_20260408_explore_partner_creators_marquee_cleanup.md`

## 변경 파일
- `plans/20260408_explore_partner_creators_marquee_cleanup.md` (신규)
- `src/components/auth/ExploreContent.tsx` (수정 예정)
- `context/context_20260408_explore_partner_creators_marquee_cleanup.md` (작성 예정)

## 테스트
- 로컬 `/explore` 화면에서 파트너 크리에이터가 자동으로 옆으로 흐르는지 시각 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- Explore 상단 파트너 섹션을 이전의 정적 박스형 레이아웃으로 되돌림

## 리스크
- 자동 마퀴 애니메이션이 일부 사용자에게는 시선 분산으로 느껴질 수 있음
- 외부 이미지 로딩 상태에 따라 흐름이 조금 어색하게 보일 수 있음
