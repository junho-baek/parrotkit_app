# Paste Home Copy Cleanup

## 배경
- Paste 탭 상단에 같은 의미의 헤더/설명 문구가 반복되어 정보가 중복된다.
- Home 탭 인사 문구에서 `Welcome back` 대신 더 간단한 톤이 필요하다.

## 목표
- Paste 탭 상단 중복 문구를 제거해 `Paste Reference` 카드부터 바로 보이게 한다.
- Home 헤더 문구를 `Welcome!` 기준으로 단순화한다.

## 범위
- Paste 탭 페이지 상단 헤더 정리
- Home 헤더 텍스트 수정

## 변경 파일
- `plans/20260322_paste_home_copy_cleanup.md`
- `src/app/(tabs)/paste/page.tsx`
- `src/components/auth/DashboardContent.tsx`
- `context/context_20260322_*_paste_home_copy_cleanup.md`

## 테스트
- `PATH=/opt/homebrew/bin:$PATH npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
- `/paste`, `/home` 로컬 확인

## 롤백
- Paste 상단 헤더 블록 복원
- Home 인사 문구를 기존 `Welcome Back!`으로 복원

## 리스크
- 문구 제거 후 상단 여백이 다소 비어 보일 수 있다.

## 결과
- 완료
- Paste 탭 상단의 중복 헤더/설명 블록을 제거해 카드 콘텐츠부터 바로 보이게 정리했다.
- Home 헤더 인사 문구를 `Welcome!`으로 단순화했다.

## 연결 context
- `context/context_20260322_210248_paste_home_copy_cleanup.md`
