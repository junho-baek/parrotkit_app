# Issues 7 9 4 UI Burn-Down Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close GitHub issues #7, #9, and #4 by aligning Explore and the shooting board with `DESIGN.md`: cards and rows should not carry redundant CTA buttons, the shooting board should behave and look like a full page rather than a sheet/card pile, and next-cut guidance should remain passive without auto-opening, auto-focusing, or jumping into camera.

**Architecture:** Keep the current Expo Router / feature-folder structure. Make the changes in small issue-sized slices with source-contract tests first, then UI implementation, then native screenshot QA. Use existing feature modules rather than introducing a new architecture layer: Explore stays under `src/features/explore`, recipe execution stays under `src/features/recipes`, and navigation behavior stays in the current route stack. Treat `DESIGN.md` as the product contract and add guard tests for the regression-prone UI rules.

**Tech Stack:** React Native, Expo Router, TypeScript, existing lightweight `sucrase-node` test files, GitHub CLI, Android Emulator, iOS Simulator through the working CoreSimulator `simctl` binary if the Xcode wrapper hangs.

---

## Issue Map

- GitHub #7: Simplify Explore card CTA model.
- GitHub #9: Rework shooting board page layout and reference placement.
- GitHub #4: Passive next-cut guidance without auto-open/focus.

## Current Signals To Preserve

- The restored `recipe-create` drawer flow is correct and should not be touched here.
- Paste remains an in-place global tab action and should not become a page again.
- Product wording should remain sparse: no explanatory labels unless they help the user act.
- `DESIGN.md` says whole-card CTA surfaces should not also have redundant CTA buttons.
- `DESIGN.md` says recipe boards are pages and should show useful execution content only.

## Target File Set

