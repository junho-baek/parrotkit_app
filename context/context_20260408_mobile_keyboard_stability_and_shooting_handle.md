# 2026-04-08 모바일 키보드 안정화 및 슈팅 핸들 정리

## 요약
- Shooting 프롬프터의 리사이즈 핸들을 화살표 대신 L-shape 코너 핸들로 변경했다.
- 핸들은 hover/focus 시에만 노출되도록 바꿔 화면 위 노이즈를 줄였다.
- iPhone 터치에서 focused cue가 더 안정적으로 잡히도록 `click` / `touchstart` / `touchend` 기반 포커스 보강을 넣었다.
- 전역 viewport 설정과 stable viewport height 스크립트, 16px 입력 폰트 규칙을 추가해 모바일 웹/PWA에서 키보드 확대와 레이아웃 흔들림을 줄이도록 조정했다.

## 변경 파일
- src/components/common/CameraShooting.tsx
- src/app/layout.tsx
- src/app/globals.css
- plans/20260408_mobile_keyboard_stability_and_shooting_handle.md

## 상세
### 1. Shooting 핸들 정리
- cue 카드에 `group`을 부여하고, 리사이즈 핸들을 `md:group-hover` / `md:group-focus-within`일 때만 표시하도록 변경했다.
- 기존 `↘` 텍스트 대신 border 조합으로 만든 L-shape corner handle을 사용했다.
- 핸들이 보이지 않을 때는 pointer events도 막아서 보이지 않는 컨트롤이 눌리지 않게 했다.

### 2. 모바일 포커스 보강
- cue 카드 터치/클릭 시 `focusedBlockId`를 강제로 갱신하게 해 색상 팔레트가 한 번 터치로 더 안정적으로 열리게 했다.
- 기존 드래그/핀치 로직은 유지하면서, tap 성격의 상호작용에서도 focus가 남도록 보강했다.

### 3. 모바일 키보드 안정화
- `viewport`에 `width=device-width`, `initialScale=1`, `maximumScale=1`, `userScalable=false`를 명시했다.
- `beforeInteractive` 스크립트로 가장 큰 visual viewport 높이를 `--app-stable-vh`에 유지하게 해 키보드로 인한 뷰포트 수축 영향을 줄였다.
- `html`, `body`의 최소 높이를 해당 변수 기반으로 맞추고, 모든 입력 요소 및 `contenteditable`에 `font-size: 16px`를 적용해 iOS 자동 확대를 방지했다.

## 검증
- 사용자 요청에 따라 `npm run build` 및 별도 테스트는 수행하지 않았다.
- 후속으로 실제 iPhone Safari / PWA에서 tap focus와 keyboard behavior 확인이 유용하다.
