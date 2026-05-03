import { recipesSeed } from '@/core/mocks/parrotkit-data';
import { normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
import {
  createAddedShootBoardCut,
  createShootBoardRecipe,
  getRecipePrompterHref,
  getShootBoardHref,
  toggleShootBoardCutStatus,
} from '@/features/recipes/lib/shoot-board-model';

const sourceRecipe = normalizeNativeRecipe(
  recipesSeed.find((recipe) => recipe.id === 'recipe-korean-diet-hook') ?? recipesSeed[0]
);

const board = createShootBoardRecipe(sourceRecipe, {
  isSaved: true,
  shotCutIds: [],
});

if (board.title !== 'Korean Diet Viral Hook') {
  throw new Error('Shoot Board should preserve the recipe title.');
}

if (board.totalCuts !== 3 || board.totalDurationSeconds !== 30 || board.shotCount !== 0) {
  throw new Error('Shoot Board should initialize 3 cuts, 30s total, and 0 shots for a fresh board.');
}

if (board.cuts[0]?.roleLabel !== 'HOOK' || board.cuts[1]?.roleLabel !== 'PROOF' || board.cuts[2]?.roleLabel !== 'CTA') {
  throw new Error('Shoot Board should map the first three cuts to HOOK, PROOF, and CTA roles.');
}

if (board.cuts[0]?.instruction !== 'Lead with the payoff.') {
  throw new Error('Shoot Board should use compact filming instructions instead of long scene summaries.');
}

const afterFirstShot = toggleShootBoardCutStatus(board, board.cuts[0].id);

if (afterFirstShot.shotCount !== 1 || afterFirstShot.cuts[0]?.isShot !== true) {
  throw new Error('Toggling a cut should mark it shot and update the shot count.');
}

const nextUnshot = afterFirstShot.cuts.find((cut) => !cut.isShot);

if (nextUnshot?.roleLabel !== 'PROOF') {
  throw new Error('Next unshot cut should move to PROOF after the HOOK cut is completed.');
}

const addedCut = createAddedShootBoardCut(board, 'Custom reminder');

if (addedCut.order !== 4 || addedCut.role !== 'custom' || addedCut.instruction !== 'Custom reminder') {
  throw new Error('Added cuts should be appended as custom cuts after the existing board cuts.');
}

if (getShootBoardHref(board.id) !== '/recipe/recipe-korean-diet-hook') {
  throw new Error('Start Shooting entry points should route to the Shoot Board, not directly to camera.');
}

if (getRecipePrompterHref(board.id, board.cuts[0].id) !== '/recipe/recipe-korean-diet-hook/prompter?sceneId=scene-1') {
  throw new Error('Cut shooting actions should route to the prompter for the selected cut.');
}
