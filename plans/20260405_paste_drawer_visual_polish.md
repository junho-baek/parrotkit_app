# Paste Drawer Visual Polish

## 배경
- route-backed drawer 구조는 맞지만, 현재 drawer 상단 헤더가 무겁고 카피가 중복되어 실제 입력 영역이 너무 늦게 시작된다.
- 기본 drawer handle이 플로팅된 듯 보여 레퍼런스 톤과 다르고, 하단 입력/CTA 접근성도 답답하게 느껴진다.
- 사용자는 흰 배경 위에 상단만 은은한 효과를 주고, 핵심 카피에 회전 워드 효과를 넣는 방향을 원한다.

## 목표
- drawer를 더 화이트 톤으로 정리하고 상단에만 얕은 이펙트를 준다.
- `TikTok / Instagram / YouTube Shorts` 회전 카피를 추가해 히어로 문구를 강화한다.
- drawer handle을 자연스럽게 다듬고, 첫 화면에서 더 많은 입력 필드가 보이도록 레이아웃을 압축한다.
- `Paste`를 독립 페이지가 아니라 tabs layout 위 overlay처럼 느껴지도록 동작을 정리한다.

## 범위
- `@magicui/word-rotate` 추가
- drawer UI 및 `URLInputForm` 히어로 카피/밀도 조정
- drawer handle/scroll 영역 수정
- `Paste` 진입을 query 기반 overlay로 전환
- 로컬 `npm run dev` 및 브라우저 확인

## 변경 파일
- `package.json`
- `package-lock.json`
- `src/components/ui/word-rotate.tsx`
- `src/components/ui/drawer.tsx`
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
- 필요 시 `src/app/globals.css`

## 테스트
- `npx eslint` 대상 파일 확인
- `npm run dev`
- `/home`에서 Paste drawer 시각 확인
- `/home?sheet=paste` 새로고침 시 overlay 유지 확인
- `/paste` 직접 진입 시 홈 drawer로 리다이렉트 확인
- 배포 빌드 오류 발생 시 `npm run build`로 재현 및 확인

## 롤백
- `word-rotate` 제거
- drawer header/hero 카피를 직전 버전으로 복귀

## 리스크
- rotating word 애니메이션이 과하면 오히려 산만해질 수 있다.
- drawer 압축 과정에서 입력 터치 타깃이 너무 작아지지 않도록 주의가 필요하다.

## 결과
- 완료
- drawer를 흰 배경 중심으로 다시 정리하고, 상단에만 아주 얕은 색 번짐 효과를 남겼다.
- `@magicui/word-rotate`를 추가해 `TikTok / Instagram / YouTube Shorts` 회전 카피를 큰 헤드라인에 적용했다.
- 기본 drawer handle은 숨기고 커스텀 핸들을 내부 상단에 넣었다.
- drawer에서는 optional 필드를 접을 수 있게 해 첫 화면에서 CTA 접근성을 높였다.
- 이후 보정으로 hero badge를 제거했고, 좌우 그라데이션을 상단 중앙 반달형 하이라이트로 수정했다.
- 최종 보정으로 hero 자체의 내부 surface를 제거하고, drawer 안에 또 다른 박스가 있는 듯한 인상을 줄였다.
- 상단 광원 높이를 더 키우고 보조 카피를 제거해 hero를 더 가볍게 정리했다.
- hero 헤드라인은 중앙 정렬과 더 넓은 폭으로 조정해 모바일에서도 두 줄에 가깝게 안정되게 만들었다.
- `Paste`는 `?sheet=paste` query 기반 overlay로 전환했고, `/paste`는 `/home?sheet=paste`로 리다이렉트되도록 바꿨다.
- 이후 빌드 오류 대응으로 `(tabs)` layout에서 `useSearchParams()`를 쓰는 하위 클라이언트 컴포넌트를 `React.Suspense`로 감싸 배포 build를 통과시켰다.
- drawer 본체는 `733px` 목표 높이로 조정하고, 더 작은 뷰포트에서는 `92dvh`를 상한으로 유지했다.

## 연결 Context
- `context/context_20260405_025650_paste_drawer_visual_polish.md`