- `plans/20260516_issues_7_9_4_design_burn_down.md`
- `context/context_20260516_issues_7_9_4_design_burn_down.md`
- `src/features/explore/screens/explore-screen.tsx`
- `src/features/explore/lib/explore-card-cta-contract.test.ts`
- `src/features/recipes/screens/recipe-detail-screen.tsx`
- `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts`
- `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`
- `src/features/recipes/components/shoot-board-scene-card.tsx`
- `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- Existing recipe component tests touched only if their expectations are now stale:
  - `src/features/recipes/components/cut-card-body-preview.test.ts`
  - `src/features/recipes/components/cut-card-media-slots.test.ts`
  - `src/features/recipes/components/cut-card-reference-viewer-section.test.ts`
  - `src/features/recipes/components/cut-card-take-viewer-section.test.ts`
- QA artifacts:
  - `output/playwright/issue-7-explore-qa-20260516/`
  - `output/playwright/issue-9-board-qa-20260516/`
  - `output/playwright/issue-4-passive-next-cut-qa-20260516/`
  - `output/reports/20260516_issues_7_9_4_design_burn_down.md`

## Execution Plan

### 1. Baseline And Work Log

- [ ] Confirm the clone is clean and current enough for this work:

  ```bash
  git status --short --branch
  git fetch origin
  git log --oneline -5
  ```

  Expected output:

  - `git status` shows `main...origin/main` with no local code changes other than the plan if already created.
  - Latest commits include the Paste/iOS tab work.

- [ ] Read the latest local context and relevant plans:

  ```bash
  ls -t context/context_*.md | head -5
  ls -t plans/*.md | head -10
  sed -n '180,225p' DESIGN.md
  ```

  Expected output:

  - The design rules around redundant CTA buttons, box-in-box, labels, and recipe boards are visible.

- [ ] Create the required AGENTS work plan before code changes:

  File: `plans/20260516_issues_7_9_4_design_burn_down.md`

  Content:

  ```markdown
  # Issues 7 9 4 Design Burn-Down

  ## 배경
  GitHub #7, #9, #4 are the next UI regression fixes after Paste/navigation recovery. They share the same design concern: execution surfaces should be direct, sparse, and page-like instead of button-heavy or card-heavy.

  ## 목표
  - #7: Explore cards/rows become the primary CTA surface without duplicate button clusters.
  - #9: Shooting board opens and reads as a full-page board with reference media placed near cut copy where practical.
  - #4: Continue/next-cut guidance stays passive and does not auto-open, auto-focus, auto-scroll, or jump to camera.

  ## 범위
  Explore card CTA model, recipe detail board behavior, shoot board cut layout, source-contract tests, native screenshot QA, GitHub issue updates.

  ## 변경 파일
  See docs/superpowers/plans/2026-05-16-issues-7-9-4-ui-burn-down.md.

  ## 테스트
  sucrase-node focused tests, TypeScript, design lint, Android/iPhone screenshot QA.

  ## 롤백
  Revert the implementation commit. If only one issue regresses, revert that issue-sized slice because commits should remain separable or clearly documented.

  ## 리스크
  Board layout refactor may disturb saved take/reference affordances. Preserve core actions and verify on both platforms.
  ```

### 2. Add Source Contracts For #7

- [ ] Inspect the current Explore action surfaces:

  ```bash
  rg -n "getExploreTemplateAction|ActionAffordance|handleAction|saveRecipe|shootRecipe|Pressable|Touchable|Button" src/features/explore/screens/explore-screen.tsx
  rg -n "Explore" src/features/explore src/core -g '*.test.ts'
  ```

- [ ] Add `src/features/explore/lib/explore-card-cta-contract.test.ts` with source-level assertions that match #7 and `DESIGN.md`.

  Required assertions:

  - `explore-screen.tsx` does not import `getExploreTemplateAction`.
  - `explore-screen.tsx` does not import `getExploreTemplateActionAffordance`.
  - Recommended cards are opened from the card press surface.
  - Browse rows are opened from the row press surface.
  - No duplicate action labels like `Start shooting`, `Open`, or `Save recipe` are rendered inside Explore card/row button clusters.

  Suggested implementation:

  ```ts
  import assert from 'node:assert/strict';
  import { readFileSync } from 'node:fs';
  import { resolve } from 'node:path';

  const source = readFileSync(
    resolve(__dirname, '../screens/explore-screen.tsx'),
    'utf8',
  );

  assert.equal(source.includes('getExploreTemplateAction'), false);
  assert.equal(source.includes('getExploreTemplateActionAffordance'), false);
  assert.match(source, /onPress=\{[^}]*openCard|onPress=\{\(\) => openCard/);
  assert.equal(/Start shooting|Save recipe|Open recipe/.test(source), false);

  console.log('explore-card-cta-contract: ok');
  ```

- [ ] Run the failing contract first:

  ```bash
  ./node_modules/.bin/sucrase-node src/features/explore/lib/explore-card-cta-contract.test.ts
  ```

  Expected output before implementation:

  - The test fails because the old action helpers/buttons are still present.

### 3. Implement #7 Explore CTA Simplification

- [ ] Edit `src/features/explore/screens/explore-screen.tsx`.

  Implementation requirements:

  - Remove imports for action helper APIs that exist only to build duplicate CTAs:
    - `getExploreTemplateAction`
    - `getExploreTemplateActionAffordance`
    - `getExploreTemplateCardStartShootingHref`, if it only feeds the removed button.
  - Remove local callbacks whose only job is button-specific action routing:
    - `handleAction`
    - `saveRecipe`
    - `shootRecipe`
  - Keep one primary press target:
    - Recommended template card press opens the template detail or recipe detail.
    - Browse row press opens the same target.
  - Keep a subtle affordance only:
    - A chevron icon or short secondary text is acceptable.
    - Do not add a filled/purple CTA button inside a card that is already tappable.
  - Do not add new instructional copy.

- [ ] Preserve accessibility by setting meaningful labels on the whole-card/whole-row pressables:

  ```tsx
  accessibilityRole="button"
  accessibilityLabel={`Open ${template.title}`}
  ```

- [ ] Verify #7 contract:

  ```bash
  ./node_modules/.bin/sucrase-node src/features/explore/lib/explore-card-cta-contract.test.ts
  ```

  Expected output:

  - `explore-card-cta-contract: ok`

### 4. Add Source Contracts For #4 Passive Next-Cut Guidance

- [ ] Inspect current auto-expansion and highlight behavior:

  ```bash
  rg -n "highlightCutId|setExpandedCutIds|auto|focus|scroll|camera|sceneId" src/features/recipes/screens/recipe-detail-screen.tsx src/features/recipes/screens/recipe-detail
  ```

- [ ] Add or update `src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts`.

  Required assertions:

  - Board overview state can identify a passive next cut.
  - Board overview state must not require an auto-open cut id.
  - Empty or missing board state falls back safely.

  Suggested assertions if the helper stays named `getBoardOverviewUiState`:

  ```ts
  import assert from 'node:assert/strict';
  import { getBoardOverviewUiState } from './recipe-detail-board-state';

  const state = getBoardOverviewUiState({
    scenes: [
      { id: 'cut-1', title: 'Hook', isComplete: true },
      { id: 'cut-2', title: 'Demo', isComplete: false },
    ],
  } as any);

  assert.equal(state.highlightCutId, 'cut-2');
  assert.equal('autoExpandCutId' in state, false);

  const emptyState = getBoardOverviewUiState({ scenes: [] } as any);
  assert.equal(emptyState.highlightCutId, null);

  console.log('recipe-detail-board-state: passive next-cut ok');
  ```

- [ ] Add a source guard in the same test or a separate assertion block that checks `recipe-detail-screen.tsx` does not auto-expand from overview highlight:

  ```ts
  import { readFileSync } from 'node:fs';
  import { resolve } from 'node:path';

  const screenSource = readFileSync(
    resolve(__dirname, '../recipe-detail-screen.tsx'),
    'utf8',
  );

  assert.equal(
    /setExpandedCutIds\(\[[^\]]*highlightCutId/.test(screenSource),
    false,
  );
  ```

- [ ] Run the failing contract:

  ```bash
  ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
  ```

  Expected output before implementation:

  - The test fails if current screen still auto-expands from `highlightCutId`.

### 5. Implement #4 Passive Next-Cut Guidance

- [ ] Edit `src/features/recipes/screens/recipe-detail-screen.tsx`.

  Required behavior:

  - Opening a recipe from Home/Continue lands on the board overview.
  - The next required cut may be visually indicated only as passive guidance.
  - Do not call `setExpandedCutIds([highlightCutId])` from overview state.
  - Do not auto-scroll to the next cut.
  - Do not focus input/camera.
  - Manual user expansion remains respected.
  - Explicit deep link by `sceneId` may still open the requested scene because that is user/navigation intent, not passive guidance.

- [ ] Prefer this shape:

  ```tsx
  useEffect(() => {
    const requestedSceneId = params.sceneId;
    if (!requestedSceneId) return;

    const targetCut = renderedShootBoard.scenes
      .flatMap((scene) => scene.cuts)
      .find((cut) => cut.id === requestedSceneId);

    if (targetCut) {
      setExpandedCutIds([targetCut.id]);
    }
  }, [params.sceneId, renderedShootBoard]);
  ```

  And remove the `boardOverviewState.highlightCutId` dependency from this auto-expansion path.

- [ ] Keep highlight prop if it is purely visual:

  ```tsx
  highlighted={cut.id === boardOverviewState.highlightCutId}
  ```

  But keep the visual subtle: no forced open state and no giant active label.

- [ ] Run #4 contract:

  ```bash
  ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
  ```

  Expected output:

  - `recipe-detail-board-state: passive next-cut ok`

### 6. Add Source Contracts For #9 Shooting Board Layout

- [ ] Inspect the current card-in-card surfaces:

  ```bash
  rg -n "editorSection|referenceViewerSection|takeViewerSection|mediaSlots|saved|reference|Line to say|Shot guide|촬영" src/features/recipes/components/shoot-board-scene-card.tsx
  rg -n "ShootBoard|scene card|reference viewer|take viewer" src/features/recipes/components/*.test.ts src/features/recipes/lib/*.test.ts
  ```

- [ ] Add `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`.

  Required assertions:

  - The expanded board body does not render separate nested boxes named `editorSection`, `referenceViewerSection`, or `takeViewerSection`.
  - Source retains useful content sections:
    - Line to say
    - Shot guide
    - Checklist/progress
    - Saved takes/reference affordance
  - Source uses page/board language instead of card-centric copy in user-visible text.

  Suggested implementation:

  ```ts
  import assert from 'node:assert/strict';
  import { readFileSync } from 'node:fs';
  import { resolve } from 'node:path';

  const source = readFileSync(resolve(__dirname, './shoot-board-scene-card.tsx'), 'utf8');

  for (const forbidden of ['editorSection', 'referenceViewerSection', 'takeViewerSection']) {
    assert.equal(source.includes(forbidden), false, `${forbidden} should not survive the board layout refactor`);
  }

  for (const required of ['Line to say', 'Shot guide', 'Saved takes']) {
    assert.equal(source.includes(required), true, `${required} should remain visible`);
  }

  assert.equal(/card pile|card-centric|Open card/i.test(source), false);

  console.log('shoot-board-scene-card-design-contract: ok');
  ```

- [ ] Run the failing contract:

  ```bash
  ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
  ```

  Expected output before implementation:

  - The test fails because nested section names still exist.

### 7. Implement #9 Board Page Layout

- [ ] Edit `src/features/recipes/components/shoot-board-scene-card.tsx`.

  Required visual changes:

  - Treat each expanded cut as a board row/section, not a card inside a card.
  - Remove nested bordered boxes around editor/reference/take areas.
  - Place reference media/image near the cut copy.
  - Stack reference under copy only when width or platform constraints make side-by-side awkward.
  - Keep action density low and execution-oriented.

- [ ] Suggested component structure inside the expanded body:

  ```tsx
  <View style={styles.cutBoardBody}>
    <View style={styles.cutBoardPrimary}>
      <View style={styles.cutCopyColumn}>
        <Text style={styles.sectionEyebrow}>Line to say</Text>
        {lineToSay}
        <Text style={styles.sectionEyebrow}>Shot guide</Text>
        {shotGuide}
      </View>
      <View style={styles.cutReferenceColumn}>
        {referencePreview}
      </View>
    </View>
    {checklist}
    {savedTakes}
  </View>
  ```

  Keep labels short and meaningful. Do not add "how to use this page" copy.

- [ ] Style requirements:

  - Outer section can keep lightweight separators, but no thick nested cards.
  - Border radius should stay at or under the existing design norm unless the current component already requires otherwise.
  - Avoid violet glow as a default state.
  - Avoid box shadows for normal board rows.
  - Keep text sizes compact inside board sections.

- [ ] Ensure this issue does not regress existing actions:

  - Reference image opens or remains inspectable.
  - Saved takes are visible.
  - Film/take action remains reachable.
  - Checklist/progress remains visible, but progress should not become decorative noise.

- [ ] Run #9 contract:

  ```bash
  ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
  ```

  Expected output:

  - `shoot-board-scene-card-design-contract: ok`

### 8. Run Focused Regression Tests

- [ ] Run focused tests and source contracts:

  ```bash
  ./node_modules/.bin/sucrase-node src/features/explore/lib/explore-card-cta-contract.test.ts
  ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts
  ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
  ./node_modules/.bin/sucrase-node src/features/recipes/components/cut-card-body-preview.test.ts
  ./node_modules/.bin/sucrase-node src/features/recipes/components/cut-card-media-slots.test.ts
  ./node_modules/.bin/sucrase-node src/features/recipes/components/cut-card-reference-viewer-section.test.ts
  ./node_modules/.bin/sucrase-node src/features/recipes/components/cut-card-take-viewer-section.test.ts
  ```

  Expected output:

  - All focused tests print their `ok` messages.
  - If existing cut-card tests are now stale because nested sections were intentionally removed, update them to test the new board body contract instead of deleting coverage.

- [ ] Run TypeScript:

  ```bash
  ./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
  ```

  Expected output:

  - No TypeScript errors.

- [ ] Run design lint:

  ```bash
  npx -y @google/design.md lint DESIGN.md
  ```

  Expected output:

  - `DESIGN.md` rules are valid. This command validates the design document, not the app UI, so treat it as a guardrail rather than final QA.

- [ ] Run whitespace diff guard:

  ```bash
  git diff --check
  ```

  Expected output:

  - No trailing whitespace or conflict markers.

### 9. Native QA For #7

- [ ] Start the app through the existing local dev flow. Use `npm run dev` or the project-standard Expo command. Do not run `npm run build` unless explicitly requested.

- [ ] Capture Explore on Android:

  Save under:

  - `output/playwright/issue-7-explore-qa-20260516/android-explore-overview.png`
  - `output/playwright/issue-7-explore-qa-20260516/android-explore-card-open.png`

  Required observations:

  - Recommended card has no duplicate purple CTA button.
  - Browse row has no button cluster.
  - Tapping the card opens the intended detail/recipe surface.
  - Tapping the row opens the intended detail/recipe surface.

- [ ] Capture Explore on iPhone:

  Save under:

  - `output/playwright/issue-7-explore-qa-20260516/ios-explore-overview.png`
  - `output/playwright/issue-7-explore-qa-20260516/ios-explore-card-open.png`

  If `/Applications/Xcode.app/.../usr/bin/simctl` hangs, use:

  ```bash
  /Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl list devices available
  ```

### 10. Native QA For #4

- [ ] Capture Continue-to-board behavior on Android:

  Save under:

  - `output/playwright/issue-4-passive-next-cut-qa-20260516/android-board-overview.png`

  Required observations:

  - Continue lands on board overview.
  - No camera jump.
  - No auto-opened next cut.
  - Next guidance, if visible, is passive and lightweight.

- [ ] Capture Continue-to-board behavior on iPhone:

  Save under:

  - `output/playwright/issue-4-passive-next-cut-qa-20260516/ios-board-overview.png`

  Required observations:

  - Same as Android.

### 11. Native QA For #9

- [ ] Capture the recipe/shooting board on Android:

  Save under:

  - `output/playwright/issue-9-board-qa-20260516/android-board-page.png`
  - `output/playwright/issue-9-board-qa-20260516/android-reference-copy-area.png`

  Required observations:

  - Board reads as a full-page board, not as a drawer/sheet.
  - Expanded cut does not look like nested card pile.
  - Reference/copy area is visually close.
  - Line to say, shot guide, checklist/progress, and saved takes remain reachable.

- [ ] Capture the recipe/shooting board on iPhone:

  Save under:

  - `output/playwright/issue-9-board-qa-20260516/ios-board-page.png`
  - `output/playwright/issue-9-board-qa-20260516/ios-reference-copy-area.png`

  Required observations:

  - Same as Android.

### 12. Write QA Report And Context

- [ ] Write `output/reports/20260516_issues_7_9_4_design_burn_down.md`.

  Required sections:

  ```markdown
  # Issues 7 9 4 Design Burn-Down QA

  ## Test Time
  2026-05-16 Asia/Seoul

  ## Scope
  #7 Explore CTA simplification, #9 shooting board layout, #4 passive next-cut guidance.

  ## Commands
  List every command run and result.

  ## Android Evidence
  Link screenshots with absolute or repo-relative paths.

  ## iPhone Evidence
  Link screenshots with absolute or repo-relative paths.

  ## Results
  PASS/FAIL per issue.

  ## Remaining Risks
  Any visual or simulator caveats.

  ## Next Actions
  Whether each issue should be closed.
  ```

- [ ] Write `context/context_20260516_issues_7_9_4_design_burn_down.md`.

  Required summary:

  - What changed.
  - Which issues were verified.
  - Test commands and outcomes.
  - QA artifacts.
  - GitHub issue actions.
  - Remaining follow-up, if any.

- [ ] Update the AGENTS plan file `plans/20260516_issues_7_9_4_design_burn_down.md` with:

  - Result summary.
  - Link to context file.
  - Link to QA report.

### 13. GitHub Issue Closure

- [ ] If #7 passes tests and native QA, comment and close:

  ```bash
  gh issue comment 7 --body-file output/reports/20260516_issues_7_9_4_design_burn_down.md
  gh issue close 7 --comment "Closed after Explore CTA simplification QA. Cards/rows are now the primary action surfaces without duplicate CTA clusters."
  ```

- [ ] If #4 passes tests and native QA, comment and close:

  ```bash
  gh issue close 4 --comment "Closed after passive next-cut QA. Continue lands on the board overview without auto-open, auto-focus, auto-scroll, or camera jump."
  ```

- [ ] If #9 passes tests and native QA, comment and close:

  ```bash
  gh issue close 9 --comment "Closed after shooting board layout QA. Board now reads as a full page and removes nested card-style reference/take sections while keeping execution content reachable."
  ```

- [ ] Update parent epics without closing them unless all child work is done:

  ```bash
  gh issue comment 5 --body "Updated: #7, #9, and #4 have been addressed and QA'd in the design burn-down pass. #10 remains the broad native QA package before closing the emergency UI regression epic."
  gh issue comment 1 --body "Updated: #4 passive next-cut guidance has been addressed. Continue now remains on board overview and preserves manual user choice."
  ```

### 14. Commit And Push

- [ ] Review the final diff:

  ```bash
  git status --short
  git diff --stat
  git diff --check
  ```

- [ ] Rebase or pull latest main before pushing:

  ```bash
  git fetch origin
  git pull --rebase origin main
  ```

  Expected output:

  - Rebase succeeds without conflicts.

- [ ] Commit:

  ```bash
  git add plans/20260516_issues_7_9_4_design_burn_down.md \
    context/context_20260516_issues_7_9_4_design_burn_down.md \
    output/reports/20260516_issues_7_9_4_design_burn_down.md \
    output/playwright/issue-7-explore-qa-20260516 \
    output/playwright/issue-9-board-qa-20260516 \
    output/playwright/issue-4-passive-next-cut-qa-20260516 \
    src/features/explore/screens/explore-screen.tsx \
    src/features/explore/lib/explore-card-cta-contract.test.ts \
    src/features/recipes/screens/recipe-detail-screen.tsx \
    src/features/recipes/screens/recipe-detail/recipe-detail-board-state.ts \
    src/features/recipes/screens/recipe-detail/recipe-detail-board-state.test.ts \
    src/features/recipes/components/shoot-board-scene-card.tsx \
    src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
  git commit -m "fix: align explore and board design flows"
  git push origin main
  ```

## Suggested Agent Split

Use `superpowers:subagent-driven-development` for implementation.

- Agent A owns #7:
  - Files under `src/features/explore`.
  - No recipe files.
  - Output: Explore CTA simplification plus #7 test and QA notes.

- Agent B owns #4:
  - Files under `src/features/recipes/screens/recipe-detail*`.
  - No visual refactor in scene card.
  - Output: passive next-cut behavior plus #4 test and QA notes.

- Agent C owns #9:
  - Files under `src/features/recipes/components/shoot-board-scene-card*`.
  - May update component tests only.
  - Output: board layout refactor plus #9 test and QA notes.

- Main agent owns integration:
  - Resolve cross-file test expectations.
  - Run TypeScript.
  - Run native QA and capture boards.
  - Write reports/context.
  - Close GitHub issues after proof.

## Rollback Plan

- If #7 causes navigation regressions, revert only the Explore screen/test slice and keep #4/#9.
- If #4 causes deep-link regressions, restore explicit `sceneId` expansion only; do not restore overview highlight auto-expansion.
- If #9 causes saved-take or reference actions to disappear, keep the layout simplification but restore the missing action affordance without reintroducing nested bordered boxes.
- If native QA cannot run because simulators are unavailable, do not close issues. Commit code with report marked `QA BLOCKED` only if the user approves.

## Completion Criteria

- #7 source contract passes.
- #4 passive guidance contract passes.
- #9 board layout contract passes.
- TypeScript passes.
- Android and iPhone screenshots exist for Explore, passive board overview, and shooting board reference/copy area.
- QA report and context file are written.
- GitHub #7, #4, and #9 are closed only after evidence is attached or summarized.
