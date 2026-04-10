# 20260411 Android DynamicColor Fix

## 배경
- 사용자는 `parrotkit-app`을 Android에서 열었을 때 `DynamicColorIOS is not available on this platform` 런타임 에러가 발생한다고 보고했다.
- 현재 native tabs 레이아웃에서 `DynamicColorIOS`가 모듈 로드 시점에 바로 호출되고 있어 Android에서도 실행되고 있다.

## 목표
- `DynamicColorIOS`를 iOS에서만 호출하도록 수정해 Android 런타임 에러를 제거한다.
- 결과를 `context/` 문서에 기록한다.

## 범위
- `parrotkit-app/app/(tabs)/_layout.tsx`
- 신규 plan/context 문서 작성

## 변경 파일
- `plans/20260411_android_dynamic_color_fix.md`
- `parrotkit-app/app/(tabs)/_layout.tsx`
- `context/context_20260411_android_dynamic_color_fix.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- `cd parrotkit-app && npx expo config --type public`
- Android dev client 또는 Metro reload 후 동일 에러 재발 여부 확인

## 롤백
- `DynamicColorIOS` 관련 조건 분기를 이전 상태로 되돌리면 된다.

## 리스크
- iOS/Android 탭 색상 분기가 늘어나면 이후 스타일 조정 시 플랫폼별 차이를 함께 관리해야 한다.
- 이번 수정은 런타임 크래시 제거가 목적이므로, Android 탭 색감이 최종 디자인과 꼭 같지는 않을 수 있다.

## 결과
- 완료
- `parrotkit-app/app/(tabs)/_layout.tsx`에서 `DynamicColorIOS` 호출을 iOS 분기 안으로 옮겨 Android에서 더 이상 실행되지 않게 수정했다.
- `blurEffect`, `disableTransparentOnScrollEdge`, `minimizeBehavior`도 iOS에서만 전달되도록 함께 정리했다.
- `npx tsc --noEmit`, `npx expo config --type public` 검증을 통과했다.

## 연결 context
- `context/context_20260411_android_dynamic_color_fix.md`
