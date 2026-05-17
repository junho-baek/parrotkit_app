# Release Media Slop Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the reference viewer and filming prompter feel like a compact short-form execution tool by removing AI-slop labels, syncing camera navigation to shoot-board cuts, adding pinch/opacity controls, and clarifying take save QA.

**Architecture:** Keep playback, camera, and saved-take primitives in place. Add small view-model helpers for reference viewer copy, cut-based prompter navigation, and overlay controls, then make the screens render those models. This keeps design rules testable without turning the TSX screens into a pile of one-off conditionals.

**Tech Stack:** Expo Router, React Native, Expo Camera, Expo Video, Expo MediaLibrary, react-native-gesture-handler, TypeScript, sucrase-node source/contract tests.

---

## 배경

현재 실행 화면은 큰 방향은 맞지만, 릴리즈 직전 UI에서 몇 가지 "AI slop" 냄새가 남아 있다.

- Reference viewer 상단의 `Reference`, `Cut #1: Hook` 같은 라벨이 내부 구조를 사용자에게 노출한다.
- Reference viewer 하단 컷 이동 버튼이 썸네일 카드처럼 보이면서 `#1`, role label, 카드 테두리로 화면을 답답하게 만든다.
- Prompter의 `Scene 1/3`, `READY`, `SHOOTING GUIDELINE`, `CARD PROMPT`, `FULL SCRIPT`, `Prev cut`, `Next cut`가 실행 중에 과하게 설명적이다.
- 컷을 추가한 뒤 카메라 화면은 여전히 recipe scene 기준으로 `1/3`을 계산할 수 있어, shoot board가 4컷인데 촬영 화면이 3컷처럼 보일 위험이 있다.
- Prompter는 텍스트 크기 stepper가 있지만 촬영 중 기대되는 pinch 확대/축소가 없다.
- Prompter block에는 opacity 필드가 이미 있는데, 사용자 조절 UI가 충분히 명확하지 않다.
- Record -> review -> keep/export/save 흐름은 Android에서 작동했지만, 저장 상태의 언어와 iOS runtime QA가 아직 충분하지 않다.

## 목표

- Reference viewer에서 내부 role/taxonomy 라벨을 숨기고 실행 제목과 시간만 남긴다.
- Reference viewer의 컷 이동 rail은 숫자/진행 이동 도구로 낮추고, 썸네일 카드형 설명 UI를 제거한다.
- Prompter 화면에서 촬영 중 불필요한 상태 라벨을 제거한다.
- Prompter는 shoot-board `cuts`를 진실값으로 삼아 4컷이면 `1/4`, `2/4`, `3/4`, `4/4`로 이동한다.
- Prompter 텍스트는 pinch로 확대/축소할 수 있고, 기존 +/- controls와 같은 persistence 경로를 쓴다.
- Prompter overlay opacity 조절을 block opacity에 연결한다.
- Take record/save/export 흐름을 Android와 iOS에서 다시 QA하고 증거를 남긴다.

## 범위

- Reference viewer modal UI/copy and source-contract tests.
- Camera prompter copy, display labels, cut navigation, pinch text sizing, overlay opacity controls.
- Saved take review copy/flow QA.
- Android and iOS simulator QA attempt with screenshots.

범위 밖:

- External TikTok/YouTube URL playback proxying.
- Gemini/Supadata/SuperData reference extraction integration.
- DB schema migration.
- Full camera editor redesign or AR overlay feature work.

## 변경 파일

- Modify: `DESIGN.md`
- Create: `src/features/recipes/lib/reference-viewer-ui.ts`
- Create: `src/features/recipes/lib/reference-viewer-ui.test.ts`
- Modify: `src/features/recipes/components/reference-viewer-modal.tsx`
- Modify: `src/features/recipes/lib/prompter-display.ts`
- Modify: `src/features/recipes/lib/prompter-display.test.ts`
- Create: `src/features/recipes/lib/prompter-cut-navigation.ts`
- Create: `src/features/recipes/lib/prompter-cut-navigation.test.ts`
- Create: `src/features/recipes/lib/prompter-overlay-controls.ts`
- Create: `src/features/recipes/lib/prompter-overlay-controls.test.ts`
- Modify: `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- Modify: `src/features/recipes/components/native-take-review.tsx` if review copy still says "Save take" ambiguously after QA.
- Create: `src/features/recipes/screens/recipe-prompter-camera-screen-contract.test.ts`
- Update: `context/context_20260517_release_media_slop_cleanup.md`

## 테스트

- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-viewer-ui.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-cut-navigation.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-overlay-controls.test.ts`
- `NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-prompter-camera-screen-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`
- Android QA screenshots: reference viewer, prompter idle, prompter recording, take review, local keep, gallery export.
- iOS QA screenshots: same flow if CoreSimulator responds. If blocked, document exact CoreSimulator failure and do not reuse stale screenshots.

