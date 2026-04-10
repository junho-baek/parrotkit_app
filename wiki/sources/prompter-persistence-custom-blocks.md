# 프롬프터 저장 안정화와 커스텀 큐 | Prompter Persistence And Custom Blocks

## Summary

이 context는 같은 날 리뷰에서 드러난 prompter 저장 유실 리스크를 실제 구현으로 보강한 기록이다. 핵심은 "로컬 반영은 즉시, 서버 저장만 debounce"로 역할을 분리하고, cleanup 시 마지막 pending 변경을 flush하는 것이다. 동시에 creator가 직접 custom cue를 만들고 편집할 수 있는 기능도 추가됐다.

## Key Points

- `sessionStorage`는 즉시 동기화하고, 서버 PATCH만 debounce하도록 분리했다.
- `pendingPrompterScenesRef`와 `flushPendingPrompterPersistence()`를 통해 unmount/recipe 전환 시 마지막 변경을 밀어넣도록 보강했다.
- assistant가 scene update를 적용할 때도 pending 상태를 정리하고 최신 scene을 즉시 반영한다.
- `CameraShooting`의 Layout 패널에서 label/content/type 편집, custom cue 추가/제거가 가능해졌다.
- built-in block은 fallback normalization과 충돌하지 않도록 "삭제"보다 visible toggle과 내용 수정 중심으로 유지한다.

## Entities

- [RecipeResult](../entities/recipe-result.md)
- [CameraShooting](../entities/camera-shooting.md)

## Concepts

- [프롬프터 지속성 및 인라인 편집 | Prompter Persistence And Inline Editing](../concepts/prompter-persistence-and-inline-editing.md)
- [분석-레시피-슈팅 스택 | Analysis-Recipe-Shooting Stack](../concepts/analysis-recipe-shooting-stack.md)

## Contradictions

- creator에게 custom cue 삭제를 허용하면서도 built-in block은 제거보다 숨김을 선호해, 동일한 "없애기" 동작도 block 종류에 따라 의미가 달라진다.

## Open Questions

- 이 context는 정적 검증만 포함하고 있어 실제 조작감과 custom cue 편집 discoverability는 배포 QA가 더 필요하다.
- custom cue의 기본 tone이 `keyword`인 설계가 장기적으로 충분한 기본값인지 아직 확정적이지 않다.

## Source Details

- Source file: `context/context_20260408_101930_prompter_persistence_custom_blocks.md`
- Date: 2026-04-08
