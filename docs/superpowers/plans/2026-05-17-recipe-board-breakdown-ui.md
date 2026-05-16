# Recipe Board Breakdown UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep ParrotKit's shooting board compact while adding a separate video-level Breakdown layer for Recipe Analysis Contract insights.

**Architecture:** Defer Supadata/Gemini raw video analysis and first build the UI projection boundary. Store/derive a video-level breakdown model separately from cut rows, expose it behind a `Board / Breakdown` switch on recipe detail, and keep the default Board tab focused on compact filming actions.

**Tech Stack:** React Native + Expo, TypeScript, NativeWind/Tailwind className, existing source-contract tests run through `sucrase-node`, ParrotKit `DESIGN.md`.

---

## Scope Decision

Do this now:

- Add a recipe-level `Board / Breakdown` structure.
- Keep `Board` as the default filming surface.
- Make `Breakdown` show video-level insight only: summary, idea angle, hook formula, story format, visual layout, and "apply to your shoot".
- Make collapsed cut rows compact and exercise-app-like: left 9:16 reference anchor, right execution title + one-line application + `Line`/`Guide` affordances + `Film` + My Take state.

Defer this:

- Supadata/Gemini ingestion.
- Raw video frame/cut segmentation.
- Multi-video idea/hook/channel vault UI.
- Database/schema migrations.

## File Structure

- Modify `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
  - Owns the recipe-level `Board / Breakdown` tab state and switches between the compact board list and video-level breakdown panel.
- Create `parrotkit-app/src/features/recipes/lib/recipe-breakdown-summary.ts`
  - Converts the current `NativeRecipe` into a stable, video-level breakdown view model. Initially derives from existing recipe/scene analysis fields; later Gemini/Supadata can write the same shape.
- Create `parrotkit-app/src/features/recipes/lib/recipe-breakdown-summary.test.ts`
  - Verifies hook is video-level, not per-cut; verifies deterministic fallback values.
- Create `parrotkit-app/src/features/recipes/components/recipe-breakdown-panel.tsx`
  - Renders the video-level breakdown with unboxed sections and short copy.
- Modify `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
  - Rework collapsed cut layout from card-like stacked media slots to compact action rows.
- Modify `parrotkit-app/src/features/recipes/components/shoot-board-media-slot.tsx`
  - Keep 9:16 preview but support compact My Take result chip usage without redundant empty-state labels.
- Modify `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
  - Add guardrails for compact row, no repeated hook label, no `No take yet`/`0 takes`, no nested Reference/My Take media blocks in collapsed mode.
- Create `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`
  - Guards `Board / Breakdown` tab behavior and ensures Board is default.

---

### Task 1: Add Breakdown View Model

**Files:**
- Create: `parrotkit-app/src/features/recipes/lib/recipe-breakdown-summary.ts`
- Create: `parrotkit-app/src/features/recipes/lib/recipe-breakdown-summary.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// parrotkit-app/src/features/recipes/lib/recipe-breakdown-summary.test.ts
import { getRecipeBreakdownSummary } from "./recipe-breakdown-summary";
import type { NativeRecipe } from "@/features/recipes/types/recipe-domain";

const recipe: NativeRecipe = {
  id: "recipe-1",
  title: "Beauty Conversion Hook Guide",
  description:
    "Show the skin result before the product explanation so viewers understand the payoff.",
  creatorName: "@avabeauty",
  thumbnailUrl: "https://example.com/ref.jpg",
  durationSeconds: 30,
  scenes: [
    {
      id: "scene-1",
      sceneNumber: 1,
      title: "Open on the finished look",
      durationSeconds: 5,
      role: "hook",
      instruction:
        "Start with the result so the routine has a reason to exist.",
      analysis: {
        transcriptSnippet:
          "This is the glow I wanted before touching concealer.",
        transcriptOriginal: [
          "This is the glow I wanted before touching concealer.",
        ],
        motionDescription: "Creator opens on a finished skin result.",
        whyItWorks: [
          "It proves the result before explaining the product.",
        ],
      },
      recipe: {
        lineToSay: "Here is the glow before concealer.",
        shotAction: "Open on the finished look.",
        onScreenText: "Before concealer",
        brandNotes: [],
      },
    },
    {
      id: "scene-2",
      sceneNumber: 2,
      title: "Make the product earn trust",
      durationSeconds: 10,
      role: "proof",
      instruction: "Hold the product only after the result is clear.",
      analysis: {
        transcriptSnippet: "This serum made the base sit better.",
        transcriptOriginal: [],
        motionDescription: "Product appears after the result shot.",
        whyItWorks: ["The product is supported by visible evidence."],
      },
      recipe: {
        lineToSay: "This is what changed the base.",
        shotAction: "Bring the product into frame after the result.",
        onScreenText: "Proof",
        brandNotes: [],
      },
    },
  ],
};

