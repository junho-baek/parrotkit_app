# Prompter Persistence And Custom Blocks

## 배경
- 최근 debounce 도입으로 prompter block 변경 직후 화면을 이탈하면 마지막 편집이 유실될 수 있다.
- 현재 prompter 화면에서는 visible/size/preset/scale 정도만 조절 가능하고, 사용자가 직접 cue 텍스트를 고치거나 새 cue를 추가할 수 없다.

## 목표
- prompter block 편집은 로컬 복구 상태를 즉시 반영하고 서버 저장만 debounce해서 유실을 막는다.
- prompter 화면에서 사용자가 block label/content를 자유롭게 수정하고 custom cue를 추가할 수 있게 한다.

## 범위
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- 작업 기록 문서

## 변경 파일
- debounce 저장 흐름 정리 및 pending flush 처리
- prompter layout panel에 label/content/type 편집 UI 추가
- custom cue block 추가/삭제 지원

## 테스트
- `npx eslint src/components/common/RecipeResult.tsx src/components/common/CameraShooting.tsx`
- 수동 확인
  - prompter block 편집 후 즉시 뒤로가기/씬 이동 시 편집 보존 확인
  - layout panel에서 기존 cue 텍스트 수정 확인
  - custom cue 추가/삭제 및 visible 반영 확인

## 롤백
- custom cue 편집 UI가 과하면 기존 visible/size/preset/scale 패널로 되돌린다.
- debounce fix가 불안정하면 sessionStorage와 PATCH 모두 즉시 저장으로 되돌린다.

## 리스크
- block text를 keystroke 단위로 저장하므로 state 업데이트 빈도가 증가한다.
- built-in block 삭제까지 허용하면 fallback normalization과 충돌할 수 있어 이번 범위에서는 custom block 삭제만 허용한다.

## 결과
- 완료
- prompter block 변경은 local session state를 즉시 반영하고, 서버 저장만 debounce하도록 조정했다.
- pending 변경이 남은 상태로 화면을 떠나도 cleanup에서 마지막 변경을 flush하도록 보강했다.
- prompter layout panel에서 label/content/type 편집과 custom cue 추가/삭제를 지원하게 했다.

## 연결 context
- `context/context_20260408_101930_prompter_persistence_custom_blocks.md`
