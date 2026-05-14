export type ExploreCardRouteInput = {
  id: string;
  recipe?: {
    id: string;
  } | null;
};

export function getExploreCardDetailPath(card: ExploreCardRouteInput) {
  const detailId = card.recipe?.id ?? card.id;

  return `/explore-recipe/${encodeURIComponent(detailId)}`;
}
