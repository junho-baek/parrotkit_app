# Context - PWA 설치 안내 문구 영어화

## 작업 일시
- 2026-03-13 Asia/Seoul

## 배경
- 영어 앱 UI 대비 PWA 설치 시트 경고 문구가 한국어로 노출되어 언어 일관성이 맞지 않았음.

## 수행 내용
1. `src/components/common/PWARegistration.tsx`
   - 경고 문구를 한국어에서 영어로 교체:
   - `Without PWA installation, shooting and layout UI may break on some devices.`

## 검증
- 실행: `npm run build`
- 결과: 성공 (Next.js build / TypeScript / prerender 모두 통과)

## 메모
- 텍스트 변경만 포함되어 기능 동작 변화는 없음.
