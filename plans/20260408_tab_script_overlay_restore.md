# 탭별 스크립트 오버레이 복원 계획

## 배경
예전 recipe/shooting 흐름에서 `View Script` 버튼을 눌러 스크립트만 따로 보는 경험이 있었고, 현재 `Analysis / Recipe / Prompter` 상세 화면에도 비슷한 빠른 접근이 필요합니다.

## 목표
`Analysis` 탭에서는 original transcript 전용 플로팅 버튼을, `Recipe` 탭에서는 creator script 전용 플로팅 버튼을 제공하고 버튼 클릭 시 스크립트만 담긴 바텀시트를 띄웁니다.

## 범위
- 상세 화면(`selectedScene`) 기준 탭 상태에 맞춘 플로팅 CTA 추가
- `Analysis` 탭: original transcript 전용 sheet
- `Recipe` 탭: recommended script 전용 sheet
- 기존 `Prompter` 탭과 chat sheet 동작은 유지하되 겹침은 방지

## 변경 파일
- `plans/20260408_tab_script_overlay_restore.md`
- `src/components/common/RecipeResult.tsx`
- `context/context_20260408_tab_script_overlay_restore.md` (작업 후 기록)

## 테스트
- 코드 변경 후 별도 실행 검증은 사용자 요청 시 진행

## 롤백
- `src/components/common/RecipeResult.tsx`의 script CTA/sheet 상태와 렌더링 블록 제거

## 리스크
- 기존 inline transcript/script 카드와 새 sheet가 동시에 존재해 정보가 중복돼 보일 수 있습니다.
- chat assistant sheet와 script sheet가 동시에 열리면 사용감이 복잡해질 수 있어 상호 배타적으로 처리해야 합니다.

## 결과
- `Analysis` 탭에서 `View Original Script` 플로팅 버튼을 눌러 original transcript 전용 바텀시트를 열 수 있게 했습니다.
- `Recipe` 탭에서 `View Your Script` 플로팅 버튼을 눌러 creator script 전용 바텀시트를 열 수 있게 했습니다.
- script sheet와 chat assistant sheet는 동시에 열리지 않도록 정리했습니다.
- 연결 context: `context/context_20260408_tab_script_overlay_restore.md`
