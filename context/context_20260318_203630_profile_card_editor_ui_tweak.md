# Context - 2026-03-18 20:36 KST - profile card editor UI tweak

## 작업 개요
- 마이페이지 프로필 카드에서 상시 노출되던 추가 프로필 요약 블록을 제거했다.
- 카드 클릭 시 편집 모달이 열리는 인터랙션은 유지했다.
- `Tap to edit` 텍스트를 우측 화살표 인디케이터로 교체했다.

## 주요 변경
- `src/components/auth/DashboardContent.tsx`
  - 프로필 카드 내부의 `AGE/GENDER/DOMAIN/FOLLOWERS/PURPOSE` 상시 표시 블록 제거
  - 우측 배지 텍스트 `Tap to edit` -> 원형 화살표(`›`) 인디케이터로 변경
  - 카드 기본 정보(아바타, username/email, stats cards)는 기존 형태 유지

## 검증
- 타입 체크
  - `npx tsc --noEmit` 통과
- 정적 검사
  - `npx eslint src/components/auth/DashboardContent.tsx`
  - 결과: error 없음 (기존 `<img>` warning만 존재)
- dev 서버
  - `npm run dev -- --webpack --hostname 127.0.0.1 --port 3000`
  - `HEAD /my` 200 확인

## 메모
- `.next/dev/types/*`에 손상된 generated 파일이 있어 최초 `tsc`가 실패했다.
- generated 파일 정리 후 `tsc` 재실행 시 정상 통과를 확인했다.
