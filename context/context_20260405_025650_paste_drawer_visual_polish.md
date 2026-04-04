# Paste Drawer Visual Polish

## 작업 요약
- paste drawer를 화이트 베이스로 다시 정리하고 상단에만 얕은 하늘/핑크 계열 빛 번짐을 넣었다.
- `@magicui/word-rotate`와 `motion`을 추가하고, `TikTok / Instagram / YouTube Shorts` 회전 카피를 hero 문구에 적용했다.
- 기본 drawer handle은 숨기고 내부 상단에 커스텀 핸들을 넣어 떠 보이던 느낌을 줄였다.
- drawer에서는 optional 필드를 접도록 바꿔 첫 화면에서 제목, URL, optional toggle, CTA가 더 빨리 보이게 했다.
- close 버튼은 z-index를 올려 실제 pointer가 가로막히던 문제를 정리했다.
- hero 내부의 작은 badge는 제거했고, 좌우로 퍼지던 gradient를 상단 중앙의 반달형 하이라이트로 바꿨다.
- 마지막 보정으로 hero 내부 surface를 없애고, 빛 번짐을 drawer/page 바깥 컨테이너로 올려 내부에 또 다른 카드가 있는 느낌을 줄였다.
- 추가 보정으로 상단 광원 높이를 더 키우고, hero 보조 문구는 제거했다.
- `Paste`는 더 이상 독립 `/paste` 페이지를 진실값으로 쓰지 않고, `?sheet=paste` query 기반 overlay로 열리도록 바꿨다.
- `/paste` 직접 진입은 `/home?sheet=paste`로 307 리다이렉트되며, 새로고침 시에도 홈 위 drawer 상태를 유지한다.
- drawer hero는 폭을 넓히고 중앙 정렬로 다시 잡아 모바일에서도 두 줄에 가깝게 안정되도록 조정했다.
- 배포 빌드에서 `useSearchParams()` missing suspense 오류가 발생해 `(tabs)` layout의 `BottomTabBar`, `PasteDrawerHost`를 `React.Suspense`로 감쌌다.
- drawer 본체 높이는 `733px`를 목표값으로 두고, 작은 화면에서는 `92dvh`를 넘지 않도록 조정했다.
- rotating platform copy에서 `Instagram`을 `Instagram Reels`로 수정하고, 문장도 `Paste your ... link` 형태로 자연스럽게 다듬었다.
- 최종 카피 보정으로 `Paste a viral ... link, then make it your own🦜.` 형태로 정리해 시점을 자연스럽게 맞췄다.

## 변경 파일
- `package.json`
- `package-lock.json`
- `src/components/ui/drawer.tsx`
- `src/components/ui/word-rotate.tsx`
- `src/lib/paste-drawer.ts`
- `src/components/auth/PasteDrawer.tsx`
- `src/components/auth/PasteDrawerHost.tsx`
- `src/app/(tabs)/layout.tsx`
- `src/app/(tabs)/paste/page.tsx`
- `src/app/(tabs)/@overlay/(.)paste/page.tsx`
- `src/components/auth/URLInputForm.tsx`
- `src/components/common/BottomTabBar.tsx`
- `src/components/auth/DashboardContent.tsx`
- `src/components/auth/InterestsForm.tsx`
- `src/components/auth/RecipesTab.tsx`
- `src/components/auth/SourceOptionsForm.tsx`
- `plans/20260405_paste_drawer_visual_polish.md`

## 검증
- `npx eslint src/components/ui/drawer.tsx src/components/ui/word-rotate.tsx src/app/(tabs)/@overlay/(.)paste/page.tsx src/components/auth/URLInputForm.tsx`
  - 통과
- `npx eslint src/app/(tabs)/layout.tsx`
  - 통과
- `npm run dev`
  - 로컬 서버 정상 실행 확인
- `npm run build`
  - 통과
- headless 브라우저 확인
  - 로그인 후 `/home`에서 Paste drawer 오픈 확인
  - `/home?sheet=paste` 새로고침 후에도 drawer 유지 확인
  - drawer에서 close button, hero, analyze button, optional toggle 표시 확인
  - 직접 `/paste` 진입 시 `/home?sheet=paste`로 리다이렉트되고 drawer 표시 확인
  - drawer 높이 확인
  - 확인 결과:
    - `refreshedUrl: http://127.0.0.1:3000/home?sheet=paste`
    - `redirectedUrl: http://127.0.0.1:3000/home?sheet=paste`
    - `closeVisible: true`
    - `directCloseVisible: true`
    - `drawerHeight: 733px`
- 카피 확인
    - `Paste a viral Instagram Reels link, then make it your own🦜.`
- 리다이렉트 헤더 확인
    - `curl -I http://127.0.0.1:3000/paste`
    - `location: /home?sheet=paste`
- 빌드 확인
  - `/(.)paste` prerender 정상 완료
  - `useSearchParams() should be wrapped in a suspense boundary` 오류 재현되지 않음

## 메모
- drawer close 버튼은 시각상 보였지만 scroll subtree가 pointer를 가로막고 있어 `z-20`으로 올려 해결했다.
- query 기반 overlay로 바꾸면서 Paste 탭 활성화는 `pathname` 대신 `sheet=paste` 기준으로 처리했다.
- 검증 스크린샷은 `/tmp/parrotkit-paste-drawer-polished.png`, `/tmp/parrotkit-paste-direct-polished.png`, `/tmp/parrotkit-paste-sheet-refreshed.png`, `/tmp/parrotkit-paste-sheet-stable2.png`, `/tmp/parrotkit-paste-drawer-733.png`, `/tmp/parrotkit-paste-instagram-reels.png`, `/tmp/parrotkit-paste-copy-natural.png`에 생성했다.
