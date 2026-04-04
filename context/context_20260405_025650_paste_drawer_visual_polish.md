# Paste Drawer Visual Polish

## 작업 요약
- paste drawer를 화이트 베이스로 다시 정리하고 상단에만 얕은 하늘/핑크 계열 빛 번짐을 넣었다.
- `@magicui/word-rotate`와 `motion`을 추가하고, `TikTok / Instagram / YouTube Shorts` 회전 카피를 hero 문구에 적용했다.
- 기본 drawer handle은 숨기고 내부 상단에 커스텀 핸들을 넣어 떠 보이던 느낌을 줄였다.
- drawer에서는 optional 필드를 접도록 바꿔 첫 화면에서 제목, URL, optional toggle, CTA가 더 빨리 보이게 했다.
- close 버튼은 z-index를 올려 실제 pointer가 가로막히던 문제를 정리했다.
- hero 내부의 작은 badge는 제거했고, 좌우로 퍼지던 gradient를 상단 중앙의 반달형 하이라이트로 바꿨다.
- 마지막 보정으로 hero 내부 surface를 없애고, 빛 번짐을 drawer/page 바깥 컨테이너로 올려 내부에 또 다른 카드가 있는 느낌을 줄였다.

## 변경 파일
- `package.json`
- `package-lock.json`
- `src/components/ui/drawer.tsx`
- `src/components/ui/word-rotate.tsx`
- `src/app/(tabs)/@overlay/(.)paste/page.tsx`
- `src/components/auth/URLInputForm.tsx`
- `plans/20260405_paste_drawer_visual_polish.md`

## 검증
- `npx eslint src/components/ui/drawer.tsx src/components/ui/word-rotate.tsx src/app/(tabs)/@overlay/(.)paste/page.tsx src/components/auth/URLInputForm.tsx`
  - 통과
- `npm run dev`
  - 로컬 서버 정상 실행 확인
- headless 브라우저 확인
  - 로그인 후 `/home`에서 Paste drawer 오픈 확인
  - drawer에서 close button, hero, analyze button, optional toggle 표시 확인
  - 직접 `/paste` 진입 시 close button 없이 full page hero/CTA 표시 확인
  - 확인 결과:
    - `drawerSummary.closeVisible: true`
    - `drawerSummary.heroVisible: true`
    - `drawerSummary.analyzeVisible: true`
    - `drawerSummary.optionalToggleVisible: true`
    - `directSummary.closeCount: 0`
    - `directSummary.heroVisible: true`
    - `directSummary.analyzeVisible: true`

## 메모
- drawer close 버튼은 시각상 보였지만 scroll subtree가 pointer를 가로막고 있어 `z-20`으로 올려 해결했다.
- 검증 스크린샷은 `/tmp/parrotkit-paste-drawer-polished.png`, `/tmp/parrotkit-paste-direct-polished.png`에 생성했다.
