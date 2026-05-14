# Context 2026-05-15 AC 4 Checklist Supporting Only

## 작업
AC 4 `checklist_supporting_only`: Checklist progress는 Home Continue에서 supporting progress로 표시할 수 있지만, required cut saved My Take 누락을 완료로 덮어쓰지 않도록 고정했다.

## 변경
- Updated `src/features/home/lib/home-workflow-resolution.test.ts`
  - `shotSceneCount === totalSceneCount`인 board라도 required My Take 하나가 누락되면 Continue 후보로 유지되는 focused coverage를 추가했다.
- Updated `src/features/home/lib/home-continue-workflow-card.ts`
  - `HomeContinueWorkflowCard.supportingProgressLabel`을 추가했다.
  - 기존 numeric progress copy를 `체크리스트 3/3컷` / `Checklist 3/3 cuts`로 명시해 supporting progress임을 드러냈다.
  - Parallel sibling highlight test가 요구하는 `getHomeContinueWorkflowEntry(...).highlightCutId` path와 호환되도록 유지했다.
- Updated `src/features/home/components/home-workspace-surface.tsx`
  - Continue card의 owner/progress line이 `card.supportingProgressLabel`을 사용하도록 변경했다.
- Updated `src/features/home/lib/home-continue-workflow-card.test.ts`
  - Checklist progress가 complete처럼 보여도 missing required My Take board가 Continue card로 유지되고, supporting label/body copy가 표시되는지 검증했다.
- Updated `src/features/home/lib/home-workflow-resolution.ts`
  - Shared focused suite unblock을 위해 `getNextRequiredCutWithoutSavedMyTakeId`를 export했다. 판정은 required cut saved My Take state만 사용한다.
- Updated `plans/20260515_ac4_checklist_supporting_only.md`
  - 결과와 연결 context 파일명을 기록했다.

## 검증
- RED: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
  - 실패: supporting progress label 부재.
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-workflow-resolution.test.ts`
- GREEN: `NODE_PATH=src ./node_modules/.bin/sucrase-node src/features/home/lib/home-continue-workflow-card.test.ts`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-workflow-resolution-check.json`
- GREEN: `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.home-continue-workflow-card-check.json`

## 리스크 / 후속
- No navigation tab changes, CTA label changes, persistence refactor, or camera/checklist deep restore behavior were introduced.
- No commit or push performed per Seed constraint.
