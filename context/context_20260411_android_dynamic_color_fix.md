# Context - Android DynamicColor Fix

## 작업 요약
- Android에서 `DynamicColorIOS is not available on this platform` 런타임 에러가 발생하던 문제를 수정했다.
- 원인은 `parrotkit-app/app/(tabs)/_layout.tsx`에서 `DynamicColorIOS`를 모듈 로드 시점에 바로 호출하고 있었던 점이다.
- 수정 후에는 `TabsLayout` 내부에서 `Platform.OS === 'ios'`일 때만 `DynamicColorIOS`를 호출하고, Android에서는 일반 색상 문자열 fallback을 사용하도록 바꿨다.
- 함께 `blurEffect`, `disableTransparentOnScrollEdge`, `minimizeBehavior`도 iOS 전용 props로 정리했다.

## 변경 파일
- `plans/20260411_android_dynamic_color_fix.md`
- `parrotkit-app/app/(tabs)/_layout.tsx`
- `context/context_20260411_android_dynamic_color_fix.md`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 통과
- `cd parrotkit-app && npx expo config --type public`
  - 통과
- Android 연결 검증 메모
  - 현재 shell PATH에서는 `adb`, `emulator` 명령이 없어 이 턴에서 Android 기기 attach 자동 검증은 수행하지 못했다.
  - 다만 문제 원인이던 iOS 전용 API의 Android 실행 경로는 코드상 제거했다.

## 메모
- 사용자가 공유한 에러 스크린샷 기준 call stack은 `app/(tabs)/_layout.tsx:5:37`의 top-level `DynamicColorIOS` 호출을 가리켰다.
- 이 수정은 런타임 크래시 제거가 목적이며, Android 탭 색상은 현재 단순 fallback 색상(`'#111827'`, `'#4b5563'`)을 사용한다.
