import {
  getNextPrompterTextSizeLevel,
  type PrompterTextSizeLevel,
} from "@/features/recipes/lib/prompter-text-size";

export type PrompterOpacityLevel = "soft" | "medium" | "solid";

const PROMPTER_OPACITY_LEVELS: PrompterOpacityLevel[] = ["soft", "medium", "solid"];

const PROMPTER_OPACITY_VALUES: Record<PrompterOpacityLevel, number> = {
  medium: 0.72,
  soft: 0.54,
  solid: 0.92,
};

export function getPrompterTextSizeLevelFromPinch({
  level,
  scale,
}: {
  level: PrompterTextSizeLevel;
  scale: number;
}): PrompterTextSizeLevel {
  if (scale >= 1.12) {
    return getNextPrompterTextSizeLevel({ direction: "increase", level });
  }

  if (scale <= 0.88) {
    return getNextPrompterTextSizeLevel({ direction: "decrease", level });
  }

  return level;
}

export function getPrompterOpacityValue(level: PrompterOpacityLevel) {
  return PROMPTER_OPACITY_VALUES[level] ?? PROMPTER_OPACITY_VALUES.medium;
}

export function getNextPrompterOpacityLevel(
  level: PrompterOpacityLevel,
  direction: "decrease" | "increase",
) {
  const index = Math.max(0, PROMPTER_OPACITY_LEVELS.indexOf(level));
  const nextIndex = direction === "increase" ? index + 1 : index - 1;
  const clampedIndex = Math.min(Math.max(0, nextIndex), PROMPTER_OPACITY_LEVELS.length - 1);

  return PROMPTER_OPACITY_LEVELS[clampedIndex];
}

