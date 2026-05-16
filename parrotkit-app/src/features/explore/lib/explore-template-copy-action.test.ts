import {
  getExploreTemplateDetailCopyAffordance,
} from "./explore-template-copy-action";

const detailCopyAffordance = getExploreTemplateDetailCopyAffordance({
  copied: false,
  language: "en",
});

if (
  detailCopyAffordance.label !== "Copy template" ||
  detailCopyAffordance.iconName !== "content-copy" ||
  detailCopyAffordance.kind !== "copy"
) {
  throw new Error("Explore detail should expose unsaved selected templates as copyable template content.");
}

const copiedDetailAffordance = getExploreTemplateDetailCopyAffordance({
  copied: true,
  language: "ko",
});

if (
  copiedDetailAffordance.label !== "복사됨" ||
  copiedDetailAffordance.iconName !== "check-circle" ||
  copiedDetailAffordance.kind !== "copied"
) {
  throw new Error("Explore detail should show a copied state after template copy.");
}
