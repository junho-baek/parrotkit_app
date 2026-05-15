# 2026-05-16 Bottom Nav Container Refinement

## 배경
Issue 6 Sub-AC 10.2.1은 Home, Explore, Paste, Recipes, My 하단 내비게이션의 컨테이너 레이아웃, 간격, 정렬, safe-area, shadow/elevation 처리를 더 앱답게 정리하는 작업이다.

## 목표
- 다섯 슬롯 하단 내비게이션의 regular tab과 center Paste CTA가 안정적으로 정렬되게 한다.
- iOS/Android bottom inset을 유지하면서 컨테이너 높이와 내부 패딩 계약을 명확히 한다.
- DESIGN.md의 흰 surface, coral 중심 primary CTA, 가벼운 depth 원칙을 따른다.

## 범위
- `src/core/navigation/root-tab-safe-area.ts`
- `src/core/navigation/root-tab-safe-area.test.ts`
- `src/core/navigation/root-native-tabs.tsx`
- 관련 context 문서

## 변경 파일
- 하단 내비게이션 layout helper/test
- root tab bar style
- 작업 결과 context

## 테스트
- `tsc -p tsconfig.root-tabs-check.json`
- `tsc -p tsconfig.json`
- safe-area runtime contract test
- DESIGN.md guard와 금지 copy 검색
- `git diff --check`

## 롤백
- 변경된 navigation layout helper/style/test/context/plan 변경을 되돌린다.

## 리스크
- Simulator screenshot은 이 sub-AC에서 새로 생성하지 않는다.
- 공유 worktree에 sibling 변경이 많으므로 commit/push는 최종 통합 단계에서 조정이 필요하다.

## 결과
- `root-tab-safe-area`에 tab bar content height, bottom/top/horizontal padding, Paste CTA diameter/frame/top offset 상수를 명시했다.
- root tab bar가 iOS/Android safe-area padding을 유지하면서 다섯 슬롯을 edge에서 살짝 띄우고, regular tab은 중앙 정렬하며, Paste CTA는 컨테이너에 고정된 raised center action으로 보이게 정리했다.
- tab bar surface는 DESIGN.md의 white surface와 light depth 원칙에 맞춰 hairline top border, iOS shadow, Android elevation을 적용했다.
- 연결 context: `context/context_20260516_bottom_nav_container_refinement.md`
