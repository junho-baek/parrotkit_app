# Context - Bottom tab Lucide navigation 적용

## 작업 배경
- 사용자 요청: 하단 네비게이션 바에 Lucide Icons의 `House`, `Search`, `Link`, `FileText`, `User`를 사용해 달라는 요청.
- 기존 구현은 `/Home.png`, `/Explore.png` 등 PNG 아이콘 자산에 의존하고 있었다.

## 변경 목표
- 기존 탭 구조와 이벤트 로깅은 유지하면서 Lucide 기반 아이콘 네비게이션으로 전환.
- 모바일 앱 셸에서 액티브 탭이 더 또렷하게 보이도록 스타일 개선.

## 변경 내용
- 파일: `package.json`, `package-lock.json`
  - `lucide-react` 의존성 추가
- 파일: `src/components/common/BottomTabBar.tsx`
  - PNG 이미지 기반 탭 아이콘 제거
  - `House`, `Search`, `Link`, `FileText`, `User` 아이콘으로 교체
  - active/inactive 상태에 맞는 아이콘 컨테이너, 라벨, 그림자 스타일 재구성
  - 기존 키보드 오픈 시 네비 숨김 로직과 GA 이벤트 로깅 유지
- 파일: `plans/20260318_bottom_tab_lucide_nav.md`
  - 작업 계획 문서 작성
- 파일: `output/playwright/20260318_bottom_tab_lucide_nav_explore_clean.png`
  - Explore 탭 기준 모바일 뷰 QA 스크린샷 생성
- 파일: `output/reports/20260318_parrotkit_bottom_tab_lucide_nav_qa.md`
  - QA 요약 리포트 작성

## 검증
- `npm run build` 성공
- `npx playwright install`로 로컬 브라우저 바이너리 설치
- `npx playwright screenshot -b chromium --device="iPhone 13" --load-storage output/playwright/20260318_bottom_tab_lucide_nav_storage.json --wait-for-timeout 2000 --wait-for-selector "nav" http://localhost:3000/explore output/playwright/20260318_bottom_tab_lucide_nav_explore_clean.png`
  - 하단 탭 5개 노출 및 Explore 활성 상태 시각 확인

## Notion 업로드
- `make notion-upload-dry-run REPORT=output/playwright/20260318_bottom_tab_lucide_nav_explore_clean.png SUMMARY_MD=output/reports/20260318_parrotkit_bottom_tab_lucide_nav_qa.md`
  - 메타데이터 파싱 확인 완료
- `make notion-upload REPORT=output/playwright/20260318_bottom_tab_lucide_nav_explore_clean.png SUMMARY_MD=output/reports/20260318_parrotkit_bottom_tab_lucide_nav_qa.md REPORT_TYPE=qa TITLE="ParrotKit Bottom Tab Lucide Nav QA" STATUS=Blocked NOTES="Lucide bottom tab navigation update QA"`
  - 업로드 성공
  - Notion page: `https://www.notion.so/ParrotKit-Bottom-Tab-Lucide-Nav-QA-326fdc54bb728106bfacd6ff54a6cf45`

## 기대 동작
- 하단 네비게이션이 Lucide 아이콘 기반으로 렌더링된다.
- 현재 탭은 강조된 아이콘 카드와 라벨로 명확히 구분된다.
- 입력 포커스/키보드 활성화 시 기존처럼 하단 네비가 숨겨진다.
