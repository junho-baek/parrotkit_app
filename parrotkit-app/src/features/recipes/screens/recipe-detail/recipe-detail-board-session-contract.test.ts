import { readFileSync } from "fs";
import { join } from "path";

const screenSource = readFileSync(
  join(__dirname, "../recipe-detail-screen.tsx"),
  "utf8",
);

const headerSource = readFileSync(
  join(__dirname, "../../components/shoot-board-session-header.tsx"),
  "utf8",
);

if (!screenSource.includes("ShootBoardSessionHeader")) {
  throw new Error("Shooting board must render ShootBoardSessionHeader.");
}

if (!headerSource.includes('backgroundColor: "#0B0F14"')) {
  throw new Error("Session header should use the dark active-session bar.");
}

if (!headerSource.includes("copy.done")) {
  throw new Error("Session header must own the Done / 완료 action.");
}

if (headerSource.includes("board.title")) {
  throw new Error("Session header should not duplicate the recipe title.");
}
