# 20260502 Native Home Language Design

## 요약

- 첨부 시안의 핵심 개선 방향을 네이티브 Home에 반영했다.
- 어두운 배경은 적용하지 않고 기존 흰 캔버스와 하단 native tabs를 유지했다.
- Home의 정보 우선순위를 `Welcome -> Continue -> quick-start recipes -> recent recipes` 흐름으로 정리했다.
- My 화면에서 English/Korean 앱 언어를 전환할 수 있게 했다.

## 변경

- `parrotkit-app/src/core/i18n/app-language.tsx`
  - `AppLanguageProvider`, `useAppLanguage`, English/Korean copy dictionary를 추가했다.
  - Home recipe scene/shot/activity label helper를 추가했다.
- `parrotkit-app/src/app/_layout.tsx`
  - 앱 루트에 `AppLanguageProvider`를 추가했다.
- `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
  - 기존 큰 Shoot hero와 grid card 중심 구조를 제거했다.
  - Continue card를 상단 핵심 행동으로 배치하고 progress bar와 `Continue Shoot` CTA를 추가했다.
  - quick-start recipe horizontal rail과 recent recipe list를 추가했다.
  - 모든 static Home copy를 언어 provider에 연결했다.
- `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`
  - pager root background를 `#ffffff`로 변경했다.
- `parrotkit-app/src/features/profile/screens/profile-screen.tsx`
  - Settings 섹션과 English/Korean segmented language control을 추가했다.
  - My 화면 static copy 일부를 언어 provider에 연결했다.
- `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
  - native tab labels를 언어 provider에 연결하고 첫 탭 label을 Home/홈으로 정리했다.
- `parrotkit-app/src/core/navigation/app-top-bar.tsx`
  - 기존 흰/translucent top bar를 유지하면서 알림 아이콘과 badge를 추가했다.
  - top bar accessibility copy를 언어 provider에 연결했다.
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
  - floating source CTA label/accessibility copy를 언어 provider에 연결했다.

## 검증

- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- `cd parrotkit-app && npx expo config --type public >/tmp/parrotkit-expo-config.json` 통과.

## 리스크

- 언어 설정은 현재 runtime provider state라 앱 재시작 후 기본 English로 돌아간다.
- Expo unstable native tabs label이 context change를 즉시 반영하는지는 실기기/시뮬레이터에서 한 번 더 눈으로 확인하는 편이 좋다.
- 원격에는 `origin/dev`가 없고 `origin/main`만 있어 이번 작업은 `main...origin/main` 기준으로 진행했다.
