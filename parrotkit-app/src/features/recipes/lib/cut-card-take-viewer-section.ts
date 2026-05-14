import type { AppLanguage } from "@/core/i18n/app-language";
import type {
  ShootBoardCut,
  ShootBoardTake,
} from "@/features/recipes/lib/shoot-board-model";

export type CutCardTakeViewerState = "empty" | "loading" | "populated";

export type CutCardTakeViewerItem = {
  id: string;
  durationLabel: string;
  final: boolean;
  metadataLabel: string;
  playbackLabel: string;
  recordedAtLabel: string;
  selected: boolean;
  statusLabel: string;
  take: ShootBoardTake;
  title: string;
};

export type CutCardTakeViewerActionControl = {
  disabled: boolean;
  label: string;
  visible: boolean;
};

export type CutCardTakeViewerSection = {
  actionControls: {
    retake: CutCardTakeViewerActionControl;
    setFinal: CutCardTakeViewerActionControl;
  };
  activeTake?: ShootBoardTake;
  body: string;
  primaryActionLabel: string;
  state: CutCardTakeViewerState;
  statusLabel: string;
  takeCountLabel: string;
  takeItems: CutCardTakeViewerItem[];
  thumbnailUrl?: string;
  title: string;
};

type CutCardTakeViewerOptions = {
  loading?: boolean;
};

const copy: Record<
  AppLanguage,
  {
    emptyBody: string;
    emptyStatus: string;
    finalBody: string;
    finalStatus: string;
    loadingBody: string;
    loadingStatus: string;
    populatedBody: string;
    populatedStatus: string;
    primaryEmpty: string;
    primaryLoading: string;
    primaryPopulated: string;
    primaryFinal: string;
    title: string;
    playbackLabel: string;
    savedStatus: string;
    finalItemStatus: string;
    reshootStatus: string;
    retakeAction: string;
    setFinalAction: string;
  }
> = {
  en: {
    emptyBody: "Film this cut to save a take here for quick review later.",
    emptyStatus: "No saved take",
    finalBody: "The selected final take is ready to review from this cut card.",
    finalStatus: "Final take selected",
    loadingBody: "Checking local saved takes for this cut.",
    loadingStatus: "Loading take",
    populatedBody: "Open the saved take set or record another version.",
    populatedStatus: "Take saved",
    primaryEmpty: "Film",
    primaryFinal: "View takes",
    primaryLoading: "Loading...",
    primaryPopulated: "Review takes",
    title: "Take viewer",
    playbackLabel: "Preview take",
    savedStatus: "Saved",
    finalItemStatus: "Final",
    reshootStatus: "Needs retake",
    retakeAction: "Retake",
    setFinalAction: "Set as final",
  },
  ko: {
    emptyBody: "이 컷을 촬영하면 저장된 테이크를 여기서 바로 확인할 수 있어요.",
    emptyStatus: "저장된 테이크 없음",
    finalBody: "선택된 최종 테이크를 이 컷 카드에서 다시 확인할 수 있어요.",
    finalStatus: "최종 테이크 선택됨",
    loadingBody: "이 컷에 저장된 로컬 테이크를 확인하는 중입니다.",
    loadingStatus: "테이크 불러오는 중",
    populatedBody: "저장된 테이크를 열어 확인하거나 새 버전을 촬영하세요.",
    populatedStatus: "테이크 저장됨",
    primaryEmpty: "촬영하기",
    primaryFinal: "테이크 보기",
    primaryLoading: "불러오는 중...",
    primaryPopulated: "테이크 보기",
    title: "Take viewer",
    playbackLabel: "미리보기",
    savedStatus: "저장됨",
    finalItemStatus: "Final",
    reshootStatus: "재촬영 필요",
    retakeAction: "재촬영",
    setFinalAction: "최종으로 설정",
  },
};

