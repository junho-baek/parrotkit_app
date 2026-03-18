# UI QA Follow-ups Batch

## 배경
- QA 피드백으로 하단 네비게이션, shooting/export 흐름, 입력 필드 스타일, 로그인 유지, My Page 구성, pricing 내비게이션, CTA 색상에 대한 후속 수정이 필요해졌다.
- 현재 기본 검증 정책은 `dev` 기준 QA이며, 이번 작업은 Notion 업로드 없이 로컬 검증과 git push까지 진행한다.

## 목표
- 하단 네비게이션 아이콘 내부 박스를 완전히 제거한다.
- shooting 후 local 다운로드가 막히는 흐름을 완화하고 `Retry Shoot` 노출 조건을 개선한다.
- 로그인 장기 유지 흐름을 개선한다.
- `/paste`, `/my`, `/pricing`, recipe CTA들의 UI 피드백을 반영한다.

## 범위
- `BottomTabBar`, shooting/export 흐름, auth client session sync, paste form, My Page, pricing, recipe CTA 색상 수정
- `dev` 기반 QA 및 스크린샷 확인

## 변경 파일
- `src/components/common/BottomTabBar.tsx`
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx` 또는 관련 shooting/export/auth 파일
- `src/components/auth/URLInputForm.tsx`
- `src/components/auth/DashboardContent.tsx`
- `src/app/pricing/page.tsx`
- auth helper / layout 관련 파일
- `plans/20260318_ui_qa_followups_batch.md`
- `context/context_20260318_*_ui_qa_followups_batch.md`

## 테스트
- `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- Playwright 기반 로컬 QA

## 롤백
- 각 UI/세션/shooting 변경을 개별 파일 단위로 이전 상태로 복원

## 리스크
- session refresh를 공통화하면서 기존 수동 토큰 처리와 경합할 수 있다.
- shooting/export 보완 시 서버 저장 상태와 로컬 저장 상태가 분리될 수 있으므로 UX 문구를 명확히 해야 한다.

## 결과
- 완료
- 요약:
  - 하단 네비 active/inactive 아이콘 내부 박스를 제거하고 아이콘만 보이도록 정리했다.
  - `/paste`, `View Recipe`, recipe `Download` CTA를 브랜드 그라디언트 톤으로 통일했다.
  - `Liked Videos`를 `Quick Actions` 위로 이동하고, Pricing 상/하단 뒤로가기를 `/my` 기준으로 변경했다.
  - 클라이언트 세션 refresh helper와 sync 컴포넌트를 추가해 만료 토큰 자동 갱신 경로를 공통화했다.
  - recipe capture 업로드 실패 시 로컬 저장분을 유지하고 `Retry Shoot` 대신 로컬 저장 안내가 우선 보이도록 조정했다.
- 연결 context: `context/context_20260318_155057_ui_qa_followups_batch.md`
