# 모바일 키보드 안정화 및 슈팅 핸들 정리

## 배경
- Shooting 화면의 리사이즈 핸들이 화살표 기반이라 시각적으로 거칠고, 항상 보여서 화면 집중을 방해했다.
- iPhone 모바일 웹/PWA에서 cue를 터치했을 때 focus가 불안정해 색상 팔레트가 바로 뜨지 않는 경우가 있었다.
- 모바일 키보드가 올라올 때 화면 확대나 레이아웃 밀림이 Analysis / Recipe / Shooting 전반에서 거슬렸다.

## 목표
- Shooting cue 리사이즈 핸들을 더 자연스러운 코너형 L 핸들로 바꾸고 hover/focus 시에만 보이게 한다.
- 모바일에서 cue를 한 번 터치하면 focused 상태가 안정적으로 잡혀 색상 팔레트가 뜨게 한다.
- 모바일 웹/PWA에서 키보드 포커스 시 화면 확대와 불필요한 viewport 흔들림을 줄인다.

## 범위
- Shooting cue interaction polish
- 글로벌 viewport / mobile keyboard stabilization
- 작업 기록 문서화 및 dev 반영

## 변경 파일
- src/components/common/CameraShooting.tsx
- src/app/layout.tsx
- src/app/globals.css
- plans/20260408_mobile_keyboard_stability_and_shooting_handle.md
- context/context_20260408_mobile_keyboard_stability_and_shooting_handle.md

## 테스트
- 사용자 요청에 따라 별도 build/test는 수행하지 않음
- 코드 수정 및 문서화 후 git 반영만 진행

## 롤백
- Shooting 핸들 UI와 모바일 viewport 관련 커밋만 되돌리면 기존 동작으로 복구 가능

## 리스크
- 전역 viewport/meta와 입력 폰트 크기 규칙은 다른 모바일 입력 화면에도 영향을 줄 수 있다.
- iOS viewport 동작은 브라우저 버전에 따라 차이가 있어 실제 장치에서 추가 감각 확인이 필요할 수 있다.

## 결과
- Shooting cue에 hover/focus 기반 L-shape 리사이즈 핸들을 적용했다.
- 모바일 단일 터치에서도 focused cue가 더 안정적으로 잡히도록 보강했다.
- viewport/meta, stable vh 스크립트, 글로벌 입력 폰트 크기 규칙으로 모바일 키보드 확대/밀림 완화를 적용했다.
- context: context/context_20260408_mobile_keyboard_stability_and_shooting_handle.md
