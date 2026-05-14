import {
  PROMPTER_SCROLL_STEP,
  getNextPrompterScrollOffset,
} from '@/features/recipes/lib/prompter-scroll';

const firstStep = getNextPrompterScrollOffset({
  currentOffset: 0,
  direction: 'down',
  maxOffset: 180,
});

if (firstStep !== PROMPTER_SCROLL_STEP) {
  throw new Error('Manual prompter scroll should move down by one readable step.');
}

const clampedBottom = getNextPrompterScrollOffset({
  currentOffset: 170,
  direction: 'down',
  maxOffset: 180,
});

if (clampedBottom !== 180) {
  throw new Error('Manual prompter scroll should clamp at the bottom of the copy.');
}

const clampedTop = getNextPrompterScrollOffset({
  currentOffset: 10,
  direction: 'up',
  maxOffset: 180,
});

if (clampedTop !== 0) {
  throw new Error('Manual prompter scroll should clamp at the top of the copy.');
}
