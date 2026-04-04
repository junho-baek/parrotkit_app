# Paste Route-Backed Drawer

## 배경
- 현재 `/paste`는 하단 탭 안의 독립 페이지처럼 보이지만, 실제로는 `URLInputForm` 카드 하나를 보여주는 입력 액션에 가깝다.
- 모바일 앱 셸 안에서는 Paste가 "이동할 장소"보다 "빠르게 열리는 작성 흐름"에 가까워 drawer 경험이 더 자연스럽다.
- 다만 직접 URL 진입, 새로고침, 공유 링크는 계속 `/paste`가 단독 페이지로 열려야 한다.

## 목표
- `/paste`를 canonical route로 유지하면서, 앱 내부 soft navigation에서는 drawer로 열리도록 전환한다.
- full page와 drawer가 같은 폼 본문을 재사용하게 만들어 UI/동작이 어긋나지 않게 한다.
- paste 입력 경험을 drawer에 맞게 더 간결하고 모바일 친화적으로 다듬는다.

## 범위
- `src/app/(tabs)`에 parallel route slot 및 intercepted route 추가
- paste 페이지를 full page + drawer 동시 지원 구조로 개편
- `URLInputForm`을 wrapper와 form content로 분리
- shadcn `drawer` 컴포넌트 추가 및 스타일 커스터마이즈
- 로컬 `npm run dev` 기반 브라우저 확인

## 변경 파일
- `src/app/(tabs)/layout.tsx`
- `src/app/(tabs)/paste/page.tsx`
- `src/app/(tabs)/@overlay/default.tsx`
- `src/app/(tabs)/@overlay/(.)paste/page.tsx`
- `src/components/auth/URLInputForm.tsx`
- `src/components/ui/drawer.tsx`
- `src/app/globals.css`
- 필요 시 관련 보조 파일

## 테스트
- `npm run dev`
- 브라우저에서 `/home` -> Paste 탭 클릭 시 drawer 오픈 확인
- drawer 닫기/뒤로가기 동작 확인
- `/paste` 직접 진입 시 full page 렌더 확인
- 폼 제출 버튼/입력/키보드 시 하단 탭 숨김 동작 확인

## 롤백
- parallel route slot과 intercepted route를 제거하고 `/paste` 단독 페이지 구조로 복귀
- `URLInputForm` wrapper 분리를 되돌리고 카드형 단일 컴포넌트로 복귀

## 리스크
- Next intercepted route 구성이 잘못되면 `/paste` navigation이 blank overlay나 중복 렌더로 보일 수 있다.
- drawer 내부에서 모바일 키보드와 스크롤이 충돌할 수 있다.
- 기존 `/submit-video` 등 다른 경로가 `URLInputForm` 재구성 영향을 받을 수 있어 wrapper 분리를 신중히 해야 한다.

## 결과
- 완료
- `/paste`를 canonical route로 유지하면서, `(tabs)` 내부 soft navigation에서는 intercepted route drawer로 열리도록 구현했다.
- `URLInputForm`을 page/drawer 겸용 컴포넌트로 재구성하고, drawer 친화적인 헤더/입력/inline validation으로 정리했다.
- shadcn `drawer`와 `vaul`을 추가했다.

## 연결 Context
- `context/context_20260405_022529_paste_route_backed_drawer.md`
