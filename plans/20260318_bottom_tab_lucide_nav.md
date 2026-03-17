# Bottom Tab Lucide Navigation

## 배경
- 기존 하단 탭 네비게이션이 PNG 이미지 아이콘(`/Home.png` 등)에 의존하고 있다.
- 사용자 요청에 따라 Lucide Icons의 `House`, `Search`, `Link`, `FileText`, `User`를 사용한 하단 네비게이션으로 전환이 필요하다.

## 목표
- 기존 탭 구조와 이벤트 로깅은 유지하면서 하단 네비게이션 아이콘을 Lucide 기반으로 교체한다.
- 모바일 앱 셸에 어울리는 시각적 완성도를 유지한다.

## 범위
- `lucide-react` 의존성 추가
- `BottomTabBar` 아이콘/스타일 재구성
- 빌드 검증

## 변경 파일
- `package.json`
- `package-lock.json`
- `src/components/common/BottomTabBar.tsx`
- `plans/20260318_bottom_tab_lucide_nav.md`
- `context/context_20260318_*_bottom_tab_lucide_nav.md`

## 테스트
- `npm run build`

## 롤백
- `lucide-react` 의존성 제거
- `BottomTabBar`를 PNG 이미지 아이콘 버전으로 복원

## 리스크
- active/hover 상태 색상과 크기 변화가 기존 PNG 자산보다 다르게 느껴질 수 있다.
- `lucide-react` 추가로 번들 구성에 미세한 변화가 생길 수 있다.

## 결과
- 완료
- `lucide-react` 추가 및 `BottomTabBar`를 Lucide 아이콘 기반으로 재구성
- `npm run build` 통과
- Playwright 모바일 QA 스크린샷 생성: `output/playwright/20260318_bottom_tab_lucide_nav_explore_clean.png`
- Notion 업로드 완료: `https://www.notion.so/ParrotKit-Bottom-Tab-Lucide-Nav-QA-326fdc54bb728106bfacd6ff54a6cf45`
- 연결 context: `context/context_20260318_024442_bottom_tab_lucide_nav.md`
