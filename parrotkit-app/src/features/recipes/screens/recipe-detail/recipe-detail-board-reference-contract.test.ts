import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(__dirname, "../recipe-detail-screen.tsx"), "utf8");

for (const requiredConcept of [
  "getBoardReferencePreview",
  "cutBoardReference",
  "cutBoardHeaderRow",
  "레퍼런스",
  "Reference",
]) {
  if (!source.includes(requiredConcept)) {
    throw new Error(
      `Recipe detail board header should keep the reference preview above the title: ${requiredConcept}`,
    );
  }
}

if (source.includes("onToggleSceneComplete")) {
  throw new Error("Board rows should not expose manual completion as the primary check.");
}

if (source.includes("setShootBoardCutCompletion")) {
  throw new Error("Board completion UI should be driven by My Take state, not manual cut completion.");
}

