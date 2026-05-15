# Context 2026-05-16 Native Tab Feel

## 작업
AC 3: bottom bar가 boxed custom component가 아니라 lightweight/native-feeling presentation을 사용하도록 조정했다.

## DESIGN.md 확인
- `DESIGN.md`의 "containers support it, they do not shout over it" 방향을 확인했다.
- Simplicity Guardrails와 Layout의 bottom inset/safe-area 관련 지침을 확인했다.

## 변경
- `src/core/navigation/root-native-tabs.tsx`
  - tab bar를 white surface + hairline top divider로 명시했다.
  - tab bar shadow/elevation을 제거했다.
  - hidden tab bar 상태도 border/shadow가 남지 않도록 정리했다.
  - Android tab bar height/padding을 소폭 낮춰 floating/boxed 느낌을 줄였다.

## 검증
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.root-tabs-check.json` 통과.
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json` 통과.
- `npm run` 확인 결과 이 repo에는 lint 또는 DESIGN.md lint script가 노출되어 있지 않다.
- `test -s DESIGN.md && rg -n "Simplicity Guardrails|Use bottom inset|Typography should reduce UI complexity|not a workflow console" DESIGN.md`로 관련 design source text 존재를 확인했다.
- `rg -n "tabBar:\s*\{|borderRadius|shadowOpacity|elevation|marginHorizontal|paddingHorizontal" src/core/navigation/root-native-tabs.tsx`로 tab bar에 boxed container용 radius/margins/paddingHorizontal이 없고 shadow/elevation이 0임을 확인했다.

## 리스크
- simulator/live native screenshot 검증은 수행하지 않았다.
- sibling tasks가 같은 tab file을 수정 중일 수 있어 route visibility나 Home hierarchy는 건드리지 않았다.