const summary = getRecipeBreakdownSummary(recipe, "en");

if (summary.primaryTabLabel !== "Breakdown") {
  throw new Error(`Expected Breakdown label, got ${summary.primaryTabLabel}`);
}

if (summary.hook.title !== "Video hook") {
  throw new Error("Hook must be video-level, not a per-cut label");
}

if (!summary.hook.body.includes("This is the glow")) {
  throw new Error("Expected hook body to use opening transcript");
}

if (summary.sections.some((section) => section.title === "Cut hook")) {
  throw new Error("Breakdown must not create repeated per-cut hook sections");
}

if (!summary.applyToYourShoot.body.includes("Show the skin result")) {
  throw new Error("Expected recipe description to become creator application");
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts
```

Expected: FAIL because `recipe-breakdown-summary.ts` does not exist.

- [ ] **Step 3: Implement the view model**

```ts
// parrotkit-app/src/features/recipes/lib/recipe-breakdown-summary.ts
import type { AppLanguage } from "@/core/i18n/app-language";
import type { NativeRecipe } from "@/features/recipes/types/recipe-domain";

export type RecipeBreakdownSectionId =
  | "summary"
  | "idea"
  | "hook"
  | "story"
  | "visual"
  | "evidence";

export type RecipeBreakdownSection = {
  body: string;
  id: RecipeBreakdownSectionId;
  title: string;
};

export type RecipeBreakdownSummary = {
  applyToYourShoot: RecipeBreakdownSection;
  hook: RecipeBreakdownSection;
  primaryTabLabel: "Breakdown" | "분석";
  sections: RecipeBreakdownSection[];
  title: string;
};

const labels = {
  en: {
    apply: "Apply to your shoot",
    breakdown: "Breakdown" as const,
    evidence: "Proof points",
    hook: "Video hook",
    idea: "Idea angle",
    story: "Story format",
    summary: "Why this works",
    visual: "Visual layout",
  },
  ko: {
    apply: "내 촬영에 적용",
    breakdown: "분석" as const,
    evidence: "근거",
    hook: "영상 훅",
    idea: "아이디어 각도",
    story: "전개 방식",
    summary: "왜 먹히는지",
    visual: "화면 구조",
  },
} satisfies Record<AppLanguage, Record<string, string>>;

export function getRecipeBreakdownSummary(
  recipe: NativeRecipe,
  language: AppLanguage,
): RecipeBreakdownSummary {
  const copy = labels[language];
  const openingScene = recipe.scenes[0];
  const proofLines = recipe.scenes
    .flatMap((scene) => scene.analysis.whyItWorks)
    .filter(Boolean);
  const openingTranscript =
    openingScene?.analysis.transcriptOriginal?.[0] ||
    openingScene?.analysis.transcriptSnippet ||
    openingScene?.recipe.lineToSay ||
    openingScene?.title ||
    recipe.title;
  const visualLayout =
    openingScene?.analysis.motionDescription ||
    openingScene?.recipe.shotAction ||
    "Use the reference frame as the visual anchor before adding explanation.";

  const sections: RecipeBreakdownSection[] = [
    {
      body: recipe.description || recipe.title,
      id: "summary",
      title: copy.summary,
    },
    {
      body:
        openingScene?.instruction ||
        "Lead with the clearest viewer payoff before explaining the steps.",
      id: "idea",
      title: copy.idea,
    },
    {
      body:
        recipe.scenes.length > 1
          ? `${recipe.scenes.length} short beats that move from promise to proof to action.`
          : "One compact beat that turns a reference into a shootable action.",
      id: "story",
      title: copy.story,
    },
    {
      body: visualLayout,
      id: "visual",
      title: copy.visual,
    },
    {
      body: proofLines[0] || "Use visible proof before asking the viewer to believe the claim.",
      id: "evidence",
      title: copy.evidence,
    },
  ];

  return {
    applyToYourShoot: {
      body: recipe.description || "Use the reference idea as a filming guide, not as copy to paste.",
      id: "summary",
      title: copy.apply,
    },
    hook: {
      body: openingTranscript,
      id: "hook",
      title: copy.hook,
    },
    primaryTabLabel: copy.breakdown,
    sections,
    title: recipe.title,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
cd parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts
```

Expected: PASS with no output.

- [ ] **Step 5: Commit**

```bash
git add parrotkit-app/src/features/recipes/lib/recipe-breakdown-summary.ts parrotkit-app/src/features/recipes/lib/recipe-breakdown-summary.test.ts
git commit -m "feat: add recipe breakdown summary model"
```

---

### Task 2: Render Video-Level Breakdown Panel

**Files:**
- Create: `parrotkit-app/src/features/recipes/components/recipe-breakdown-panel.tsx`
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`

- [ ] **Step 1: Create the panel component**

```tsx
// parrotkit-app/src/features/recipes/components/recipe-breakdown-panel.tsx
import { Text, View } from "react-native";

import type { RecipeBreakdownSummary } from "@/features/recipes/lib/recipe-breakdown-summary";

export function RecipeBreakdownPanel({
  breakdown,
}: {
  breakdown: RecipeBreakdownSummary;
}) {
  return (
    <View style={{ gap: 22, paddingHorizontal: 20, paddingTop: 18 }}>
      <View style={{ gap: 7 }}>
        <Text
          numberOfLines={2}
          style={{
            color: "#111827",
            fontSize: 24,
            fontWeight: "900",
            letterSpacing: 0,
            lineHeight: 30,
          }}
        >
          {breakdown.title}
        </Text>
        <Text
          style={{
            color: "#475569",
            fontSize: 15,
            fontWeight: "600",
            letterSpacing: 0,
            lineHeight: 22,
          }}
        >
          {breakdown.applyToYourShoot.body}
        </Text>
      </View>

      <BreakdownSection body={breakdown.hook.body} title={breakdown.hook.title} />

      {breakdown.sections.map((section) => (
        <BreakdownSection
          body={section.body}
          key={section.id}
          title={section.title}
        />
      ))}
    </View>
  );
}

function BreakdownSection({ body, title }: { body: string; title: string }) {
  return (
    <View style={{ gap: 5 }}>
      <Text
        style={{
          color: "#111827",
          fontSize: 16,
          fontWeight: "900",
          letterSpacing: 0,
          lineHeight: 22,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: "#475569",
          fontSize: 14,
          fontWeight: "600",
          letterSpacing: 0,
          lineHeight: 21,
        }}
      >
        {body}
      </Text>
    </View>
  );
}
```

- [ ] **Step 2: Import the panel and model in recipe detail**

In `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`, add:

```ts
import { RecipeBreakdownPanel } from "@/features/recipes/components/recipe-breakdown-panel";
import { getRecipeBreakdownSummary } from "@/features/recipes/lib/recipe-breakdown-summary";
```

- [ ] **Step 3: Add board-level tab state and breakdown memo**

Inside `RecipeDetailScreen`, near existing state:

```ts
const [activeBoardTab, setActiveBoardTab] = useState<"board" | "breakdown">("board");
```

After `renderedShootBoard`:

```ts
const recipeBreakdown = useMemo(
  () => (nativeRecipe ? getRecipeBreakdownSummary(nativeRecipe, language) : null),
  [language, nativeRecipe],
);
```

- [ ] **Step 4: Run TypeScript to catch import/state issues**

Run:

```bash
cd parrotkit-app
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add parrotkit-app/src/features/recipes/components/recipe-breakdown-panel.tsx parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx
git commit -m "feat: add recipe breakdown panel"
```

---

### Task 3: Add `Board / Breakdown` Switch Without Changing Default Flow

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx`
- Create: `parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts`

- [ ] **Step 1: Write the source contract test**

```ts
// parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
  path.resolve(__dirname, "../recipe-detail-screen.tsx"),
  "utf8",
);

if (!source.includes('useState<"board" | "breakdown">("board")')) {
  throw new Error("Recipe detail must default to the Board tab");
}

if (!source.includes("Board") || !source.includes("Breakdown")) {
  throw new Error("Recipe detail must expose Board / Breakdown labels");
}

if (!source.includes("<RecipeBreakdownPanel")) {
  throw new Error("Breakdown tab must render RecipeBreakdownPanel");
}

if (source.includes("Hook / Proof / Demonstration / CTA")) {
  throw new Error("Board tab must not expose analysis taxonomy as a tab label");
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts
```

Expected: FAIL until the switch is wired.

- [ ] **Step 3: Add the switch above the board list content**

In `ListHeaderComponent`, after `ShootBoardBodyHeader` and before `ShootBoardNoteCta`, add:

```tsx
<View style={styles.boardTabSwitch}>
  {(["board", "breakdown"] as const).map((tab) => {
    const active = activeBoardTab === tab;
    const label =
      tab === "board"
        ? language === "ko"
          ? "보드"
          : "Board"
        : language === "ko"
          ? "분석"
          : "Breakdown";

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        key={tab}
        onPress={() => setActiveBoardTab(tab)}
        style={[styles.boardTabButton, active && styles.boardTabButtonActive]}
      >
        <Text
          style={[
            styles.boardTabText,
            active && styles.boardTabTextActive,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  })}
</View>
```

- [ ] **Step 4: Switch content without duplicating the header**

Replace the `ShootBoardDraggableList` block with conditional rendering:

```tsx
{activeBoardTab === "board" ? (
  <ShootBoardDraggableList
    contentContainerStyle={{ paddingBottom: insets.bottom + 112 }}
    cuts={renderedShootBoard.cuts}
    expandedCutIds={expandedCutIds}
    highlightedCutId={boardOverviewState.highlightCutId ?? undefined}
    language={language}
    ListHeaderComponent={boardHeader}
    onDragStateChange={setBoardDragActive}
    onPreview={openReferenceViewer}
    onReorderCuts={handleReorderCuts}
    onResetCut={resetCutText}
    onSetFinalTake={(cut, take) => selectFinalTake(cut, take.id)}
    onShoot={openPrompterForCut}
    onTake={openTakeViewer}
    onToggleChecklistItem={toggleChecklistItem}
    onToggleExpanded={toggleExpandedCut}
    onUpdateCutText={updateCutText}
    reorderMode={reorderMode || boardDragActive}
  />
) : (
  <ScrollView
    className="flex-1"
    contentContainerStyle={{ paddingBottom: insets.bottom + 44 }}
    showsVerticalScrollIndicator={false}
  >
    {boardHeader}
    {recipeBreakdown ? (
      <RecipeBreakdownPanel breakdown={recipeBreakdown} />
    ) : null}
  </ScrollView>
)}
```

Before the return, define `boardHeader`:

```tsx
const boardHeader = (
  <>
    <ShootBoardBodyHeader
      board={renderedShootBoard}
      language={language}
      onOpenNote={() => setNoteEntryOpen(true)}
    />
    <View style={styles.boardTabSwitch}>{/* switch body from Step 3 */}</View>
    <ShootBoardNoteCta
      checked={renderedShootBoard.boardNoteChecked ?? false}
      expanded={noteEntryOpen}
      language={language}
      value={renderedShootBoard.boardNote ?? ""}
      onChangeText={(boardNote) => updateBoardNote({ boardNote })}
      onClose={() => setNoteEntryOpen(false)}
      onToggleChecked={() =>
        updateBoardNote({
          boardNoteChecked: !(renderedShootBoard.boardNoteChecked ?? false),
        })
      }
    />
    {activeBoardTab === "board" ? (
      <ShootBoardStickyHeader
        language={language}
        onToggleReorder={() => setReorderMode((current) => !current)}
        reorderMode={reorderMode}
        title={boardCopy.cutsList}
      />
    ) : null}
  </>
);
```

- [ ] **Step 5: Add styles**

Inside `StyleSheet.create` in `recipe-detail-screen.tsx`:

```ts
boardTabSwitch: {
  alignSelf: "stretch",
  backgroundColor: "#f1f5f9",
  borderRadius: 14,
  flexDirection: "row",
  gap: 4,
  marginHorizontal: 20,
  marginTop: 10,
  padding: 4,
},
boardTabButton: {
  alignItems: "center",
  borderRadius: 10,
  flex: 1,
  justifyContent: "center",
  minHeight: 38,
},
boardTabButtonActive: {
  backgroundColor: "#ffffff",
},
boardTabText: {
  color: "#64748b",
  fontSize: 13,
  fontWeight: "800",
  letterSpacing: 0,
},
boardTabTextActive: {
  color: "#111827",
},
```

- [ ] **Step 6: Run tests**

Run:

```bash
cd parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: both PASS.

- [ ] **Step 7: Commit**

```bash
git add parrotkit-app/src/features/recipes/screens/recipe-detail-screen.tsx parrotkit-app/src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts
git commit -m "feat: add board breakdown switch"
```

---

### Task 4: Compact Collapsed Cut Rows

**Files:**
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-media-slot.tsx`
- Modify: `parrotkit-app/src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`

- [ ] **Step 1: Add design contract checks**

Append these checks to `shoot-board-scene-card-design-contract.test.ts`:

```ts
if (!source.includes("styles.compactRow")) {
  throw new Error("Collapsed cut cards must use compactRow layout");
}

if (!source.includes("styles.referenceAnchor")) {
  throw new Error("Collapsed cut cards must keep reference as the left anchor");
}

if (source.includes("No take yet") || source.includes("0 takes")) {
  throw new Error("Collapsed board UI must not show redundant empty take labels");
}

if (source.includes("Key Hook") || source.includes("Cut hook")) {
  throw new Error("Cut rows must not repeat hook taxonomy labels");
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
```

Expected: FAIL until compact row styles exist.

- [ ] **Step 3: Replace collapsed header/action layout**

In `ShootBoardSceneCard`, keep expanded layout intact. For `!expanded`, use this structure inside the card root:

```tsx
{!expanded ? (
  <View style={styles.compactRow}>
    <Pressable
      accessibilityRole="button"
      onPress={onPreview}
      style={({ pressed }) => [
        styles.referenceAnchor,
        pressed && styles.referencePreviewPressed,
      ]}
    >
      {referenceViewer.thumbnailUrl ? (
        <Image
          accessibilityIgnoresInvertColors
          resizeMode="cover"
          source={{ uri: referenceViewer.thumbnailUrl }}
          style={styles.referencePreviewImage}
        />
      ) : null}
      <View style={styles.referencePlay}>
        <MaterialCommunityIcons color="#111827" name="play" size={15} />
      </View>
    </Pressable>

    <View style={styles.compactCopy}>
      <Pressable accessibilityRole="button" onPress={onToggleExpanded}>
        <View style={styles.compactTitleRow}>
          <Text numberOfLines={2} style={styles.compactTitle}>
            {headerParts.executionTitle}
          </Text>
          <MaterialCommunityIcons color="#64748b" name="chevron-down" size={18} />
        </View>
        <Text numberOfLines={2} style={styles.compactApplication}>
          {language === "ko"
            ? (cut.instructionKo ?? cut.instruction)
            : cut.instruction}
        </Text>
      </Pressable>

      <View style={styles.compactToolRows}>
        {previewRows.map((row) => (
          <Pressable
            accessibilityRole="button"
            key={row.id}
            onPress={onToggleExpanded}
            style={styles.compactToolRow}
          >
            <Text numberOfLines={1} style={styles.compactToolLabel}>
              {row.label}
            </Text>
            <Text numberOfLines={1} style={styles.compactToolValue}>
              {row.value}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.compactActionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onShoot()}
          style={styles.compactFilmButton}
        >
          <MaterialCommunityIcons color="#ffffff" name="video-outline" size={15} />
          <Text style={styles.compactFilmText}>{actionStatus.ctaLabel}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onTake()}
          style={styles.compactTakeButton}
        >
          <MaterialCommunityIcons
            color={cut.takes.length > 0 ? "#7c3aed" : "#64748b"}
            name={cut.takes.length > 0 ? "check-circle" : "plus-circle-outline"}
            size={15}
          />
          <Text
            numberOfLines={1}
            style={[
              styles.compactTakeText,
              cut.takes.length > 0 && styles.compactTakeTextSaved,
            ]}
          >
            {cut.takes.length > 0 ? `My Take ${cut.takes.length}` : "My Take"}
          </Text>
        </Pressable>
      </View>
    </View>
  </View>
) : null}
```

- [ ] **Step 4: Add compact styles**

Add to `StyleSheet.create` in `shoot-board-scene-card.tsx`:

```ts
compactRow: {
  flexDirection: "row",
  gap: 14,
},
referenceAnchor: {
  aspectRatio: 9 / 16,
  backgroundColor: "#f1f5f9",
  borderRadius: 13,
  flexShrink: 0,
  overflow: "hidden",
  position: "relative",
  width: 72,
},
referencePlay: {
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.88)",
  borderRadius: 999,
  height: 26,
  justifyContent: "center",
  left: "50%",
  marginLeft: -13,
  marginTop: -13,
  position: "absolute",
  top: "50%",
  width: 26,
},
compactCopy: {
  flex: 1,
  gap: 9,
  minWidth: 0,
},
compactTitleRow: {
  alignItems: "flex-start",
  flexDirection: "row",
  gap: 8,
},
compactTitle: {
  color: "#111827",
  flex: 1,
  fontSize: 17,
  fontWeight: "900",
  letterSpacing: 0,
  lineHeight: 22,
},
compactApplication: {
  color: "#64748b",
  fontSize: 13,
  fontWeight: "700",
  letterSpacing: 0,
  lineHeight: 18,
  marginTop: 3,
},
compactToolRows: {
  gap: 5,
},
compactToolRow: {
  flexDirection: "row",
  gap: 8,
  minHeight: 20,
},
compactToolLabel: {
  color: "#64748b",
  flexShrink: 0,
  fontSize: 11,
  fontWeight: "900",
  letterSpacing: 0,
  lineHeight: 16,
  width: 72,
},
compactToolValue: {
  color: "#111827",
  flex: 1,
  fontSize: 12,
  fontWeight: "700",
  letterSpacing: 0,
  lineHeight: 16,
},
compactActionRow: {
  flexDirection: "row",
  gap: 8,
},
compactFilmButton: {
  alignItems: "center",
  backgroundColor: "#111827",
  borderRadius: 12,
  flexDirection: "row",
  gap: 6,
  justifyContent: "center",
  minHeight: 38,
  paddingHorizontal: 14,
},
compactFilmText: {
  color: "#ffffff",
  fontSize: 13,
  fontWeight: "900",
  letterSpacing: 0,
},
compactTakeButton: {
  alignItems: "center",
  backgroundColor: "#f8fafc",
  borderRadius: 12,
  flex: 1,
  flexDirection: "row",
  gap: 6,
  justifyContent: "center",
  minHeight: 38,
  paddingHorizontal: 10,
},
compactTakeText: {
  color: "#64748b",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0,
},
compactTakeTextSaved: {
  color: "#7c3aed",
},
```

- [ ] **Step 5: Remove old collapsed media slot block**

Remove the collapsed-only usage of:

```tsx
<View style={styles.collapsedActionArea}>
  <View style={styles.collapsedMediaSlots}>
    {mediaSlots.map(...)}
  </View>
  <View style={styles.collapsedActionColumn}>...</View>
</View>
```

Then remove unused `mediaSlots` variable if TypeScript reports it unused.

- [ ] **Step 6: Run tests**

Run:

```bash
cd parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
```

Expected: both PASS.

- [ ] **Step 7: Commit**

```bash
git add parrotkit-app/src/features/recipes/components/shoot-board-scene-card.tsx parrotkit-app/src/features/recipes/components/shoot-board-media-slot.tsx parrotkit-app/src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
git commit -m "feat: compact shooting board cut rows"
```

---

### Task 5: Keep Supadata/Gemini Deferred but Integration-Ready

**Files:**
- Modify: `parrotkit-app/seeds/parrotkit_recipe_analysis_contract_20260517.yaml`
- Create: `parrotkit-app/context/context_20260517_recipe_board_breakdown_ui_plan.md`

- [ ] **Step 1: Add seed note**

Append under `non_goals` in `parrotkit-app/seeds/parrotkit_recipe_analysis_contract_20260517.yaml`:

```yaml
  - Build Supadata/Gemini ingestion before the UI projection boundary is stable.
```

Append under `exit_conditions`:

```yaml
  - Supadata/Gemini can later populate the Recipe Analysis Contract without changing the Board / Breakdown UI boundary.
```

- [ ] **Step 2: Add context note**

```md
# 2026-05-17 Recipe Board Breakdown UI Plan

## Decision

Supadata/Gemini video analysis and automatic cut segmentation are deferred.
The next implementation should first stabilize the UI boundary:

- Board: compact filming actions.
- Breakdown: video-level analysis.

## Rationale

The Recipe Analysis Contract can store Sandcastle-level detail, but DESIGN.md
requires the filming UI to stay compact and execution-first. Building the UI
projection first prevents the future analysis pipeline from flooding the board
with taxonomy labels.
```

- [ ] **Step 3: Commit**

```bash
git add parrotkit-app/seeds/parrotkit_recipe_analysis_contract_20260517.yaml parrotkit-app/context/context_20260517_recipe_board_breakdown_ui_plan.md
git commit -m "docs: defer video analysis integration"
```

---

### Task 6: Full Verification and Native QA

**Files:**
- Update: `parrotkit-app/context/context_20260517_recipe_board_breakdown_ui_plan.md`
- Create screenshots under: `parrotkit-app/output/playwright/recipe-board-breakdown-20260517/`
- Create report: `parrotkit-app/output/reports/20260517_recipe_board_breakdown_ui.md`

- [ ] **Step 1: Run focused tests**

```bash
cd parrotkit-app
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/lib/recipe-breakdown-summary.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-breakdown-tab-contract.test.ts
NODE_OPTIONS='--require ./scripts/register-tsconfig-alias.cjs' ./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
npx -y @google/design.md lint DESIGN.md
git diff --check
```

Expected:

- All source-contract tests PASS.
- TypeScript PASS.
- Architecture PASS.
- DESIGN.md lint has 0 errors. Existing unused-token warnings may remain and must be reported separately.

- [ ] **Step 2: Run local native app**

```bash
cd parrotkit-app
EXPO_NO_TELEMETRY=1 npm run start -- --port 8096 --localhost
```

Expected: Metro starts on port 8096.

- [ ] **Step 3: Android QA capture**

```bash
adb reverse tcp:8096 tcp:8096
adb shell am start -a android.intent.action.VIEW -d 'exp+parrotkit-app://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8096'
adb shell am start -a android.intent.action.VIEW -d 'parrotkit-app://recipe/recipe-korean-diet-hook'
mkdir -p parrotkit-app/output/playwright/recipe-board-breakdown-20260517
adb exec-out screencap -p > parrotkit-app/output/playwright/recipe-board-breakdown-20260517/android-board.png
```

Manual checks:

- Board is default.
- Collapsed rows feel like compact action rows, not nested cards.
- Reference is a 9:16 left anchor.
- My Take is result/action state, not a peer reference card.
- Breakdown tab opens video-level analysis.
- Hook appears once in Breakdown, not on every cut.

- [ ] **Step 4: iOS QA capture**

```bash
xcrun simctl openurl booted 'exp+parrotkit-app://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8096'
xcrun simctl openurl booted 'parrotkit-app://recipe/recipe-korean-diet-hook'
mkdir -p parrotkit-app/output/playwright/recipe-board-breakdown-20260517
xcrun simctl io booted screenshot parrotkit-app/output/playwright/recipe-board-breakdown-20260517/ios-board.png
```

If `simctl` hangs, record the exact timeout/blocker in the report and do not reuse stale iOS evidence.

- [ ] **Step 5: Write report**

```md
# 2026-05-17 Recipe Board Breakdown UI QA

## Target

Local Expo development build, recipe detail shooting board.

## Verified

- Board default tab
- Breakdown video-level tab
- Compact cut row layout
- 9:16 reference anchor
- My Take result state
- No repeated per-cut hook labels
- No box-in-box drift

## Screenshots

- output/playwright/recipe-board-breakdown-20260517/android-board.png
- output/playwright/recipe-board-breakdown-20260517/ios-board.png

## Risks

Document any simulator/device blocker here.
```

- [ ] **Step 6: Commit and push**

```bash
git add parrotkit-app/src parrotkit-app/seeds parrotkit-app/context parrotkit-app/output
git commit -m "feat: add board breakdown recipe UI"
git fetch origin main
git rebase origin/main
git push origin main
```

Expected: push succeeds to `main`.

---

## Self-Review

Spec coverage:

- Supadata/Gemini is explicitly deferred in Task 5.
- Recipe Analysis Contract feeds Breakdown through Task 1 and Task 2.
- Board remains compact through Task 4.
- `Board / Breakdown` separation is implemented in Task 3.
- Native QA is covered in Task 6.

Placeholder scan:

- No TBD/TODO placeholders.
- Each code-producing step has concrete file paths and code.

Type consistency:

- `RecipeBreakdownSummary` is defined in Task 1 and consumed by Task 2.
- `activeBoardTab` is defined in Task 3 and used only as `"board" | "breakdown"`.
- Test commands use existing `sucrase-node` + tsconfig alias registration pattern.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-17-recipe-board-breakdown-ui.md`.

Two execution options:

1. **Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

