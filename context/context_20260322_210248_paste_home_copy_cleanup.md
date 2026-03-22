# Paste Home Copy Cleanup

## 작업 개요
- Paste 탭에서 `Paste Reference` 카드 위에 있던 중복 헤더/설명 문구를 제거했다.
- Home 탭 헤더의 `Welcome Back!` 문구를 `Welcome!`으로 바꿨다.

## 주요 변경
- `src/app/(tabs)/paste/page.tsx`
  - 페이지 상단의 `Paste Reference` 제목과 `Add a viral video URL to analyze` 설명 블록을 제거했다.
- `src/components/auth/DashboardContent.tsx`
  - Home 헤더 텍스트를 `Welcome!`으로 조정했다.

## 검증
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
  - Next.js dev server 정상 기동 확인
- `curl -I http://127.0.0.1:3000/paste`
  - `200 OK`
- `curl -I http://127.0.0.1:3000/home`
  - `200 OK`

## 메모
- 이번 변경은 카피/레이아웃 단순화만 포함하며 기능 동작에는 영향이 없다.
