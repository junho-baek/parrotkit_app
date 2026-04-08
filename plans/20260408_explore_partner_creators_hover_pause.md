# Explore Partner Creators Hover Pause

## 배경
- `/explore` 상단 파트너 크리에이터 마퀴가 자동으로 흐르지만, 사용자가 특정 아바타를 읽거나 볼 때 잠시 멈추는 인터랙션이 있으면 더 편합니다.

## 목표
- 파트너 크리에이터 마퀴에 마우스 hover 시 애니메이션이 멈추도록 합니다.

## 범위
- `src/components/auth/ExploreContent.tsx`
- `context/context_20260408_explore_partner_creators_hover_pause.md`

## 변경 파일
- `plans/20260408_explore_partner_creators_hover_pause.md` (신규)
- `src/components/auth/ExploreContent.tsx` (수정 예정)
- `context/context_20260408_explore_partner_creators_hover_pause.md` (작성 예정)

## 테스트
- 로컬 `/explore`에서 파트너 크리에이터 스트립 hover 시 애니메이션 정지 여부 수동 확인
- 별도 build/test는 사용자 요청 시 진행

## 롤백
- 마퀴 hover pause 스타일을 제거하고 항상 흐르는 상태로 되돌림

## 리스크
- 모바일 터치 환경에서는 hover 개념이 약해 정지 효과가 데스크톱 중심일 수 있음
