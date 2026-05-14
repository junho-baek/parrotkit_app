export const PROMPTER_SCROLL_STEP = 56;

export type PrompterScrollDirection = 'up' | 'down';

export function clampPrompterScrollOffset(offset: number, maxOffset: number) {
  if (!Number.isFinite(offset)) return 0;

  return Math.min(Math.max(0, offset), Math.max(0, maxOffset));
}

export function getNextPrompterScrollOffset({
  currentOffset,
  direction,
  maxOffset,
  step = PROMPTER_SCROLL_STEP,
}: {
  currentOffset: number;
  direction: PrompterScrollDirection;
  maxOffset: number;
  step?: number;
}) {
  const delta = direction === 'down' ? step : -step;

  return clampPrompterScrollOffset(currentOffset + delta, maxOffset);
}