export function getCutCardTakeViewerSection(
  cut: ShootBoardCut,
  language: AppLanguage,
  options: CutCardTakeViewerOptions = {},
): CutCardTakeViewerSection {
  const localizedCopy = copy[language];

  if (options.loading) {
    return {
      actionControls: getActionControls(language, {
        hasActiveTake: false,
        isFinal: false,
        loading: true,
      }),
      body: localizedCopy.loadingBody,
      primaryActionLabel: localizedCopy.primaryLoading,
      state: "loading",
      statusLabel: localizedCopy.loadingStatus,
      takeCountLabel: formatTakeCount(cut.takes.length, language),
      takeItems: [],
      title: localizedCopy.title,
    };
  }

  const activeTake = getActiveTake(cut);

  if (!activeTake) {
    return {
      actionControls: getActionControls(language, {
        hasActiveTake: false,
        isFinal: false,
        loading: false,
      }),
      body: localizedCopy.emptyBody,
      primaryActionLabel: localizedCopy.primaryEmpty,
      state: "empty",
      statusLabel: localizedCopy.emptyStatus,
      takeCountLabel: formatTakeCount(0, language),
      takeItems: [],
      title: localizedCopy.title,
    };
  }

  const final = cut.takeStatus === "final" || activeTake.status === "final";

  return {
    actionControls: getActionControls(language, {
      hasActiveTake: true,
      isFinal: final,
      loading: false,
    }),
    activeTake,
    body: final ? localizedCopy.finalBody : localizedCopy.populatedBody,
    primaryActionLabel: final
      ? localizedCopy.primaryFinal
      : localizedCopy.primaryPopulated,
    state: "populated",
    statusLabel: final
      ? localizedCopy.finalStatus
      : localizedCopy.populatedStatus,
    takeCountLabel: formatTakeCount(cut.takes.length, language),
    takeItems: getTakeItems(cut, activeTake, language),
    thumbnailUrl: cut.takeThumbnailUrl || cut.thumbnailUrl || undefined,
    title: localizedCopy.title,
  };
}

function getActionControls(
  language: AppLanguage,
  {
    hasActiveTake,
    isFinal,
    loading,
  }: { hasActiveTake: boolean; isFinal: boolean; loading: boolean },
): CutCardTakeViewerSection["actionControls"] {
  const localizedCopy = copy[language];
  const visible = hasActiveTake && !loading;

  return {
    retake: {
      disabled: !visible,
      label: localizedCopy.retakeAction,
      visible,
    },
    setFinal: {
      disabled: !visible || isFinal,
      label: localizedCopy.setFinalAction,
      visible,
    },
  };
}

function getTakeItems(
  cut: ShootBoardCut,
  activeTake: ShootBoardTake,
  language: AppLanguage,
): CutCardTakeViewerItem[] {
  const localizedCopy = copy[language];

  return cut.takes.map((take) => {
    const final = take.id === cut.finalTakeId || take.status === "final";
    const durationLabel = formatDuration(take.durationSeconds, language);

    return {
      durationLabel,
      final,
      id: take.id,
      metadataLabel: `${durationLabel} · ${take.recordedAtLabel}`,
      playbackLabel: localizedCopy.playbackLabel,
      recordedAtLabel: take.recordedAtLabel,
      selected: take.id === activeTake.id,
      statusLabel: getItemStatusLabel(take, final, language),
      take,
      title: take.label,
    };
  });
}

function getActiveTake(cut: ShootBoardCut) {
  if (cut.finalTakeId) {
    const finalTake = cut.takes.find((take) => take.id === cut.finalTakeId);
    if (finalTake) return finalTake;
  }

  return (
    cut.takes.find((take) => take.status === "final") ?? cut.takes[0] ?? null
  );
}

function formatTakeCount(count: number, language: AppLanguage) {
  if (language === "ko") return `${count}개 테이크`;
  return `${count} ${count === 1 ? "take" : "takes"}`;
}

function formatDuration(durationSeconds: number, language: AppLanguage) {
  return language === "ko" ? `${durationSeconds}초` : `${durationSeconds}s`;
}

function getItemStatusLabel(
  take: ShootBoardTake,
  final: boolean,
  language: AppLanguage,
) {
  const localizedCopy = copy[language];

  if (final) return localizedCopy.finalItemStatus;
  if (take.status === "needs_reshoot") return localizedCopy.reshootStatus;
  return localizedCopy.savedStatus;
}
