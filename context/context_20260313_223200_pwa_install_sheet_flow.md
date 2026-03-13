# Context - PWA 설치 안내 시트(Android/iOS) 구현

## 작업 일시
- 2026-03-13 Asia/Seoul

## 배경
- 사용자가 Android는 설치 버튼 기반, iOS는 홈 화면 추가 안내 기반 설치 UX를 원함.
- 요구사항: PWA로 실행 중일 때는 안내 시트를 노출하지 않아야 함.

## 수행 내용
1. `src/components/common/PWARegistration.tsx` 확장
   - Android(`beforeinstallprompt` 지원):
     - 이벤트를 가로채 `deferredPrompt`로 보관
     - 시트 내 `설치하기` 버튼으로 `prompt()` 호출
   - iOS:
     - Safari면 `공유 -> 홈 화면에 추가` 안내
     - Safari가 아니면 Safari로 열라는 안내
   - Standalone 모드:
     - `display-mode: standalone` 또는 `navigator.standalone` 감지 시 시트 미노출
   - 쿨다운:
     - 시트를 닫으면 `localStorage`에 타임스탬프 저장
     - 7일 이내 재노출 방지
   - `appinstalled` 이벤트 수신 시 시트/프롬프트 상태 정리

2. 기존 구성과의 연계
   - `layout.tsx`에서 이미 `PWARegistration`이 마운트되도록 연결된 상태 유지

## 검증
- `npm run build` 실행
- 결과: 성공

## 메모
- Android 설치 버튼 노출은 브라우저의 `beforeinstallprompt` 발화 조건(사용자 행동, 설치 가능성 평가)에 종속됨.
- iOS는 웹 표준 설치 프롬프트 API가 없어 안내 시트 방식이 정석임.
