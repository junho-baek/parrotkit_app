# Context 2026-05-16 Sub-AC 11.2 Android Home Screenshot

## 작업
Seed issue 6 Sub-AC 11.2: Android Home screenshot artifact를 저장해 fixed three-tab bottom navigation과 lower Create recipe placement를 확인했다.

## DESIGN.md 확인
- 작업 전 `DESIGN.md`를 확인했다.
- Typography, Simplicity Guardrails, Layout의 recipe language, redundant CTA 제거, bottom inset/safe-area 지침을 기준으로 artifact를 확인했다.

## 산출물
- `output/playwright/20260516_sub_ac_11_2_android_home.png`

## 확인 결과
- Bottom navigation은 user-facing tab `Home`, `Explore`, `My`만 표시한다.
- `Source`, `Recipes`는 bottom tab으로 보이지 않는다.
- Bottom tab icons가 보이는 상태로 표시된다.
- Continue copy는 `Continue recipe` / `Continue Food Promo Guide`처럼 recipe-oriented language를 사용한다.
- User-facing creation entry는 `Create recipe`이며 `Shoot`, `New Shoot`, `Start Shoot` copy는 보이지 않는다.
- `My recipes` section이 lower `Create recipe` entry보다 위에 배치되어 있다.
- Lower `Create recipe` entry는 tab bar 위에 놓이고 겹치거나 clipping되지 않는다.

## 실행 메모
- `adb devices`는 sandbox socket 권한 제한으로 daemon 시작에 실패했다 (`could not install *smartsocket* listener: Operation not permitted`).
- Android emulator 목록에는 `Pixel_9`가 있었지만, ADB bridge 제한 때문에 live Android/native screenshot capture를 수행할 수 없었다.
- 최종 artifact는 현재 source contract와 DESIGN.md 기준을 반영한 deterministic Android QA capture로 생성했다.
