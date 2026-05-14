# AC 4 Checklist Supporting Only

## 배경
Home Continue completion은 required cut의 saved My Take 상태를 주 기준으로 삼아야 한다. 기존 `shotSceneCount/totalSceneCount` 기반 진행률은 Home 카드에서 표시할 수 있지만, required My Take가 비어 있으면 완료 판정으로 사용되면 안 된다.

## 목표
- Checklist-style progress가 표시용 supporting progress임을 card contract/copy에 명시한다.
- Checklist progress가 100%여도 required My Take가 누락된 board는 Continue 후보로 유지되는지 검증한다.

## 범위
- `src/features/home/lib/home-workflow-resolution.test.ts`
- `src/features/home/lib/home-continue-workflow-card.ts`
- `src/features/home/lib/home-continue-workflow-card.test.ts`
- `context/context_20260515_ac4_checklist_supporting_only.md`

## 변경 파일
- 테스트와 helper 중심의 최소 변경만 수행한다.
- Navigation, persistence, board overview highlight 로직은 sibling task와 겹치므로 변경하지 않는다.

## 테스트
- RED: focused home workflow/card tests에서 supporting progress contract 부재 실패 확인.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: relevant TypeScript check(s)

## 롤백
- 위 테스트/helper/context 변경을 되돌린다.

## 리스크
- Existing UI already shows numeric progress. Copy/contract를 좁게 보강해 큰 persistence/navigation refactor 없이 AC 4만 고정한다.

## 결과
- Home Continue card에 `supportingProgressLabel`을 추가해 `shotSceneCount/totalSceneCount`를 `체크리스트 ...` / `Checklist ...` supporting progress로 명시했다.
- Home Continue panel의 owner/progress line도 `card.supportingProgressLabel`을 사용하도록 조정했다.
- Checklist progress가 3/3이어도 required My Take가 하나 누락되면 Continue 후보로 유지되는 focused test를 추가했다.
- Parallel sibling test가 요구한 `getNextRequiredCutWithoutSavedMyTakeId` export도 동일 required-cut/My Take 판정으로 보강해 shared focused suite가 통과하도록 했다.
- 연결 context: `context/context_20260515_ac4_checklist_supporting_only.md`
