# My FAQ Quick Actions

## 배경
- My 페이지 QA에서 `Liked Videos` 제목이 회색으로 읽히는 경우가 보고됐다.
- FAQ는 현재 pricing 페이지 하단에만 있어 접근성이 낮고, Quick Actions에서 바로 들어갈 별도 FAQ 탭/페이지 요구가 생겼다.

## 목표
- `Liked Videos` 제목/카운트 색을 명시적으로 고정한다.
- pricing 내 FAQ는 유지하되, 별도 `/faq` 페이지를 추가한다.
- My 페이지 Quick Actions에 FAQ 진입 액션을 추가한다.

## 범위
- `DashboardContent`의 liked videos heading/quick actions 수정
- FAQ 공용 데이터/리스트 분리
- `/faq` 페이지 추가
- pricing 페이지 FAQ를 공용 섹션으로 치환

## 변경 파일
- `plans/20260322_my_faq_quick_actions.md`
- `src/components/auth/DashboardContent.tsx`
- `src/app/pricing/page.tsx`
- `src/app/faq/page.tsx`
- `src/components/common/*` 또는 `src/lib/*`
- `context/context_20260322_*_my_faq_quick_actions.md`

## 테스트
- `PATH=/opt/homebrew/bin:$PATH npx eslint ...`
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- My / Pricing / FAQ 페이지 로컬 QA

## 롤백
- FAQ 전용 페이지 제거
- Quick Actions FAQ 링크 제거
- pricing inline FAQ 블록으로 복원

## 리스크
- FAQ를 공용화하는 과정에서 pricing 페이지 spacing이 미세하게 바뀔 수 있다.

## 결과
- 완료
- `Liked Videos` heading에 명시 색상을 부여해 회색으로 흐려 보이던 케이스를 방지했다.
- My 페이지 Quick Actions에 `/faq` 진입 액션을 추가했다.
- FAQ 문구를 `src/lib/faq.ts`로 공용화하고, pricing 페이지와 신규 `/faq` 페이지가 같은 FAQ 섹션을 사용하도록 정리했다.

## 연결 context
- `context/context_20260322_205956_my_faq_quick_actions.md`
