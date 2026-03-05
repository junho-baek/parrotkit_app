# Mobile Stability Fix 플랜 (2026-03-10)

## 배경
- 모바일(iOS/Android)에서 레이아웃/재생/업로드 안정성이 출시 전 핵심 품질 요소다.

## 목표
- 실기기 기준 치명 UX 이슈를 제거하고 재현 케이스를 정리한다.

## 범위
- 포함: iOS Safari/Android Chrome UI/재생/업로드 안정화
- 제외: 신규 UX 개편

## 변경 파일
- `src/components/**/*`
- `src/app/api/recipes/**/*` (필요 시)
- `context/context_*`

## 테스트
- 기기별 체크리스트
- 촬영 업로드/재생 종료/재접속 복구 검증

## 롤백
- 특정 수정점 단위 revert 가능하도록 커밋 분리

## 리스크
- 브라우저별 미디어 정책 차이
- 네트워크 품질 편차

## 결과
- (작업 완료 후 기입)

## 연결 Context
- (작업 완료 후 기입)
