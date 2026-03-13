# Context - Shared Explore/Recipes Video Card Component

## 작업 배경
- Explore 탭 카드 UI가 `ExploreContent` 내부에 인라인으로 중복 구현되어 있었다.
- Recipes 탭(실사용: `DashboardContent`의 `Recipes`)도 유사한 카드 UI를 별도로 가지고 있어 유지보수 비용이 높았다.
- 사용자 요청: 카드 자체를 컴포넌트화하고 Recipes에서도 동일 카드 UI를 재사용.

## 변경 목표
- 공통 숏폼 카드 컴포넌트로 추출.
- Explore/Recipes 양쪽 탭에서 동일 카드 컴포넌트를 사용하도록 통일.
- 기존 액션 동작(Explore: Like, Recipes: View Recipe)을 유지.

## 변경 내용
- 신규 파일: `src/components/common/ShortVideoCard.tsx`
  - 썸네일/그라데이션/중앙 플레이 오버레이/상단 배지/하단 메트릭/액션 버튼을 하나의 컴포넌트로 제공.
  - 이미지 로드 실패 시 fallback UI 렌더링 지원.
- 수정: `src/components/common/index.ts`
  - `ShortVideoCard` export 추가.
- 수정: `src/components/auth/ExploreContent.tsx`
  - 기존 인라인 카드 JSX 제거.
  - `ShortVideoCard`를 사용해 Trending 카드 렌더링.
  - Like 상태별 버튼 스타일 및 count 표기 유지.
- 수정: `src/components/auth/DashboardContent.tsx` (`Recipes` 영역)
  - 기존 인라인 Recipe 카드 JSX 제거.
  - `ShortVideoCard` 기반으로 교체.
  - 카드 클릭/버튼 클릭 모두 기존 `handleView(recipe)`로 연결.

## 검증
- `npm run build` 성공

## 결과
- Explore/Recipes 카드 UI를 동일 컴포넌트로 재사용하도록 정리 완료.
- 이후 카드 레이아웃/오버레이 변경은 `ShortVideoCard` 중심으로 일괄 반영 가능.

## 메모
- 이번 작업은 UI 컴포넌트 재사용 범위로, DB 스키마/타입 계약 변경 없음.
