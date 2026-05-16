# Issue 10 Native QA Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the final native QA evidence package for GitHub #10, including fresh iPhone and Android captures after the Explore detail and shooting board follow-up changes.

**Architecture:** QA-only artifact pass. No product runtime code changes are planned unless capture execution reveals a blocking regression that prevents the acceptance criteria from being verified.

**Tech Stack:** Expo React Native, TypeScript, Android emulator via `adb`, iOS Simulator, `@google/design.md` lint, project architecture checker, Markdown/SVG evidence artifacts.

---

## 배경

GitHub #10 asks for a final native QA capture package under parent epic #5. Since the latest UI follow-up changed Explore detail and shooting board structure, the capture package must verify the current pushed UI rather than the previous screenshots.

The latest relevant changes:

- Explore recipe detail removes heavy meta, `Included`, `Key Hook`, and nested box patterns.
- Shooting board moves the reference preview above the board title.
- Cut rows reduce left-side control space and remove fixed `Hook` language.
- Completion state is driven by My Take state.

## 목표

- Run final static checks that #10 requires.
- Capture both Android and iPhone evidence for the requested native surfaces.
- Include the fresh Explore detail and shooting board header/cut-row states in the evidence set.
- Generate a contact sheet and concise QA report with pass/fail notes.
- Report the result back to GitHub #10 and push the artifacts.

## 범위

Included:

- TypeScript check.
- Architecture check.
- `DESIGN.md` lint.
- Git whitespace check.
- Android emulator captures.
- iPhone Simulator captures.
- Contact sheet and Markdown QA report.
- Context update and GitHub #10 comment.

Excluded:

- Product UI changes, unless a blocking issue is found during QA.
- Notion upload.
- Production deployment QA.

## 변경 파일

Expected new or updated files:

- `plans/20260516_issue_10_native_qa_package.md`
- `context/context_20260516_issue_10_native_qa_package.md`
- `output/playwright/issue-10-native-qa-20260516/*`
- `output/reports/20260516_issue_10_native_qa_package.md`

## 테스트

- [ ] `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- [ ] `npm run check:architecture`
- [ ] `npx -y @google/design.md lint DESIGN.md`
- [ ] `git diff --check`
- [ ] Android capture set: Home, Explore, Explore detail, recipe-create drawer, goal grid, board overview, expanded board/copy area.
- [ ] iPhone capture set: Home, Explore, Explore detail, recipe-create drawer, goal grid, board overview, expanded board/copy area.
- [ ] Contact sheet renders the collected capture set.
- [ ] QA report links screenshots and summarizes risks.

## 롤백

This is primarily artifact generation. If the QA artifacts are wrong or stale, delete the generated `output/playwright/issue-10-native-qa-20260516/` directory, remove the report/context entries, and rerun the plan from a clean current app session.

## 리스크

- iOS `simctl` can hang in this local environment; fallback is Simulator window capture through the desktop session.
- A stale Metro process may serve an older clone. The QA run must start Metro from the current repo on a fresh port.
- Deep links can land on cached navigation state. Each screen capture needs a direct route open and a short settle delay.
- Contact sheet generation may need SVG/HTML rather than ImageMagick because ImageMagick is not installed.

## 실행 체크리스트

- [x] Confirm repo status and latest context.
- [x] Start Expo from the current native app directory on a fresh port.
- [x] Capture Android routes through Expo deep links.
- [ ] Capture iPhone routes through Expo/Simulator and window screenshots if `simctl` is unavailable.
- [x] Generate contact sheet.
- [x] Write report and context.
- [ ] Comment on GitHub #10 with artifact paths and results.
- [ ] Commit and push.

## 결과

- Android fresh current-app capture package completed.
- Static checks passed.
- Contact sheet generated at `output/playwright/issue-10-native-qa-20260516/issue-10-contact-sheet.svg`.
- Fresh iPhone recapture is blocked by local Simulator/CoreSimulator state, so #10 should remain open.
- Same-day existing iPhone evidence was copied into the package as reference only.
- QA found and fixed a missing-media fallback issue in the shooting board reference preview.

## 연결된 context

`context/context_20260516_issue_10_native_qa_package.md`
