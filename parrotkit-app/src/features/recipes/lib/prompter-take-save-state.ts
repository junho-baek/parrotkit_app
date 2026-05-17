export type PrompterTakeSaveState = 'idle' | 'saving' | 'kept' | 'saved' | 'denied' | 'failed' | 'shared';

type PrompterTakeReviewCopy = {
  caption: string;
  primaryActionLabel: string;
  title: string;
};

export type PrompterSavedTakeReturnInput = {
  cutId?: string | null;
  recipeId: string;
  sceneId: string;
  takeId?: string | null;
};

export function getPrompterTakeReviewCopy(
  status: PrompterTakeSaveState,
  message?: string
): PrompterTakeReviewCopy {
  switch (status) {
    case 'saving':
      return {
        caption: message ?? 'Saving this take locally.',
        primaryActionLabel: 'Saving...',
        title: 'Saving',
      };
    case 'kept':
      return {
        caption: message ?? 'This take is saved locally in the current cut.',
        primaryActionLabel: 'Back to cut',
        title: 'Saved to recipe',
      };
    case 'saved':
      return {
        caption: message ?? 'Saved to your native Gallery.',
        primaryActionLabel: 'Keep take',
        title: 'Saved',
      };
    case 'shared':
      return {
        caption: message ?? 'Opened in another app.',
        primaryActionLabel: 'Keep take',
        title: 'Opened',
      };
    case 'denied':
      return {
        caption: message ?? 'Allow Photos access, then save again.',
        primaryActionLabel: 'Keep take',
        title: 'Access Needed',
      };
    case 'failed':
      return {
        caption: message ?? 'Try Gallery or Open in... again.',
        primaryActionLabel: 'Keep take',
        title: 'Export Failed',
      };
    default:
      return {
        caption: message ?? 'Keep it in this recipe, or export when you choose.',
        primaryActionLabel: 'Keep take',
        title: 'Take Recorded',
      };
  }
}

export function getPrompterSavedTakeReturnHref({
  cutId,
  recipeId,
  sceneId,
  takeId,
}: PrompterSavedTakeReturnInput) {
  const query = new URLSearchParams();
  const targetSceneOrCutId = cutId?.trim() || sceneId;

  query.set('tab', 'shoot');
  query.set('sceneId', targetSceneOrCutId);

  if (takeId?.trim()) {
    query.set('takeId', takeId);
  }

  return `/recipe/${recipeId}?${query.toString()}`;
}
