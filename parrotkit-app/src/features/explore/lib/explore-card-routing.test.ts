import { getExploreCardDetailPath } from './explore-card-routing';

const recipeCardPath = getExploreCardDetailPath({
  id: 'market-card-shell',
  recipe: { id: 'market-recipe-beauty-proof-routine' },
});

const staticCardPath = getExploreCardDetailPath({
  id: 'brand-request-serum-launch',
});

const encodedStaticCardPath = getExploreCardDetailPath({
  id: 'guide with spaces',
});

const routeContractCases: Array<{ actual: string; expected: string }> = [
  {
    actual: recipeCardPath,
    expected: '/explore-recipe/market-recipe-beauty-proof-routine',
  },
  {
    actual: staticCardPath,
    expected: '/explore-recipe/brand-request-serum-launch',
  },
  {
    actual: encodedStaticCardPath,
    expected: '/explore-recipe/guide%20with%20spaces',
  },
];

routeContractCases satisfies Array<{ actual: string; expected: string }>;
