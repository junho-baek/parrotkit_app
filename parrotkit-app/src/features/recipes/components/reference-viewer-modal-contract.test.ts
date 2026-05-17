import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(__dirname, "reference-viewer-modal.tsx"),
  "utf8",
);

if (!source.includes("function CutRailButton")) {
  throw new Error("Reference viewer should use compact numeric rail buttons.");
}

for (const forbidden of [
  "function CutThumb",
  "cutThumbImage",
  "activeCutThumb",
]) {
  if (source.includes(forbidden)) {
    throw new Error(
      `Reference viewer bottom rail should not render thumbnail-strip UI: ${forbidden}`,
    );
  }
}

if (!source.includes("styles.bottomRail")) {
  throw new Error("Reference viewer should keep a dedicated compact bottom rail.");
}

if (source.includes("<ScrollView") && source.includes("bottomRail")) {
  throw new Error("Reference viewer rail should not use a horizontal thumbnail-style ScrollView.");
}

if (source.includes("styles.cutRailButton,\\n        active && styles.activeCutRailButton,\\n        pressed")) {
  throw new Error("Reference viewer rail should use stable static styles on native.");
}
