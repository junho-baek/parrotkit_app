import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(__dirname, "shoot-board-scene-card.tsx"),
  "utf8",
);

const mediaSlotSource = readFileSync(
  join(__dirname, "shoot-board-media-slot.tsx"),
  "utf8",
);
const cutReferencePreviewStyle = getStyleBlock("cutReferencePreview");
const cutReferenceSlotStyle = getStyleBlock("cutReferenceSlot");
const mediaSlotRootStyle = getStyleBlockFromSource(mediaSlotSource, "root");
const mediaSlotPreviewStyle = getStyleBlockFromSource(
  mediaSlotSource,
  "preview",
);
const collapsedRowSource = getSourceBetween(
  source,
  "<CutReferencePreview",
  "<View style={styles.expandedBody}>",
);
const collapsedBodySource = getSourceBetween(
  source,
  '<View className="mt-2 gap-1.5">',
  "            </View>\n          )}",
);
const collapsedActionSource = getSourceBetween(
  source,
  "{!expanded ? (",
  "{expanded ? (",
);
const reorderHandleSource = getConditionalSource(
  source,
  "reorderMode",
  "<TouchableOpacity",
  ") : null}",
);

if (!cutReferencePreviewStyle.includes("aspectRatio: 9 / 16")) {
  throw new Error("Cut reference preview must use 9:16 short-form framing.");
}

if (!mediaSlotPreviewStyle.includes("aspectRatio: 9 / 16")) {
  throw new Error("My Take media slot must use 9:16 short-form framing.");
}

if (/height:\s*120/.test(cutReferencePreviewStyle + cutReferenceSlotStyle)) {
  throw new Error("Cut reference preview should not be a fixed 16:9-like strip.");
}

if (/height:\s*\d+/.test(mediaSlotRootStyle + mediaSlotPreviewStyle)) {
  throw new Error("My Take media slot should not use fixed-height framing.");
}

for (const removedStyleName of [
  "editorSection",
  "referenceViewerSection",
  "takeViewerSection",
]) {
  if (source.includes(removedStyleName)) {
    throw new Error(
      `Expanded shooting board should not keep nested ${removedStyleName} surfaces.`,
    );
  }
}

for (const requiredConcept of [
  "Line to say",
  "Shot guide",
  "Apply to your case",
  "Saved takes",
  "Checklist",
  "requiredChecklist",
  "getChecklistProgressLabel",
  "onToggleChecklistItem",
  "CutReferencePreview",
  "cutReferencePreview",
  "badgeLabel",
  "Film",
  "actionControls.retake",
  "actionControls.setFinal",
  "onSetFinalTake",
]) {
  if (!source.includes(requiredConcept)) {
    throw new Error(
      `Expanded shooting board source should retain ${requiredConcept}.`,
    );
  }
}

for (const removedControl of [
  "onToggleSceneComplete",
  "headerParts.roleLabel",
  "No take yet",
  "0 takes",
  "Take saved",
  "takeStatusPill",
  "takeStatusText",
  "boardReferenceColumn",
  "completionCircle",
  "My Take status",
]) {
  if (source.includes(removedControl)) {
    throw new Error(
      `Shooting board cut rows should not expose fixed role/manual completion control: ${removedControl}.`,
    );
  }
}

if (
  !reorderHandleSource.includes("<TouchableOpacity") ||
  !reorderHandleSource.includes("onLongPress={onDragStart}") ||
  !reorderHandleSource.includes("styles.dragHandle")
) {
  throw new Error("Reorder handle should render only in reorder mode.");
}

for (const redundantTakeLabel of ["No take yet", "0 takes", "Take saved"]) {
  if (source.includes(redundantTakeLabel)) {
    throw new Error(
      `Collapsed rows must not show redundant take-state labels: ${redundantTakeLabel}.`,
    );
  }
}

if (!collapsedBodySource.includes("headerParts.executionTitle")) {
  throw new Error(
    "Collapsed cut rows must use execution title as the primary name.",
  );
}

assertSourceOrder(collapsedRowSource, [
  "CutReferencePreview",
  "headerParts.numberLabel",
  "formatCutDuration",
  "headerParts.executionTitle",
]);

assertSourceOrder(collapsedBodySource, [
  "headerParts.executionTitle",
  "previewRows.map",
  "row.label",
  "row.value",
]);

assertSourceOrder(collapsedActionSource, [
  "styles.collapsedMediaSlots",
  "ShootBoardMediaSlot",
  "styles.collapsedActionColumn",
  "actionStatus.ctaLabel",
]);

for (const unboxedBoardArea of [
  "boardPrimaryArea",
  "boardCopyColumn",
  "cutReferencePreview",
  "savedTakesArea",
  "checklistRail",
]) {
  const styleBlock = getStyleBlock(unboxedBoardArea);

  if (/borderWidth|shadowOpacity|shadowRadius/.test(styleBlock)) {
    throw new Error(
      `Expanded shooting board should not reintroduce renamed nested boxes in ${unboxedBoardArea}.`,
    );
  }
}

for (const cardCentricCopy of ["Open card", "card pile", "card-centric"]) {
  if (source.toLowerCase().includes(cardCentricCopy.toLowerCase())) {
    throw new Error(
      `Expanded shooting board should not use card-centric visible copy: ${cardCentricCopy}.`,
    );
  }
}

function getStyleBlock(styleName: string) {
  return getStyleBlockFromSource(source, styleName);
}

function getStyleBlockFromSource(sourceText: string, styleName: string) {
  const match = sourceText.match(
    new RegExp(`\\n  ${styleName}: \\{[\\s\\S]*?\\n  \\},`),
  );

  if (!match) {
    throw new Error(`Expected style block to exist: ${styleName}`);
  }

  return match[0];
}

function getSourceBetween(sourceText: string, start: string, end: string) {
  const startIndex = sourceText.indexOf(start);

  if (startIndex === -1) {
    throw new Error(`Expected source marker to exist: ${start}`);
  }

  const endIndex = sourceText.indexOf(end, startIndex + start.length);

  if (endIndex === -1) {
    throw new Error(`Expected source marker to exist after ${start}: ${end}`);
  }

  return sourceText.slice(startIndex, endIndex);
}

function getConditionalSource(
  sourceText: string,
  conditionName: string,
  requiredBodyMarker: string,
  end: string,
) {
  const conditionalMatch = sourceText.match(
    new RegExp(`\\{${conditionName}\\s*\\?\\s*\\([\\s\\S]*?${escapeRegExp(end)}`),
  );

  if (!conditionalMatch) {
    throw new Error(`Expected conditional source for ${conditionName}.`);
  }

  if (!conditionalMatch[0].includes(requiredBodyMarker)) {
    throw new Error(
      `Expected ${conditionName} conditional to include ${requiredBodyMarker}.`,
    );
  }

  return conditionalMatch[0];
}

function assertSourceOrder(sourceText: string, orderedMarkers: string[]) {
  let previousIndex = -1;

  for (const marker of orderedMarkers) {
    const currentIndex = sourceText.indexOf(marker);

    if (currentIndex === -1) {
      throw new Error(`Expected collapsed row source to include ${marker}.`);
    }

    if (currentIndex <= previousIndex) {
      throw new Error(
        `Collapsed row source order is wrong near ${marker}.`,
      );
    }

    previousIndex = currentIndex;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
