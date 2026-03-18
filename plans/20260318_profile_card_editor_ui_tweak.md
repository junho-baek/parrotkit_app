# 프로필 카드 편집 진입 UI 미세조정

## 배경
- 마이페이지 프로필 카드에서 추가 프로필 정보 요약이 카드 내부에 상시 노출되어, 카드 클릭 시에만 편집 정보가 보여야 한다는 의도와 달랐다.
- `Tap to edit` 텍스트 배지도 시각적으로 과해 보여, 더 단순한 우측 화살표 인디케이터로 교체가 필요했다.

## 목표
- 프로필 카드는 기존 레이아웃(아바타/이름/이메일/통계 카드)으로 유지한다.
- 프로필 상세 입력 정보는 카드 내부 상시 노출하지 않는다.
- 편집 진입 힌트는 `Tap to edit` 대신 오른쪽 화살표로 단순화한다.

## 범위
- `src/components/auth/DashboardContent.tsx` 내 프로필 카드 렌더링 블록만 조정
- 기존 카드 클릭 시 편집 모달 오픈 동작은 유지

## 변경 파일
- `src/components/auth/DashboardContent.tsx`
- `plans/20260318_profile_card_editor_ui_tweak.md`
- `context/context_20260318_*_profile_card_editor_ui_tweak.md`

## 테스트
- `npx tsc --noEmit`
- `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- `/my` 화면에서 카드 기본 UI 확인 + 카드 클릭 시 편집 모달 오픈 확인

## 롤백
- `DashboardContent.tsx`의 프로필 카드 영역을 직전 커밋 상태로 복원

## 리스크
- 화살표 아이콘만으로 편집 진입 의도가 약해질 수 있다.
- 상시 요약 제거로 프로필 상세값 확인은 모달 진입 이후에만 가능하다.

## 결과
- 완료
- 요약:
  - 프로필 카드의 상시 노출 상세 블록을 제거해 기존 카드 UI로 복원했다.
  - 편집 진입 힌트는 텍스트 대신 우측 화살표 인디케이터로 단순화했다.
  - 카드 클릭 시 편집 모달 오픈 동작은 유지했다.
- 연결 context:
  - `context/context_20260318_203630_profile_card_editor_ui_tweak.md`
