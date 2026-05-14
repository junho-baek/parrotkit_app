import {
  canAdjustPrompterTextSize,
  getNextPrompterTextSizeLevel,
  getPrompterScriptTextStyle,
  getPrompterTextSizeMetrics,
  resolvePrompterTextSizeLevel,
} from '@/features/recipes/lib/prompter-text-size';

const defaultMetrics = getPrompterTextSizeMetrics('md');

if (defaultMetrics.primaryFontSize !== 30 || defaultMetrics.secondaryFontSize !== 24) {
  throw new Error('Prompter default text size should match the existing readable camera typography.');
}

if (getNextPrompterTextSizeLevel({ direction: 'increase', level: 'md' }) !== 'lg') {
  throw new Error('Prompter text size should increase by one level.');
}

if (getNextPrompterTextSizeLevel({ direction: 'decrease', level: 'md' }) !== 'sm') {
  throw new Error('Prompter text size should decrease by one level.');
}

if (getNextPrompterTextSizeLevel({ direction: 'increase', level: 'xl' }) !== 'xl') {
  throw new Error('Prompter text size should clamp at the largest level.');
}

if (getNextPrompterTextSizeLevel({ direction: 'decrease', level: 'sm' }) !== 'sm') {
  throw new Error('Prompter text size should clamp at the smallest level.');
}

if (canAdjustPrompterTextSize({ direction: 'increase', level: 'xl' })) {
  throw new Error('Prompter text size controls should disable increasing at the largest level.');
}

const largePrimaryStyle = getPrompterScriptTextStyle({ level: 'lg', role: 'primary' });

if (largePrimaryStyle.fontSize !== 34 || largePrimaryStyle.lineHeight !== 44) {
  throw new Error('Primary prompter script rendering should use the selected large text size.');
}

const smallSecondaryStyle = getPrompterScriptTextStyle({ level: 'sm', role: 'secondary' });

if (smallSecondaryStyle.fontSize !== 22 || smallSecondaryStyle.lineHeight !== 30) {
  throw new Error('Secondary prompter script rendering should use the selected small text size.');
}

if (resolvePrompterTextSizeLevel('xl') !== 'xl') {
  throw new Error('Stored prompter text size should restore the selected level.');
}

if (resolvePrompterTextSizeLevel('stale-local-value') !== 'md') {
  throw new Error('Invalid stored prompter text size should fall back to the default level.');
}
