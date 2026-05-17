import {
  getReferenceViewerHeader,
  getReferenceViewerRailItems,
} from "./reference-viewer-ui";

const cut = {
  id: "cut-1",
  order: 1,
  role: "hook" as const,
  roleLabel: "Hook",
  timeRangeLabel: "0:00-0:05",
  title: "Cut #1: Hook",
  titleKo: "컷 #1: Hook",
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

const koreanHeader = getReferenceViewerHeader({ cut, language: "ko" });

if (koreanHeader.title !== "완성된 결과 먼저 보여주기") {
  throw new Error("Reference viewer should prefer the localized execution title.");
}

const railItems = getReferenceViewerRailItems({
  activeCutId: "cut-2",
  cuts: [
    {
      ...cut,
      id: "cut-2",
      order: 2,
      role: "proof" as const,
      roleLabel: "Proof",
      timeRangeLabel: "0:05-0:13",
      title: "Show the proof close-up",
    },
    { ...cut, id: "cut-1", order: 1, timeRangeLabel: "0:00-0:05" },
  ],
  language: "en",
});

if (railItems[0]?.visibleLabel !== "1" || railItems[1]?.visibleLabel !== "2") {
  throw new Error("Reference rail should use sorted compact cut numbers.");
}

if (railItems.some((item) => /Hook|Proof|Reference|Cut #/.test(item.visibleLabel))) {
  throw new Error("Reference rail visible labels should not contain taxonomy labels.");
}

if (!railItems[1]?.active) {
  throw new Error("Reference rail should identify the active cut.");
}

if (railItems[1]?.accessibilityLabel !== "Open reference for cut 2, 0:05-0:13") {
  throw new Error("Reference rail should keep accessibility context without visible copy bloat.");
}
