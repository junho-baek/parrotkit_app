# PWA 안내 문구 영어화

## 배경
- 앱 전체가 영어 UI인데, PWA 설치 시트 경고 문구 일부가 한국어로 표시되고 있음.

## 목표
- PWA 설치 시트의 경고 문구를 영어로 통일해 언어 일관성 확보.

## 범위
- `PWARegistration` 컴포넌트 내 해당 안내 문구 텍스트만 수정.

## 변경 파일
- `src/components/common/PWARegistration.tsx`
- `context/context_20260313_*.md` (작업 완료 후 기록)

## 테스트
- `npm run build`

## 롤백
- 해당 문자열 변경만 되돌리면 즉시 복구 가능.

## 리스크
- 문자열 교체 작업이라 기능 리스크는 낮음.

## 결과
- 구현 완료:
  - PWA 설치 시트 경고 문구를 영어로 교체
- 검증 결과:
  - `npm run build` 통과
- 연결 context:
  - `context/context_20260313_235900_pwa_notice_language_fix.md`
