# My FAQ Quick Actions

## 작업 개요
- My 페이지 QA에서 제보된 `Liked Videos` 제목의 회색 표시 가능성을 줄이기 위해 heading/count 색상을 명시적으로 고정했다.
- Pricing 페이지 하단 FAQ는 유지하면서, Quick Actions에서 바로 접근 가능한 별도 `/faq` 페이지를 추가했다.
- FAQ 문구를 공용 데이터/섹션으로 정리해 Pricing과 FAQ 페이지가 같은 내용을 표시하도록 맞췄다.

## 주요 변경
- `src/components/auth/DashboardContent.tsx`
  - `Liked Videos` 제목, 아이콘, 카운트에 `text-gray-900`을 명시해 색상 상속 영향을 줄였다.
  - Quick Actions 최상단에 `View FAQ` 액션을 추가했다.
- `src/lib/faq.ts`
  - FAQ 질문/답변 데이터를 공용 상수로 분리했다.
- `src/components/common/FaqSection.tsx`
  - FAQ 카드 렌더링과 `/faq` 이동 링크를 공용 섹션 컴포넌트로 만들었다.
- `src/app/pricing/page.tsx`
  - 기존 inline FAQ 블록을 `FaqSection`으로 치환해 공용 FAQ를 사용하도록 정리했다.
- `src/app/faq/page.tsx`
  - My 탭에서 진입 가능한 별도 FAQ 페이지를 추가했다.
- `src/components/common/index.ts`
  - `FaqSection` export를 추가했다.

## 검증
- `PATH=/opt/homebrew/bin:$PATH npx eslint src/components/auth/DashboardContent.tsx src/app/pricing/page.tsx src/app/faq/page.tsx src/components/common/FaqSection.tsx src/lib/faq.ts`
  - error 없음
  - 기존 `@next/next/no-img-element` warning 6건 유지
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
  - Next.js dev server 정상 기동 확인
- `curl -I http://127.0.0.1:3000/my`
  - `200 OK`
- `curl -I http://127.0.0.1:3000/pricing`
  - `200 OK`
- `curl -I http://127.0.0.1:3000/faq`
  - `200 OK`

## 메모
- 이번 작업은 UI/라우팅 레벨 변경만 포함하며 API/DB 계약은 바꾸지 않았다.
- `Liked Videos`가 회색으로 보인 원인은 정확한 재현 조건을 찾기 전까지 상속/렌더링 편차 가능성을 우선 차단하는 방식으로 대응했다.
