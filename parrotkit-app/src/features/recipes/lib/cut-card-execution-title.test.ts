import { getCutCardExecutionTitle } from "@/features/recipes/lib/cut-card-execution-title";
import type {
  ShootBoardCut,
  ShootBoardCutRole,
} from "@/features/recipes/lib/shoot-board-model";

const standardCases: Array<{
  en: string;
  ko: string;
  role: Exclude<ShootBoardCutRole, "custom">;
}> = [
  {
    en: "Open on the finished look",
    ko: "완성된 결과 먼저 보여주기",
    role: "hook",
  },
  {
    en: "Show the proof close-up",
    ko: "증거 장면 클로즈업",
    role: "proof",
  },
  {
    en: "Film the repeatable steps",
    ko: "따라 할 순서 촬영하기",
    role: "scene",
  },
  {
    en: "End with the save line",
    ko: "저장하고 싶게 마무리하기",
    role: "cta",
  },
];

for (const testCase of standardCases) {
  const cut = createCut({
    role: testCase.role,
    roleLabel: testCase.role.toUpperCase(),
  });

  if (getCutCardExecutionTitle(cut, "en") !== testCase.en) {
    throw new Error(`${testCase.role} should use the English execution title.`);
  }

  if (getCutCardExecutionTitle(cut, "ko") !== testCase.ko) {
    throw new Error(`${testCase.role} should use the Korean execution title.`);
  }
}

const customTitledCut = createCut({
  role: "custom",
  roleLabel: "Creator intro beat",
});

if (getCutCardExecutionTitle(customTitledCut, "en") !== "Creator intro beat") {
  throw new Error("Custom cuts should preserve a nonblank user role title.");
}

if (getCutCardExecutionTitle(customTitledCut, "ko") !== "Creator intro beat") {
  throw new Error("Custom Korean cuts should preserve a nonblank user role title.");
}

const blankCustomCut = createCut({
  role: "custom",
  roleLabel: " ",
});

if (getCutCardExecutionTitle(blankCustomCut, "en") !== "Custom") {
  throw new Error("Blank custom cuts should fall back to the English label.");
}

if (getCutCardExecutionTitle(blankCustomCut, "ko") !== "직접 구성") {
  throw new Error("Blank custom cuts should fall back to the Korean label.");
}

function createCut({
  role,
  roleLabel,
}: {
  role: ShootBoardCutRole;
  roleLabel: string;
}) {
  return {
    role,
    roleLabel,
  } as ShootBoardCut;
}
