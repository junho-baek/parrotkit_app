# Context - Prompter Persistence And Custom Blocks

## 작업 요약
- prompter block 변경 저장에서 `sessionStorage`는 즉시 반영하고, 서버 PATCH만 debounce하도록 바꿨다.
- pending prompter 변경이 남아 있을 때 recipe를 이탈하면 cleanup에서 마지막 변경을 flush하도록 보강했다.
- prompter `Layout` 패널에서 사용자가 block label/content/type을 직접 수정할 수 있게 했다.
- 사용자가 custom cue block을 추가하고, custom block은 필요 시 제거할 수 있게 했다.

## 주요 변경 파일
- `src/components/common/RecipeResult.tsx`
- `src/components/common/CameraShooting.tsx`
- `plans/20260408_prompter_persistence_and_custom_blocks.md`

## 구현 메모
- `RecipeResult`는 `pendingPrompterScenesRef`를 추가해 debounce 대기 중인 최신 scene 배열을 보관한다.
- `schedulePrompterPersistence()`는 이제 `syncRecipeSessionStorage(nextScenes)`를 즉시 호출하고, `recipeId`가 있을 때만 PATCH를 debounce한다.
- `flushPendingPrompterPersistence()`는 unmount / recipe 전환 cleanup 시 마지막 pending 변경을 로컬과 서버에 반영한다.
- assistant가 scene update를 적용할 때는 pending prompter 저장을 취소하고 최신 scene을 즉시 sessionStorage + PATCH에 반영한다.
- `CameraShooting` layout panel에는 아래 편집 항목을 추가했다.
  - block label input
  - cue text textarea
  - tone(type) select
  - custom cue 추가 버튼
  - custom cue 제거 버튼
- built-in block은 fallback normalization과 충돌하지 않도록 삭제 대신 visible toggle과 내용 수정 중심으로 유지했다.

## 검증
- `npx eslint src/components/common/RecipeResult.tsx src/components/common/CameraShooting.tsx`
  - error 없음
  - 기존 `RecipeResult.tsx`의 `<img>` warning 5건만 유지
- `npx tsc --noEmit --pretty false`

## 남은 리스크
- 이번 턴은 브라우저 수동 QA까지는 못 돌려서, 실제 조작감은 한번 더 확인하는 편이 좋다.
- custom cue는 기본적으로 `keyword` tone으로 생성되며, 사용자가 다른 tone으로 바꾸는 흐름을 전제로 한다.
