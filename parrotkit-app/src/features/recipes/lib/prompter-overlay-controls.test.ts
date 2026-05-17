import {
  getNextPrompterOpacityLevel,
  getPrompterOpacityValue,
  getPrompterTextSizeLevelFromPinch,
} from "./prompter-overlay-controls";

if (getPrompterTextSizeLevelFromPinch({ level: "md", scale: 1.18 }) !== "lg") {
  throw new Error("Pinch out should increase the prompter text size one level.");
}

if (getPrompterTextSizeLevelFromPinch({ level: "lg", scale: 0.82 }) !== "md") {
  throw new Error("Pinch in should decrease the prompter text size one level.");
}

if (getPrompterTextSizeLevelFromPinch({ level: "md", scale: 1.04 }) !== "md") {
  throw new Error("Small pinch noise should not change prompter text size.");
}

if (getPrompterOpacityValue("soft") !== 0.54 || getPrompterOpacityValue("solid") !== 0.92) {
  throw new Error("Prompter opacity presets should remain stable.");
}

if (getNextPrompterOpacityLevel("medium", "increase") !== "solid") {
  throw new Error("Opacity control should step upward predictably.");
}

if (
  getNextPrompterOpacityLevel("solid", "increase") !== "solid" ||
  getNextPrompterOpacityLevel("soft", "decrease") !== "soft"
) {
  throw new Error("Opacity control should clamp at the preset bounds.");
}

