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
const referenceAnchorStyle = getStyleBlock("referenceAnchor");
const cardStyle = getStyleBlock("card");
const highlightedCardStyle = getStyleBlock("highlightedCard");
const takeViewerPreviewStyle = getStyleBlock("takeViewerPreview");
const mediaSlotRootStyle = getStyleBlockFromSource(mediaSlotSource, "root");
const mediaSlotPreviewStyle = getStyleBlockFromSource(
  mediaSlotSource,
  "preview",
);
const collapsedRowSource = getSourceBetween(
  source,
  "{!expanded ? (",
  "      ) : (",
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

if (!referenceAnchorStyle.includes("aspectRatio: 9 / 16")) {
  throw new Error("Collapsed reference anchor must use 9:16 short-form framing.");
}

if (referenceAnchorStyle.includes("width: 72")) {
  throw new Error("Collapsed reference anchor must not shrink back to a tiny play affordance.");
}

if (!/width:\s*(8[8-9]|9\d|1\d{2})/.test(referenceAnchorStyle)) {
  throw new Error("Collapsed reference anchor must stay wide enough to read as video.");
}

if (!cardStyle.includes("borderBottomWidth: 1")) {
  throw new Error("Collapsed cut rows should use a list divider instead of a full boxed card border.");
}

if (cardStyle.includes("borderWidth: 1") || cardStyle.includes("borderRadius: 14")) {
  throw new Error("Collapsed cut rows must not reintroduce full rounded card boxes.");
}

if (
  highlightedCardStyle.includes("borderWidth: 2") ||
  highlightedCardStyle.includes("#8b5cf6") ||
  highlightedCardStyle.includes("shadowOpacity")
) {
  throw new Error("Next-cut emphasis should use a light label/accent, not a purple boxed highlight.");
}

if (!mediaSlotPreviewStyle.includes("aspectRatio: 9 / 16")) {
  throw new Error("My Take media slot must use 9:16 short-form framing.");
}

if (!takeViewerPreviewStyle.includes("aspectRatio: 9 / 16")) {
  throw new Error("Expanded My Take preview must use 9:16 short-form framing.");
}

if (/height:\s*120/.test(cutReferencePreviewStyle + cutReferenceSlotStyle)) {
  throw new Error("Cut reference preview should not be a fixed 16:9-like strip.");
}

if (/height:\s*\d+/.test(referenceAnchorStyle)) {
  throw new Error("Collapsed reference anchor should not use fixed-height framing.");
}

if (/height:\s*\d+/.test(mediaSlotRootStyle + mediaSlotPreviewStyle)) {
  throw new Error("My Take media slot should not use fixed-height framing.");
}

if (/height:\s*\d+/.test(takeViewerPreviewStyle)) {
  throw new Error("Expanded My Take preview should not use fixed-height framing.");
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

if (!collapsedRowSource.includes("headerParts.executionTitle")) {
  throw new Error("Collapsed cut rows must use execution title as the primary name.");
}

for (const compactMarker of [
  "styles.compactRow",
  "styles.referenceAnchor",
  "styles.compactMetaRow",
  "styles.nextCutPill",
  "styles.compactTimeText",
  "styles.compactCopy",
  "styles.compactToolRows",
  "styles.compactFilmButton",
  "styles.compactTakeButton",
]) {
  if (!collapsedRowSource.includes(compactMarker)) {
    throw new Error(`Collapsed cut rows must include compact marker: ${compactMarker}.`);
  }
}

for (const redundantReferenceLabel of [
  "referenceAnchorLabel",
  "referenceAnchorLabelText",
  "referenceAnchorTime",
  "referenceAnchorTimeText",
  "레퍼런스",
  "Reference",
]) {
  if (collapsedRowSource.includes(redundantReferenceLabel)) {
    throw new Error(
      `Collapsed reference thumbnail must not carry redundant overlay labels: ${redundantReferenceLabel}.`,
    );
  }
}

for (const removedCollapsedBox of [
  "styles.collapsedMediaSlots",
  "ShootBoardMediaSlot",
  "styles.collapsedActionColumn",
]) {
  if (collapsedRowSource.includes(removedCollapsedBox)) {
    throw new Error(`Collapsed rows must not keep the old media-slot box: ${removedCollapsedBox}.`);
  }
}

assertSourceOrder(collapsedRowSource, [
  "styles.referenceAnchor",
  "referenceThumbnailSource",
  "styles.compactMetaRow",
  "cut.timeRangeLabel",
  "headerParts.executionTitle",
  "previewRows.map",
  "row.label",
  "row.value",
  "actionStatus.ctaLabel",
  "My Take",
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
