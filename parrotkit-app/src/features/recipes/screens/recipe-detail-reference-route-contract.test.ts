import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(__dirname, "recipe-detail-screen.tsx"), "utf8");

if (!source.includes("referenceCutId?: string")) {
  throw new Error("Recipe detail route should accept referenceCutId for direct reference viewer links.");
}

if (!source.includes("handledReferenceViewerRouteKeyRef")) {
  throw new Error("Reference viewer route handling should be idempotent.");
}

if (!source.includes("String(cut.order) === params.referenceCutId")) {
  throw new Error("Reference viewer route should support compact cut-order deep links.");
}

if (!source.includes("setReferenceViewerCutId(targetCut.id)")) {
  throw new Error("Reference viewer route should open the modal for the target cut.");
}
