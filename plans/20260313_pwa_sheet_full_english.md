# PWA 설치 시트 영어 문구 완전 통일

## 배경
- PWA 설치 시트에 일부 한국어 문구가 남아 있어 영어 앱 톤과 일관되지 않음.

## 목표
- PWA 설치 시트 내 사용자 노출 문구를 전부 영어로 통일.

## 범위
- `PWARegistration` 컴포넌트 텍스트(제목/설명/버튼/iOS 안내/접근성 라벨) 교체.

## 변경 파일
- `src/components/common/PWARegistration.tsx`
- `plans/20260313_pwa_sheet_full_english.md`
- `context/context_20260313_*.md` (작업 후)

## 테스트
- `npm run build`

## 롤백
- 문자열 변경 revert로 즉시 복원 가능.

## 리스크
- 기능 변경은 없고 텍스트만 변경되어 리스크 매우 낮음.

## 결과
- 구현 완료:
  - PWA 설치 시트의 사용자 노출 문구 전부 영어로 통일
    - title/subtitle
    - iOS 안내 메시지(사파리/비사파리)
    - install/close/later 텍스트
- 검증 결과:
  - `npm run build` 통과
- 연결 context:
  - `context/context_20260313_235950_pwa_sheet_full_english.md`
