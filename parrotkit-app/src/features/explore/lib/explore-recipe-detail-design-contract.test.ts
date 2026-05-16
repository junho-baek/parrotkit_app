import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(__dirname, "../screens/explore-recipe-detail-screen.tsx"),
  "utf8",
);

for (const requiredCopy of [
  "Reference feature",
  "Reference structure",
  "Apply it to your case",
  "레퍼런스 특징",
  "레퍼런스 구조",
  "내 경우 적용",
  "Open shoot board",
  "촬영 보드 열기",
]) {
  if (!source.includes(requiredCopy)) {
    throw new Error(`Explore detail should keep focused guide copy: ${requiredCopy}`);
  }
}

for (const removedCopy of [
  "Key Hook",
  "핵심 훅",
  "Included",
  "포함됨",
  "formatCompactMetric",
  "heroMeta",
  "includeChip",
  "notesBox",
]) {
  if (source.includes(removedCopy)) {
    throw new Error(
      `Explore detail should not reintroduce meta-heavy or boxed guide copy: ${removedCopy}`,
    );
  }
}

for (const fixedStructureLabel of [
  "getSceneRoleLabel",
  "sceneIndex === 0",
]) {
  if (source.includes(fixedStructureLabel)) {
    throw new Error(
      `Explore detail structure cards should not hard-code Hook/Proof/CTA roles: ${fixedStructureLabel}`,
    );
  }
}