`npm run build`는 사용자가 명시적으로 요청하거나 배포 직전 점검이 필요할 때만 실행한다.

## 롤백

Revert the final commit. The helper files are additive, so rollback returns the app to the current working reference viewer/prompter without touching media playback, camera permission, or saved-take storage primitives.

## 리스크

- Pinch gesture can conflict with the prompter `ScrollView`. Put the pinch detector on the prompter text surface and update text-size level only on gesture end. Keep +/- controls as a reliable fallback.
- Removing visible labels must not remove accessibility context. Keep meaningful `accessibilityLabel` values even when visible copy is shorter.
- Camera navigation must preserve route return behavior. Continue to pass `cutId` and `sceneId` when saving a take, but display/count/navigation should prefer shoot-board cuts.
- iOS simulator has recently timed out through `simctl`; QA may require CoreSimulator reset before runtime evidence is possible.
- External reference URLs remain a separate release risk because current viewer only plays asset/file/mp4/mov/m3u8 sources.

---

## Task 1: DESIGN.md Contract For Reference Viewer And Prompter

**Files:**
- Modify: `DESIGN.md`

- [ ] **Step 1: Add camera/reference rules after the existing Shooting board section**

Add this subsection under `### Shooting board`:

```markdown
Reference viewer and camera prompter:

- Reference viewer titles should use execution names, not structure labels. Avoid visible `Hook`, `Proof`, `CTA`, `Reference`, or `Cut #1: Hook` style headers when the current cut title already explains the action.
- Reference viewer cut navigation should be a compact rail. Use cut number/time for movement, not a second row of card titles.
- Camera prompter is an active filming surface. Avoid visible labels such as `READY`, `Scene 1`, `CARD PROMPT`, `FULL SCRIPT`, and `SHOOTING GUIDELINE` unless they reduce immediate recording uncertainty.
- Camera cut count must follow the shoot-board cut list. Added cuts count as real filming cuts.
- Prompter text size and opacity controls should feel like filming controls, not configuration labels. Prefer icons, compact sliders, and short mode names.
```

- [ ] **Step 2: Run design lint**

Run:

```bash
npx -y @google/design.md lint DESIGN.md
```

Expected: `0 errors`. Existing unused-token warnings are acceptable.

---

## Task 2: Reference Viewer UI Model

**Files:**
- Create: `src/features/recipes/lib/reference-viewer-ui.ts`
- Create: `src/features/recipes/lib/reference-viewer-ui.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/features/recipes/lib/reference-viewer-ui.test.ts`:

```ts
import {
  getReferenceViewerHeader,
  getReferenceViewerRailItems,
} from "./reference-viewer-ui";

const cut = {
  id: "cut-1",
  order: 1,
  roleLabel: "Hook",
  timeRangeLabel: "0:00-0:05",
  title: "Open on the finished look",
  titleKo: "완성된 장면으로 시작",
};

const header = getReferenceViewerHeader({ cut, language: "en" });

if (header.title !== "Open on the finished look") {
  throw new Error("Reference viewer title should prefer the execution title.");
}

if (header.title.includes("Hook") || header.title.includes("Cut #")) {
  throw new Error("Reference viewer title should not expose structure labels.");
}

if (header.meta !== "0:00-0:05") {
  throw new Error("Reference viewer should keep only useful time meta.");
}

const railItems = getReferenceViewerRailItems({
  activeCutId: "cut-2",
  cuts: [
    { ...cut, id: "cut-1", order: 1, timeRangeLabel: "0:00-0:05" },
    { ...cut, id: "cut-2", order: 2, roleLabel: "Proof", title: "Show the proof close-up", timeRangeLabel: "0:05-0:13" },
  ],
  language: "en",
});

