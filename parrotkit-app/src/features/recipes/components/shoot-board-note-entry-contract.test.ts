import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const testDirname = dirname(fileURLToPath(import.meta.url));

const screenSource = readFileSync(
  join(testDirname, "../screens/recipe-detail-screen.tsx"),
  "utf8",
);

const bodyHeaderSource = readFileSync(
  join(testDirname, "shoot-board-body-header.tsx"),
  "utf8",
);

const noteSource = readFileSync(
  join(testDirname, "shoot-board-note-cta.tsx"),
  "utf8",
);

if (!screenSource.includes("ShootBoardBodyHeader")) {
  throw new Error("Recipe detail must render ShootBoardBodyHeader above the cut list.");
}

if (!bodyHeaderSource.includes("board.title")) {
  throw new Error("Body header must own the recipe title.");
}

if (!noteSource.includes("expanded")) {
  throw new Error("Note entry must support collapsed and expanded states.");
}

if (!noteSource.includes("if (!expanded) return null")) {
  throw new Error("Collapsed note surface should render null by default.");
}

if (
  bodyHeaderSource.includes('accessibilityRole="checkbox"') ||
  bodyHeaderSource.includes("accessibilityRole='checkbox'")
) {
  throw new Error("Default collapsed note row must not be a checkbox-only CTA.");
}
