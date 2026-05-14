import { getCutCardHeaderParts } from "@/features/recipes/lib/cut-card-header";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

const cut = {
  order: 3,
  roleLabel: "Proof",
  title: "Cut #3: Proof",
  titleKo: "컷 #3: Proof",
} as ShootBoardCut;

const englishHeader = getCutCardHeaderParts(cut, "en");

if (englishHeader.numberLabel !== "Cut #3") {
  throw new Error("Collapsed cut-card header should expose the cut number.");
}

if (englishHeader.roleLabel !== "Proof") {
  throw new Error("Collapsed cut-card header should expose the cut role.");
}

const koreanHeader = getCutCardHeaderParts(cut, "ko");

if (koreanHeader.numberLabel !== "컷 #3") {
  throw new Error("Korean cut-card header should expose the cut number.");
}

if (koreanHeader.roleLabel !== "Proof") {
  throw new Error("Korean cut-card header should preserve the cut role.");
}

const customCut = {
  order: 4,
  roleLabel: "",
  title: "Cut #4",
  titleKo: "컷 #4",
} as ShootBoardCut;

if (getCutCardHeaderParts(customCut, "en").roleLabel !== "Custom") {
  throw new Error("Blank/custom cuts should still show a clear role label.");
}

if (getCutCardHeaderParts(customCut, "ko").roleLabel !== "직접 구성") {
  throw new Error("Blank/custom Korean cuts should still show a clear role label.");
}
