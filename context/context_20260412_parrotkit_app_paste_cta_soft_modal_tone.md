# Context - Parrotkit App Paste CTA Soft Modal Tone

## 작업 요약
- global `Paste` CTA의 gradient를 더 연한 파스텔 톤으로 낮춰, 기존 modal primary action에 가까운 질감으로 조정했다.
- 버튼 그림자와 하이라이트도 더 부드럽게 바꿔 화면 위에 과하게 떠 보이지 않도록 정리했다.
- CTA 우측 마진을 늘려 화면 끝에 덜 붙어 보이게 조정했다.
- `+` 버튼과 하단 `paste` 라벨 구조는 유지했다.

## 변경 파일
- `plans/20260412_parrotkit_app_paste_cta_soft_modal_tone.md`
- `context/context_20260412_parrotkit_app_paste_cta_soft_modal_tone.md`
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `parrotkit-app/src/core/theme/colors.ts`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- 실제 디바이스에서 버튼 존재감이 너무 약해 보이면 gradient 채도나 그림자를 소폭 되돌릴 수 있다.

## 메모
- 이번 조정은 CTA 동작 변경 없이 시각 톤과 위치만 손봤다.
