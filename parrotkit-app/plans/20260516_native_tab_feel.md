# Native Tab Feel

## 배경
ParrotKit Home hierarchy repair 중 AC 3은 하단 탭이 무거운 커스텀 박스가 아니라 native/lightweight bottom bar처럼 보여야 한다.

## 목표
- Bottom navigation을 Home, Explore, My 중심의 가벼운 native tab bar 표현으로 유지한다.
- 박스형 tab container, heavy shadow, floating rounded shell을 피한다.
- iOS/Android에서 아이콘과 라벨이 안정적으로 렌더링되도록 기존 vector icon 경로를 보존한다.

## 범위
- Root tab bar presentation style만 조정한다.
- Home/Explore/My route 구성, Source/Recipes hidden route, Home content hierarchy는 sibling tasks 범위라 직접 변경하지 않는다.

## 변경 파일
- `src/core/navigation/root-native-tabs.tsx`
- `plans/20260516_native_tab_feel.md`
- `context/context_20260516_native_tab_feel.md`

## 테스트
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json`
- 가능하면 관련 정적 검색으로 boxed tab container 스타일이 없는지 확인한다.

## 롤백
- `src/core/navigation/root-native-tabs.tsx`의 tabBar style 값을 이전 단순 white background 값으로 되돌린다.

## 리스크
- 실제 simulator 접근이 제한되면 live screenshot 확인은 못 할 수 있다.
- sibling task가 같은 파일의 route visibility를 수정 중이면 충돌 가능성이 있어 style 변경만 최소화한다.

## 결과
- `src/core/navigation/root-native-tabs.tsx`의 bottom tab bar를 shadow/elevation 없는 white surface + hairline top divider로 정리했다.
- boxed/floating tab container처럼 보일 수 있는 radius, margin, heavy shadow 스타일은 추가하지 않았다.
- Android tab bar 높이와 padding을 살짝 줄여 native bottom bar에 가깝게 보이도록 조정했다.
- 연결 context: `context/context_20260516_native_tab_feel.md`
