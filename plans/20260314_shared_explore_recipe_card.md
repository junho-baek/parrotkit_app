# Explore/Recipes 공통 카드 컴포넌트화

## 배경
- Explore 탭의 숏폼 카드 UI가 `ExploreContent` 내부에 인라인으로 구현되어 있음.
- Recipes 탭도 유사한 비주얼 카드 구조를 별도로 구현하고 있어 중복이 발생함.
- 동일 UI 패턴을 양쪽 탭에서 재사용할 수 있도록 컴포넌트 추출이 필요함.

## 목표
- Explore 카드(썸네일/오버레이/배지/통계/하단 액션 버튼)를 독립 공통 컴포넌트로 분리한다.
- Recipes 탭에서도 동일한 카드 컴포넌트를 사용하도록 교체한다.
- 기존 인터랙션(미리보기 클릭, Like/View 버튼 클릭, 모달 오픈, 상태 반영)을 유지한다.

## 범위
- 공통 카드 컴포넌트 신규 추가
- Explore 탭 카드 렌더링 로직 교체
- Recipes 탭(실사용 경로) 카드 렌더링 로직 교체
- 타입체크/빌드 검증

## 변경 파일
- `src/components/common/ShortVideoCard.tsx` (신규)
- `src/components/common/index.ts` (export 추가)
- `src/components/auth/ExploreContent.tsx` (공통 카드 적용)
- `src/components/auth/DashboardContent.tsx` (Recipes 카드 공통화 적용)
- `context/context_20260314_*.md` (작업 결과 기록)

## 테스트
- `npm run build`
- 필요 시 `npm run lint` (시간/노이즈 고려)

## 롤백
- 공통 컴포넌트 도입 전 상태로 각 화면의 인라인 JSX를 복원한다.
- `git revert <commit>` 또는 파일 단위 수동 롤백.

## 리스크
- Recipes 카드의 메타 정보 표현(날짜/씬수)이 기존과 달라질 수 있음.
- 카드 액션 버튼 스타일 변경 시 사용자 인지에 영향이 있을 수 있음.
- 이미지 로드 실패 fallback 처리 누락 시 썸네일이 비어 보일 수 있음.

## 결과
- 완료
- Explore/Recipes 카드가 `ShortVideoCard`로 공통화됨
- 검증: `npm run build` 통과
- 연결 context: `context/context_20260314_035356_shared_explore_recipe_card.md`
