# Context - Parrotkit App Paste CTA Label Stack

## 작업 요약
- global `Paste` CTA를 가로형 pill에서 원형 `+` 버튼 중심 형태로 단순화했다.
- `+` 아이콘 아래에 작은 `paste` 라벨을 배치해, 액션은 명확하게 보이되 전체 인상은 더 가볍게 만들었다.
- 브랜드 gradient와 우측 하단 placement는 그대로 유지했다.

## 변경 파일
- `plans/20260412_parrotkit_app_paste_cta_label_stack.md`
- `context/context_20260412_parrotkit_app_paste_cta_label_stack.md`
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과

## 남은 리스크
- 실제 시뮬레이터에서 라벨 대비가 약하면 `paste` 텍스트 색이나 크기를 소폭 더 올릴 수 있다.

## 메모
- 이번 조정은 CTA 구조 단순화가 목적이라, 액션 동작과 위치는 그대로 유지했다.
