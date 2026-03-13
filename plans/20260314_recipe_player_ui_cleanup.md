# Recipe Player UI 정리 (중복 Back 제거 + 재생바 제거 + Script 버튼 조건)

## 배경
- Recipe 화면에서 상단 헤더 Back과 플레이어 내부 Back이 동시에 보여 중복된다.
- 재생 바가 화면 밀도를 높여 촬영/스크립트 집중을 방해한다.
- Script 모달이 열린 상태에서도 `View Script` 버튼이 남아 UI가 겹친다.

## 목표
- Back 버튼은 최상단 헤더의 Back만 유지.
- 플레이어 내 재생 시간/진행 바 UI 제거.
- Script 모달 열림 상태에서는 `View Script` 버튼 숨김.

## 범위
- `RecipeVideoPlayer` UI 컴포넌트 수정.

## 변경 파일
- `src/components/common/RecipeVideoPlayer.tsx`
- `plans/20260314_recipe_player_ui_cleanup.md`
- `context/context_20260314_*.md`

## 테스트
- `npm run build`
- 수동 확인:
  - Recipe 탭에서 Back 버튼 1개만 노출
  - 재생 바/시간 표시 제거
  - Script 모달 오픈 시 View Script 버튼 미노출

## 롤백
- `RecipeVideoPlayer.tsx` 변경 revert 시 이전 UI로 복원.

## 리스크
- 진행 시간 표시 제거로 세그먼트 위치 가시성이 줄어들 수 있음(현재는 start/end 텍스트가 헤더/씬 정보로 보완).

## 결과
- `RecipeVideoPlayer` 내부 Back 버튼을 제거해 최상단 헤더 Back만 남겼다.
- 플레이어 내부 재생 시간/진행 바 UI를 제거했다.
- `scriptOpen === true`일 때 `View Script` 버튼을 렌더링하지 않도록 변경했다.
- 빌드 검증: `npm run build` 통과.
- 연결 context: `context/context_20260314_034416_recipe_player_ui_cleanup.md`
