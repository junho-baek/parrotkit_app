# 2026-05-16 Route My Correct

## 배경
Issue 6 Seed는 하단 네비게이션의 `My` 슬롯이 의도한 My/Profile 화면을 열어야 한다고 요구한다. sibling 작업으로 5-slot nav와 다른 route contract가 이미 수정 중이므로 이 작업은 `My` route mapping 검증만 좁게 보강한다.

## 목표
`My` 탭이 `/my`로 이동하고, 해당 Expo Router tab file이 `ProfileScreen`을 렌더링한다는 계약을 고정한다.

## 범위
- root tab href contract에서 `my` route를 명시 검증한다.
- `/my` tab route file이 Profile screen entry point임을 root tabs check에서도 검증한다.

## 변경 파일
- `src/core/navigation/root-tab-config.test.ts`
- `plans/20260516_route_my_correct.md`
- `context/context_20260516_route_my_correct.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.my-profile-entry-check.json`
- DESIGN.md guardrail 문구 확인

## 롤백
`root-tab-config.test.ts`에 추가한 My-specific route assertions를 제거한다.

## 리스크
- shared worktree에 sibling navigation changes가 많다. 구현 파일은 이미 올바른 상태로 보이므로 production route 변경 없이 검증 계약만 보강한다.

## 결과
- `rootTabHrefs.my`가 `/my`를 유지하는지 명시 검증했다.
- `My` 탭 href가 Home, Explore, Paste, Recipes href와 겹치지 않는지 검증했다.
- `/my` tab route file이 `ProfileScreen`을 default export하는지 root tab contract에 추가했다.

## 검증 결과
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- PASS: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.my-profile-entry-check.json`
- PASS: DESIGN.md bottom navigation / guardrail 문구 확인
- 연결 context: `context/context_20260516_route_my_correct.md`
