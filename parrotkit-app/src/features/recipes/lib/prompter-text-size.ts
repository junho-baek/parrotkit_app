export type PrompterTextSizeLevel = 'sm' | 'md' | 'lg' | 'xl';

export type PrompterTextSizeMetrics = {
  label: string;
  primaryFontSize: number;
  primaryLineHeight: number;
  secondaryFontSize: number;
  secondaryLineHeight: number;
};

export type PrompterScriptTextRole = 'primary' | 'secondary';

export type PrompterScriptTextStyle = {
  fontSize: number;
  lineHeight: number;
};

export const PROMPTER_TEXT_SIZE_LEVELS: PrompterTextSizeLevel[] = ['sm', 'md', 'lg', 'xl'];
export const DEFAULT_PROMPTER_TEXT_SIZE_LEVEL: PrompterTextSizeLevel = 'md';

export const PROMPTER_TEXT_SIZE_METRICS: Record<PrompterTextSizeLevel, PrompterTextSizeMetrics> = {
  sm: {
    label: '90%',
    primaryFontSize: 27,
    primaryLineHeight: 35,
    secondaryFontSize: 22,
    secondaryLineHeight: 30,
  },
  md: {
    label: '100%',
    primaryFontSize: 30,
    primaryLineHeight: 39,
    secondaryFontSize: 24,
    secondaryLineHeight: 32,
  },
  lg: {
    label: '115%',
    primaryFontSize: 34,
    primaryLineHeight: 44,
    secondaryFontSize: 27,
    secondaryLineHeight: 36,
  },
  xl: {
    label: '130%',
    primaryFontSize: 39,
    primaryLineHeight: 50,
    secondaryFontSize: 31,
    secondaryLineHeight: 41,
  },
};

export function getPrompterTextSizeMetrics(level: PrompterTextSizeLevel) {
  return PROMPTER_TEXT_SIZE_METRICS[level] ?? PROMPTER_TEXT_SIZE_METRICS.md;
}

export function resolvePrompterTextSizeLevel(level: unknown): PrompterTextSizeLevel {
  return typeof level === 'string' && PROMPTER_TEXT_SIZE_LEVELS.includes(level as PrompterTextSizeLevel)
    ? level as PrompterTextSizeLevel
    : DEFAULT_PROMPTER_TEXT_SIZE_LEVEL;
}

export function getPrompterScriptTextStyle({
  level,
  role,
}: {
  level: PrompterTextSizeLevel;
  role: PrompterScriptTextRole;
}): PrompterScriptTextStyle {
  const metrics = getPrompterTextSizeMetrics(level);

  return role === 'primary'
    ? {
      fontSize: metrics.primaryFontSize,
      lineHeight: metrics.primaryLineHeight,
    }
    : {
      fontSize: metrics.secondaryFontSize,
      lineHeight: metrics.secondaryLineHeight,
    };
}

export function getNextPrompterTextSizeLevel({
  direction,
  level,
}: {
  direction: 'decrease' | 'increase';
  level: PrompterTextSizeLevel;
}) {
  const currentIndex = Math.max(0, PROMPTER_TEXT_SIZE_LEVELS.indexOf(level));
  const nextIndex = direction === 'increase' ? currentIndex + 1 : currentIndex - 1;
  const clampedIndex = Math.min(Math.max(0, nextIndex), PROMPTER_TEXT_SIZE_LEVELS.length - 1);

  return PROMPTER_TEXT_SIZE_LEVELS[clampedIndex];
}

export function canAdjustPrompterTextSize({
  direction,
  level,
}: {
  direction: 'decrease' | 'increase';
  level: PrompterTextSizeLevel;
}) {
  return getNextPrompterTextSizeLevel({ direction, level }) !== level;
}
