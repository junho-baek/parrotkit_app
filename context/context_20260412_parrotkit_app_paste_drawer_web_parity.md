# Context - Parrotkit App Paste Drawer Web Parity

## 작업 요약
- 모바일 `source-actions` 시트를 웹 `PasteDrawer`와 `URLInputForm` drawer variant 기준으로 다시 구성했다.
- 상단은 centered editorial headline, top glow, handle, white sheet shadow 구조로 맞추고, 본문은 `Recipe Title *`, `Video URL *`, `Your Context` 아코디언, `Niche`, `Goal`, `Notes`, `Brand Context PDF`, `Analyze Video` CTA 순서로 정리했다.
- 기존의 generic source action 카드 묶음은 제거해 웹의 폼 중심 drawer 구조와 더 가깝게 맞췄다.
- 새 native dependency는 추가하지 않고 기존 Expo/RN 프리미티브만 사용해 dev client 재빌드 부담 없이 확인 가능한 상태로 유지했다.

## 변경 파일
- `plans/20260412_parrotkit_app_paste_drawer_web_parity.md`
- `context/context_20260412_parrotkit_app_paste_drawer_web_parity.md`
- `parrotkit-app/src/features/source/screens/source-action-sheet-screen.tsx`

## 검증
- `cd parrotkit-app && npx tsc --noEmit`
  - 결과: 통과
- `cd parrotkit-app && npx expo config --type public`
  - 결과: 통과

## 남은 리스크
- 웹의 animated gradient word는 RN에서 native dependency를 늘리지 않는 방향으로 근사 구현했기 때문에, 색 번짐/애니메이션까지 완전히 같지는 않다.
- PDF 업로드 슬롯은 현재 시각 위계와 affordance 중심으로 반영했고, 실제 파일 선택 연결이 필요하면 별도 native dependency 전략을 잡아 붙일 수 있다.