if (railItems[0]?.visibleLabel !== "1" || railItems[1]?.visibleLabel !== "2") {
  throw new Error("Reference rail should use compact cut numbers.");
}

if (railItems.some((item) => /Hook|Proof|Reference|Cut #/.test(item.visibleLabel))) {
  throw new Error("Reference rail visible labels should not contain taxonomy labels.");
}

if (railItems[1]?.accessibilityLabel !== "Open reference for cut 2, 0:05-0:13") {
  throw new Error("Reference rail should keep accessibility context without visible copy bloat.");
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-viewer-ui.test.ts
```

Expected: fail because `reference-viewer-ui.ts` does not exist.

- [ ] **Step 3: Create the helper**

Create `src/features/recipes/lib/reference-viewer-ui.ts`:

```ts
import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

type ReferenceViewerCutLike = Pick<
  ShootBoardCut,
  "id" | "order" | "timeRangeLabel" | "title" | "titleKo"
>;

export type ReferenceViewerHeaderModel = {
  meta: string;
  title: string;
};

export type ReferenceViewerRailItem = {
  accessibilityLabel: string;
  active: boolean;
  cutId: string;
  order: number;
  visibleLabel: string;
};

export function getReferenceViewerHeader({
  cut,
  language,
}: {
  cut: ReferenceViewerCutLike;
  language: AppLanguage;
}): ReferenceViewerHeaderModel {
  return {
    meta: cut.timeRangeLabel,
    title: language === "ko" ? cut.titleKo || cut.title : cut.title,
  };
}

export function getReferenceViewerRailItems({
  activeCutId,
  cuts,
  language,
}: {
  activeCutId: string;
  cuts: ReferenceViewerCutLike[];
  language: AppLanguage;
}): ReferenceViewerRailItem[] {
  return [...cuts]
    .sort((first, second) => first.order - second.order)
    .map((cut) => ({
      accessibilityLabel:
        language === "ko"
          ? `${cut.order}번 컷 레퍼런스 열기, ${cut.timeRangeLabel}`
          : `Open reference for cut ${cut.order}, ${cut.timeRangeLabel}`,
      active: cut.id === activeCutId,
      cutId: cut.id,
      order: cut.order,
      visibleLabel: String(cut.order),
    }));
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-viewer-ui.test.ts
```

Expected: pass.

---

## Task 3: Reference Viewer Modal Cleanup

**Files:**
- Modify: `src/features/recipes/components/reference-viewer-modal.tsx`

- [ ] **Step 1: Import and use the reference viewer model**

Add the import:

```ts
import {
  getReferenceViewerHeader,
  getReferenceViewerRailItems,
} from "@/features/recipes/lib/reference-viewer-ui";
```

Inside `ReferenceViewerModal`, add:

```ts
const headerModel = getReferenceViewerHeader({ cut, language });
const railItems = getReferenceViewerRailItems({
  activeCutId: cut.id,
  cuts,
  language,
});
```

- [ ] **Step 2: Replace the header title/meta**

Replace `formatSceneTitle(language, cut)` and the `referencePill` block with:

```tsx
<Text numberOfLines={1} style={styles.headerTitle}>
  {headerModel.title}
</Text>
<Text numberOfLines={1} style={styles.headerTime}>
  {headerModel.meta}
</Text>
```

Remove `styles.headerMeta`, `styles.referencePill`, and `styles.referencePillText` if unused.

- [ ] **Step 3: Replace visible cut thumbnail labels**

Change the rail render to pass the model:

```tsx
{railItems.map((item) => {
  const targetCut = cuts.find((candidate) => candidate.id === item.cutId);

  if (!targetCut) return null;

  return (
    <CutThumb
      active={item.active}
      cut={targetCut}
      item={item}
      key={item.cutId}
      onPress={() => onSelectCut?.(targetCut)}
    />
  );
})}
```

Change `CutThumb` props to:

```ts
function CutThumb({
  active,
  cut,
  item,
  onPress,
}: {
  active: boolean;
  cut: ShootBoardCut;
  item: ReferenceViewerRailItem;
  onPress: () => void;
}) {
```

Inside `CutThumb`, set:

```tsx
<Pressable
  accessibilityLabel={item.accessibilityLabel}
  accessibilityRole="button"
  onPress={onPress}
  style={({ pressed }) => [
    styles.cutThumb,
    active && styles.activeCutThumb,
    pressed && styles.pressed,
  ]}
>
  {cut.thumbnailSource || cut.thumbnailUrl ? (
    <Image
      source={cut.thumbnailSource ?? toImageSource(cut.thumbnailUrl)}
      style={styles.cutThumbImage}
    />
  ) : null}
  <View style={styles.cutThumbShade} />
  <Text numberOfLines={1} style={styles.cutThumbOrder}>
    {item.visibleLabel}
  </Text>
</Pressable>
```

Remove the visible `cutThumbTitle` text. Keep the visual rail compact.

- [ ] **Step 4: Run reference tests and TypeScript**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-viewer-ui.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: both pass.

---

## Task 4: Prompter Copy Contract

**Files:**
- Modify: `src/features/recipes/lib/prompter-display.ts`
- Modify: `src/features/recipes/lib/prompter-display.test.ts`

- [ ] **Step 1: Update the expected display labels**

In `prompter-display.test.ts`, replace label expectations:

```ts
if (fullScriptModel.label !== "Script") {
  throw new Error("Prompter full mode should use compact visible copy.");
}

if (cardFocusedModel.mode !== "card" || cardFocusedModel.label !== "Line") {
  throw new Error("Prompter current-cut mode should use compact visible copy.");
}

if (fullScriptFocusedModel.mode !== "full-script" || fullScriptFocusedModel.label !== "Script") {
  throw new Error("Prompter should expose compact script mode copy.");
}

if (fallbackModel.mode !== "card" || fallbackModel.label !== "Line") {
  throw new Error("Prompter should fall back to compact current-cut copy when full script is empty.");
}
```

Also assert mode options:

```ts
const compactOptions = getPrompterDisplayModeOptions({ fullScript: "One\n\nTwo" });

if (compactOptions[0]?.label !== "Line" || compactOptions[1]?.label !== "Script") {
  throw new Error("Prompter mode switch should avoid dashboard copy.");
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts
```

Expected: fail on old `CARD PROMPT` / `FULL SCRIPT` / `Current cut` copy.

- [ ] **Step 3: Update the model types and return values**

In `prompter-display.ts`, change the label unions:

```ts
export type PrompterDisplayModel = {
  label: "Line" | "Script";
  lines: string[];
  mode: PrompterDisplayMode;
};

export type PrompterDisplayModeOption = {
  disabled: boolean;
  label: "Line" | "Script";
  mode: PrompterDisplayMode;
};
```

Change full script return:

```ts
return {
  label: "Script",
  lines: getScriptParagraphs(compactFullScript),
  mode: "full-script",
};
```

Change card return:

```ts
return {
  label: "Line",
  lines: compactFallbackLines,
  mode: "card",
};
```

Change mode options:

```ts
return [
  {
    disabled: false,
    label: "Line",
    mode: "card",
  },
  {
    disabled: !hasFullScript,
    label: "Script",
    mode: "full-script",
  },
];
```

- [ ] **Step 4: Run the test and verify it passes**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts
```

Expected: pass.

---

## Task 5: Cut-Based Prompter Navigation

**Files:**
- Create: `src/features/recipes/lib/prompter-cut-navigation.ts`
- Create: `src/features/recipes/lib/prompter-cut-navigation.test.ts`
- Modify: `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`

- [ ] **Step 1: Write the failing navigation test**

Create `src/features/recipes/lib/prompter-cut-navigation.test.ts`:

```ts
import { getPrompterCutNavigation } from "./prompter-cut-navigation";

const board = {
  cuts: [
    { id: "cut-1", order: 1, sceneId: "scene-1" },
    { id: "cut-2", order: 2, sceneId: "scene-2" },
    { id: "cut-3", order: 3, sceneId: "scene-3" },
    { id: "cut-4", order: 4, sceneId: "scene-3" },
  ],
};

const selected = getPrompterCutNavigation({
  fallbackSceneId: "scene-3",
  selectedCutId: "cut-4",
  shootBoard: board,
});

if (selected.activeCut?.id !== "cut-4") {
  throw new Error("Prompter should honor the selected added cut.");
}

if (selected.currentIndex !== 4 || selected.totalCuts !== 4) {
  throw new Error("Prompter cut count should follow shoot-board cuts, including added cuts.");
}

if (selected.previousCut?.id !== "cut-3" || selected.nextCut !== null) {
  throw new Error("Prompter navigation should move by board cut order.");
}

const fallback = getPrompterCutNavigation({
  fallbackSceneId: "scene-2",
  selectedCutId: null,
  shootBoard: board,
});

if (fallback.activeCut?.id !== "cut-2" || fallback.currentIndex !== 2) {
  throw new Error("Prompter should fall back to the first matching scene cut.");
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-cut-navigation.test.ts
```

Expected: fail because the helper does not exist.

- [ ] **Step 3: Create the helper**

Create `src/features/recipes/lib/prompter-cut-navigation.ts`:

```ts
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

type PrompterCutLike = Pick<ShootBoardCut, "id" | "order" | "sceneId">;

type PrompterBoardLike = {
  cuts?: PrompterCutLike[];
};

export type PrompterCutNavigation = {
  activeCut: PrompterCutLike | null;
  currentIndex: number;
  nextCut: PrompterCutLike | null;
  previousCut: PrompterCutLike | null;
  totalCuts: number;
};

export function getPrompterCutNavigation({
  fallbackSceneId,
  selectedCutId,
  shootBoard,
}: {
  fallbackSceneId?: string | null;
  selectedCutId?: string | null;
  shootBoard?: PrompterBoardLike | null;
}): PrompterCutNavigation {
  const orderedCuts = [...(shootBoard?.cuts ?? [])]
    .sort((first, second) => (first.order ?? 0) - (second.order ?? 0));
  const selectedCut = selectedCutId
    ? orderedCuts.find((cut) => cut.id === selectedCutId) ?? null
    : null;
  const sceneCut = fallbackSceneId
    ? orderedCuts.find((cut) => cut.sceneId === fallbackSceneId) ?? null
    : null;
  const activeCut = selectedCut ?? sceneCut ?? orderedCuts[0] ?? null;
  const activeIndex = activeCut
    ? orderedCuts.findIndex((cut) => cut.id === activeCut.id)
    : -1;

  return {
    activeCut,
    currentIndex: activeIndex >= 0 ? activeIndex + 1 : 0,
    nextCut: activeIndex >= 0 ? orderedCuts[activeIndex + 1] ?? null : null,
    previousCut: activeIndex > 0 ? orderedCuts[activeIndex - 1] ?? null : null,
    totalCuts: orderedCuts.length,
  };
}
```

- [ ] **Step 4: Use cut navigation in the camera screen**

In `recipe-prompter-camera-screen.tsx`, import:

```ts
import { getPrompterCutNavigation } from "@/features/recipes/lib/prompter-cut-navigation";
```

Add after `activeSceneIndex`:

```ts
const activeCutNavigation = useMemo(
  () => getPrompterCutNavigation({
    fallbackSceneId: activeSceneId,
    selectedCutId: typeof params.cutId === "string" ? params.cutId : null,
    shootBoard,
  }),
  [activeSceneId, params.cutId, shootBoard],
);
```

When selecting previous/next, use board cuts:

```tsx
<PrompterStepButton
  disabled={!activeCutNavigation.previousCut}
  label="Prev"
  onPress={() => {
    const previousCut = activeCutNavigation.previousCut;
    if (previousCut?.sceneId) setActiveSceneId(previousCut.sceneId);
  }}
/>
```

```tsx
<PrompterStepButton
  disabled={!activeCutNavigation.nextCut}
  label="Next"
  onPress={() => {
    const nextCut = activeCutNavigation.nextCut;
    if (nextCut?.sceneId) setActiveSceneId(nextCut.sceneId);
  }}
/>
```

Pass `currentCutIndex={activeCutNavigation.currentIndex}` and `totalCuts={activeCutNavigation.totalCuts || recipe.scenes.length}` to `CameraCoachOverlay`.

- [ ] **Step 5: Run navigation test**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-cut-navigation.test.ts
```

Expected: pass.

---

## Task 6: Prompter Overlay Controls And Pinch Model

**Files:**
- Create: `src/features/recipes/lib/prompter-overlay-controls.ts`
- Create: `src/features/recipes/lib/prompter-overlay-controls.test.ts`
- Modify: `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`

- [ ] **Step 1: Write the failing helper test**

Create `src/features/recipes/lib/prompter-overlay-controls.test.ts`:

```ts
import {
  getNextPrompterOpacityLevel,
  getPrompterOpacityValue,
  getPrompterTextSizeLevelFromPinch,
} from "./prompter-overlay-controls";

if (getPrompterTextSizeLevelFromPinch({ level: "md", scale: 1.18 }) !== "lg") {
  throw new Error("Pinch out should increase the prompter text size one level.");
}

if (getPrompterTextSizeLevelFromPinch({ level: "lg", scale: 0.82 }) !== "md") {
  throw new Error("Pinch in should decrease the prompter text size one level.");
}

if (getPrompterTextSizeLevelFromPinch({ level: "md", scale: 1.04 }) !== "md") {
  throw new Error("Small pinch noise should not change prompter text size.");
}

if (getPrompterOpacityValue("soft") !== 0.54 || getPrompterOpacityValue("solid") !== 0.92) {
  throw new Error("Prompter opacity presets should remain stable.");
}

if (getNextPrompterOpacityLevel("medium", "increase") !== "solid") {
  throw new Error("Opacity control should step upward predictably.");
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-overlay-controls.test.ts
```

Expected: fail because the helper does not exist.

- [ ] **Step 3: Create the helper**

Create `src/features/recipes/lib/prompter-overlay-controls.ts`:

```ts
import {
  getNextPrompterTextSizeLevel,
  type PrompterTextSizeLevel,
} from "@/features/recipes/lib/prompter-text-size";

export type PrompterOpacityLevel = "soft" | "medium" | "solid";

const PROMPTER_OPACITY_LEVELS: PrompterOpacityLevel[] = ["soft", "medium", "solid"];

const PROMPTER_OPACITY_VALUES: Record<PrompterOpacityLevel, number> = {
  medium: 0.72,
  soft: 0.54,
  solid: 0.92,
};

export function getPrompterTextSizeLevelFromPinch({
  level,
  scale,
}: {
  level: PrompterTextSizeLevel;
  scale: number;
}): PrompterTextSizeLevel {
  if (scale >= 1.12) {
    return getNextPrompterTextSizeLevel({ direction: "increase", level });
  }

  if (scale <= 0.88) {
    return getNextPrompterTextSizeLevel({ direction: "decrease", level });
  }

  return level;
}

export function getPrompterOpacityValue(level: PrompterOpacityLevel) {
  return PROMPTER_OPACITY_VALUES[level] ?? PROMPTER_OPACITY_VALUES.medium;
}

export function getNextPrompterOpacityLevel(
  level: PrompterOpacityLevel,
  direction: "decrease" | "increase",
) {
  const index = Math.max(0, PROMPTER_OPACITY_LEVELS.indexOf(level));
  const nextIndex = direction === "increase" ? index + 1 : index - 1;
  const clampedIndex = Math.min(Math.max(0, nextIndex), PROMPTER_OPACITY_LEVELS.length - 1);

  return PROMPTER_OPACITY_LEVELS[clampedIndex];
}
```

- [ ] **Step 4: Add gesture imports and local opacity state**

In `recipe-prompter-camera-screen.tsx`, add:

```ts
import { Gesture, GestureDetector } from "react-native-gesture-handler";
```

Add imports:

```ts
import {
  getNextPrompterOpacityLevel,
  getPrompterOpacityValue,
  getPrompterTextSizeLevelFromPinch,
  type PrompterOpacityLevel,
} from "@/features/recipes/lib/prompter-overlay-controls";
```

Add state:

```ts
const [prompterOpacityLevel, setPrompterOpacityLevel] = useState<PrompterOpacityLevel>("medium");
```

Add callback:

```ts
const handlePrompterPinch = useCallback((scale: number) => {
  const nextLevel = getPrompterTextSizeLevelFromPinch({
    level: prompterTextSizeLevel,
    scale,
  });

  if (nextLevel === prompterTextSizeLevel) return;

  setPrompterTextSizeLevel(nextLevel);
  setPrompterModeSettings(prompterDisplayMode, { textSizeLevel: nextLevel });
}, [
  prompterDisplayMode,
  prompterTextSizeLevel,
  setPrompterModeSettings,
  setPrompterTextSizeLevel,
]);
```

Add opacity step callback:

```ts
const handleAdjustPrompterOpacity = useCallback((direction: "decrease" | "increase") => {
  setPrompterOpacityLevel((current) => getNextPrompterOpacityLevel(current, direction));
}, []);
```

Pass `onPrompterPinch`, `onPrompterOpacityDecrease`, `onPrompterOpacityIncrease`, and `prompterOpacity={getPrompterOpacityValue(prompterOpacityLevel)}` to `CameraCoachOverlay`.

- [ ] **Step 5: Wrap prompter text with a pinch detector**

Inside `CameraCoachOverlay`, create:

```ts
const pinchGesture = Gesture.Pinch()
  .onEnd((event) => {
    onPrompterPinch(event.scale);
  });
```

Wrap the prompter text surface:

```tsx
<GestureDetector gesture={pinchGesture}>
  <View style={[styles.sayNowBlock, { backgroundColor: `rgba(15, 23, 42, ${prompterOpacity})` }]}>
    ...
  </View>
</GestureDetector>
```

Use the same existing `prompterTextSizeLevel` metrics. Keep the +/- buttons as fallback.

- [ ] **Step 6: Run helper test and TypeScript**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-overlay-controls.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: both pass.

---

## Task 7: Prompter Visible UI Cleanup

**Files:**
- Modify: `src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- Create: `src/features/recipes/screens/recipe-prompter-camera-screen-contract.test.ts`

- [ ] **Step 1: Write the source-contract test**

Create `src/features/recipes/screens/recipe-prompter-camera-screen-contract.test.ts`:

```ts
import { readFileSync } from "fs";
import { join } from "path";

const source = readFileSync(
  join(__dirname, "recipe-prompter-camera-screen.tsx"),
  "utf8",
);

const forbiddenVisibleCopy = [
  "READY",
  "Scene {sceneIndex",
  "SHOOTING GUIDELINE",
  "CARD PROMPT",
  "FULL SCRIPT",
  "Prev cut",
  "Next cut",
];

for (const copy of forbiddenVisibleCopy) {
  if (source.includes(copy)) {
    throw new Error(`Camera prompter still exposes AI-slop visible copy: ${copy}`);
  }
}

if (!source.includes("currentCutIndex") || !source.includes("totalCuts")) {
  throw new Error("Camera prompter should display cut progress from board cuts.");
}

if (!source.includes("GestureDetector")) {
  throw new Error("Camera prompter should support pinch text sizing.");
}

if (!source.includes("prompterOpacity")) {
  throw new Error("Camera prompter should expose opacity controls.");
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-prompter-camera-screen-contract.test.ts
```

Expected: fail on the old visible copy.

- [ ] **Step 3: Remove top center taxonomy pill**

Replace the top center pill text:

```tsx
<View className="max-w-[230px] rounded-full border border-white/15 bg-black/35 px-3 py-1.5">
  <Text className="text-[12px] font-semibold text-white/85" numberOfLines={1}>
    #{activeScene.sceneNumber} · {getCameraSceneRole(activeSceneIndex, recipe.scenes.length)} · {activeScene.endTime}
  </Text>
</View>
```

with:

```tsx
<View className="max-w-[230px] rounded-full bg-black/30 px-3 py-1.5">
  <Text className="text-[12px] font-semibold text-white/85" numberOfLines={1}>
    {activeCutNavigation.currentIndex || activeScene.sceneNumber}/{activeCutNavigation.totalCuts || recipe.scenes.length} · {activeScene.endTime}
  </Text>
</View>
```

This keeps useful timing/progress and removes `Hook`/`Scene`.

- [ ] **Step 4: Remove overlay labels that restate the UI**

Inside `CameraCoachOverlay`, remove the `scenePill`, `recPill`, and `coachLabel` blocks. Keep the progress rail if it remains visually useful:

```tsx
<View style={styles.progressTrack}>
  <View style={[styles.progressFill, { width: progress }]} />
</View>
```

Change the visible prompter label from a large label to a compact mode segment only. The text surface should not render `prompterDisplay.label` as a label above the line. The mode switch already communicates `Line` / `Script`.

- [ ] **Step 5: Rename step buttons**

Change button labels from:

```tsx
label="Prev cut"
label="Next cut"
```

to:

```tsx
label="Prev"
label="Next"
```

- [ ] **Step 6: Run source-contract test**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-prompter-camera-screen-contract.test.ts
```

Expected: pass.

---

## Task 8: Take Record And Save Flow QA

**Files:**
- Modify: `src/features/recipes/components/native-take-review.tsx` only if QA shows ambiguous copy.
- Update: `context/context_20260517_release_media_slop_cleanup.md`
- Save screenshots under: `output/playwright/release-media-slop-cleanup-20260517/`

- [ ] **Step 1: Run static save/export tests**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/saved-take-storage.test.ts
```

Expected: pass.

- [ ] **Step 2: Android runtime QA**

Use the dev client flow:

1. Open the recipe board.
2. Open the reference viewer.
3. Move across reference cut rail items.
4. Tap the primary film action.
5. Record a short take.
6. Stop recording.
7. Keep the take locally.
8. Reopen the cut and confirm My Take shows the saved take.
9. Save/export to Gallery.

Required screenshots:

- `android-reference-viewer-clean.png`
- `android-prompter-idle-clean.png`
- `android-prompter-recording-clean.png`
- `android-take-review-clean.png`
- `android-kept-take-clean.png`
- `android-gallery-export-clean.png`

- [ ] **Step 3: iOS simulator QA attempt**

Try in this order:

```bash
open -a Simulator
xcrun simctl list devices booted
npx expo start --dev-client --port 8083
```

Then open the dev-client URL on the booted iPhone simulator. If `simctl` times out again, record the exact command and timeout in context and do not claim iOS pass.

Required screenshots if iOS opens:

- `ios-reference-viewer-clean.png`
- `ios-prompter-idle-clean.png`
- `ios-prompter-recording-clean.png`
- `ios-take-review-clean.png`
- `ios-kept-take-clean.png`

- [ ] **Step 4: Fix ambiguous review copy only if QA still needs it**

If the review modal still makes local keep vs gallery export unclear, change copy in `native-take-review.tsx`:

```tsx
primaryLabel={status === "kept" ? "Back to cut" : "Keep take"}
secondaryLabel="Export"
```

Keep the actual save functions unchanged.

---

## Task 9: Final Verification, Context, Commit, Push

**Files:**
- Update: `context/context_20260517_release_media_slop_cleanup.md`

- [ ] **Step 1: Run focused tests**

Run:

```bash
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/reference-viewer-ui.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-display.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-cut-navigation.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/prompter-overlay-controls.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-prompter-camera-screen-contract.test.ts
```

Expected: all pass.

- [ ] **Step 2: Run repo checks**

Run:

```bash
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
npx -y @google/design.md lint DESIGN.md
git diff --check
```

Expected:

- TypeScript pass.
- Architecture pass.
- Design lint `0 errors`; existing unused-token warnings are acceptable.
- No whitespace errors.

- [ ] **Step 3: Write context**

Create `context/context_20260517_release_media_slop_cleanup.md` with:

```markdown
# 2026-05-17 Release Media Slop Cleanup

## 배경

Reference viewer and camera prompter still exposed visible internal labels such as `Reference`, `Cut #`, `Hook`, `READY`, and `CARD PROMPT`.

## 변경

- Reference viewer title now uses execution title and time only.
- Reference cut rail now uses compact cut numbers with accessibility labels.
- Prompter copy now uses compact `Line` / `Script` mode language.
- Camera cut progress/navigation now follows shoot-board cuts, including added cuts.
- Prompter supports pinch text-size changes and opacity presets.
- Redundant recording state labels were removed from the overlay.
- Take record/save/export QA was rerun.

## 검증

- List every command result.
- List Android screenshots.
- List iOS screenshots or exact simulator blocker.

## 연결된 plan

- `plans/20260517_release_media_slop_cleanup.md`
```

- [ ] **Step 4: Commit and push**

Run:

```bash
git status --short
git add DESIGN.md src/features/recipes context plans output/playwright
git commit -m "fix: clean release media filming UI"
git fetch origin
git rebase origin/main
git push origin main
```

If rebase reports conflicts, resolve locally before pushing. Do not force push.

---

## Self-Review

- Spec coverage: reference viewer labels, bottom cut navigation, prompter labels, pinch sizing, opacity, record/save QA, iOS attempt, and added-cut count sync all map to tasks above.
- Placeholder scan: no deferred-work placeholders are used.
- Type consistency: helper names are stable across tests and integration snippets: `getReferenceViewerHeader`, `getReferenceViewerRailItems`, `getPrompterCutNavigation`, `getPrompterTextSizeLevelFromPinch`, `getPrompterOpacityValue`.
