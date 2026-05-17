# Issue #21 Mobile Analysis UX QA

## Metadata

- Test time: 2026-05-17 22:54 KST
- Branch/worktree: `codex/issue-21-mobile-analysis-qa`
- App target: Expo Go via local Metro `exp://127.0.0.1:8094`
- iOS target: iPhone 17 Pro simulator `736C8797-5E0C-420B-AB37-57DA32D71E6A`
- Android target attempted: `Pixel_9` AVD

## Scope

- Compact Shooting Board execution surface.
- Ready Sandcastle-style Breakdown surface.
- Reference viewer from the board.
- Partial reference-analysis state.
- Failed/retry reference-analysis state.

## Results

- iOS QA: PASS for the five captured screens.
- Source-contract QA: PASS for Breakdown labels, Board/Breakdown deep links, and partial/failed analysis states.
- TypeScript: PASS.
- Architecture boundary check: PASS.
- Android QA: BLOCKED by local emulator crash/hang before any app screen could be opened.

## Screenshots

- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-01-board.png`
- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-02-breakdown-ready.png`
- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-03-reference-viewer.png`
- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-04-partial.png`
- `output/playwright/issue-21-mobile-analysis-qa-20260517/ios-05-failed.png`

## Android Blocker

Android was retried with:

```bash
adb kill-server
adb start-server
emulator -avd Pixel_9 -no-snapshot-load -no-audio -no-boot-anim -gpu swiftshader_indirect
adb devices -l
```

Observed result:

```text
adb protocol fault (couldn't read status length)
detected a hanging thread 'QEMU2 main loop'
detected a hanging thread 'QEMU2 CPU0 thread'
List of devices attached
```

No Android screenshot was produced because the emulator never attached as an ADB device. This is a local emulator/runtime blocker rather than an app route or UI failure.

## Verification

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
git diff --check
```

All commands exited 0.

## Notes

- Board remains execution-first and does not expose Sandcastle section labels inside cut rows.
- Breakdown owns Sandcastle section labels: Summary, Transcript, Idea Analysis, Hook, Storytelling, Visual Layout.
- Reference viewer remains reachable from the board and keeps a 9:16 reference frame.
- `boardTab=breakdown` and `analysisQaState=partial|failed` are QA deep links for repeatable simulator capture.

## Next Action

- Leave #21 open until Android evidence is captured on a healthy emulator or physical device.
- If Android emulator remains unstable, use a physical Android device with Expo Go and the same Metro/deep-link route set.
