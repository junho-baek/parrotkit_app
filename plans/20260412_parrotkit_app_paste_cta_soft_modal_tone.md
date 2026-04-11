# Plan - Parrotkit App Paste CTA Soft Modal Tone

## 배경
- 현재 global `Paste` CTA는 구조는 단순해졌지만, 색이 아직 강하고 화면 우측 끝에 너무 붙어 보여 modal CTA보다 더 튀는 인상이 남아 있다.
- 사용자 피드백은 CTA를 더 연한 톤으로 낮추고, 우측 마진을 늘리고, 원래 modal primary action 같은 부드러운 질감으로 맞추는 것이다.

## 목표
- global `Paste` CTA의 gradient와 그림자를 더 부드러운 modal CTA 톤으로 조정한다.
- 우측 마진을 늘려 버튼이 화면 끝에 덜 붙어 보이게 한다.
- `+` 버튼과 하단 `paste` 라벨 구조는 유지한다.

## 범위
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `parrotkit-app/src/core/theme/colors.ts`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_paste_cta_soft_modal_tone.md`
- `context/context_20260412_parrotkit_app_paste_cta_soft_modal_tone.md`
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- `parrotkit-app/src/core/theme/colors.ts`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- CTA gradient, 그림자, 우측 마진 값을 이전 강한 톤으로 되돌린다.

## 리스크
- 색을 너무 연하게 낮추면 밝은 배경 위에서 존재감이 약해질 수 있다.
- 우측 마진을 과하게 늘리면 하단 탭과의 정렬감이 흐려질 수 있다.

## 결과
- 완료
- global `Paste` CTA를 더 연한 파스텔 gradient와 부드러운 그림자로 조정해 modal CTA 같은 질감으로 정리했다.
- 우측 마진을 늘려 버튼이 화면 끝에 덜 붙어 보이게 했다.
- `npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_paste_cta_soft_modal_tone.md`
