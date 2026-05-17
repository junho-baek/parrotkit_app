import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

type PrompterCutLike = Pick<ShootBoardCut, "id" | "order" | "sceneId">;

type PrompterBoardLike = {
  cuts?: PrompterCutLike[];
};

export type PrompterCutNavigation = {
  activeCut: PrompterCutLike | null;
  currentIndex: number;
  nextCut: PrompterCutLike | null;
  previousCut: PrompterCutLike | null;
  totalCuts: number;
};

export function getPrompterCutNavigation({
  fallbackSceneId,
  selectedCutId,
  shootBoard,
}: {
  fallbackSceneId?: string | null;
  selectedCutId?: string | null;
  shootBoard?: PrompterBoardLike | null;
}): PrompterCutNavigation {
  const orderedCuts = [...(shootBoard?.cuts ?? [])].sort(
    (first, second) => (first.order ?? 0) - (second.order ?? 0),
  );
  const selectedCut = selectedCutId
    ? orderedCuts.find((cut) => cut.id === selectedCutId) ?? null
    : null;
  const sceneCut = fallbackSceneId
    ? orderedCuts.find((cut) => cut.sceneId === fallbackSceneId) ?? null
    : null;
  const activeCut = selectedCut ?? sceneCut ?? orderedCuts[0] ?? null;
  const activeIndex = activeCut
    ? orderedCuts.findIndex((cut) => cut.id === activeCut.id)
    : -1;

  return {
    activeCut,
    currentIndex: activeIndex >= 0 ? activeIndex + 1 : 0,
    nextCut: activeIndex >= 0 ? orderedCuts[activeIndex + 1] ?? null : null,
    previousCut: activeIndex > 0 ? orderedCuts[activeIndex - 1] ?? null : null,
    totalCuts: orderedCuts.length,
  };
}

