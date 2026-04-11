# Plan - Parrotkit App Paste CTA Label Stack

## 배경
- 현재 global `Paste` CTA는 가로형 pill 안에 `+`와 `Paste` 텍스트가 나란히 들어간 구조다.
- 사용자 피드백은 CTA를 더 단순하게 만들어, `+` 아이콘이 메인이고 그 아래에 작은 `paste` 라벨이 붙는 형태를 원한다.

## 목표
- global `Paste` CTA를 원형 `+` 버튼 + 하단 소형 라벨 구조로 단순화한다.
- 기존 브랜드 gradient와 우측 하단 placement는 유지한다.

## 범위
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`
- 신규 plan/context 기록

## 변경 파일
- `plans/20260412_parrotkit_app_paste_cta_label_stack.md`
- `context/context_20260412_parrotkit_app_paste_cta_label_stack.md`
- `parrotkit-app/src/core/navigation/global-source-cta.tsx`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`

## 롤백
- `global-source-cta.tsx`를 기존 pill layout으로 되돌린다.

## 리스크
- 라벨을 너무 작게 줄이면 접근성이나 존재감이 약해질 수 있다.
- 원형 버튼만 남기면 기존보다 터치 타깃 인상이 작아 보일 수 있어, 실제 시각 균형은 한 번 더 확인이 필요하다.

## 결과
- 완료
- global `Paste` CTA를 원형 `+` 버튼 + 하단 소형 `paste` 라벨 구조로 단순화했다.
- 브랜드 gradient, 우측 하단 placement, modal 진입 동작은 유지했다.
- `npx tsc --noEmit` 검증을 통과했다.

## 연결 context
- `context/context_20260412_parrotkit_app_paste_cta_label_stack.md`
