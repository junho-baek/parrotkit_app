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

if (board.title !== 'Korean Diet Viral Recipe') {
  throw new Error('Shoot Board v2 should use the execution-board title from the directive.');
}

if (board.totalCuts !== 4 || board.totalDurationSeconds !== 40 || board.shotCount !== 0) {
  throw new Error('Shoot Board v2 should initialize 4 cuts, 40s total, and 0 shots for a fresh board.');
}

const roleLabels = board.cuts.map((cut) => cut.roleLabel).join(',');

if (roleLabels !== 'Hook,Proof,Scene,CTA') {
  throw new Error('Shoot Board v2 should map cuts to Hook, Proof, Scene, and CTA.');
}

if (board.cuts[0]?.instruction !== 'Lead with the payoff.' || board.cuts[0]?.instructionKo !== '결과를 먼저 보여준다.') {
  throw new Error('Shoot Board v2 should provide English and Korean cut instructions.');
}

if (board.cuts[0]?.speakingLineKo !== '이렇게 먹으니까 오래 갔어요.') {
  throw new Error('Shoot Board v2 should preserve the Korean prompter line for Korean UI.');
}

if (!board.cuts[0]?.shootingDirectionsKo?.length || !board.cuts[0]?.requiredChecksKo?.length) {
  throw new Error('Shoot Board v2 should include Korean shooting directions and required checks.');
}

const afterFirstShot = toggleShootBoardCutStatus(board, board.cuts[0].id);

if (afterFirstShot.shotCount !== 1 || afterFirstShot.cuts[0]?.isShot !== true) {
  throw new Error('Toggling a cut should mark it shot and update the shot count.');
}

const nextUnshot = afterFirstShot.cuts.find((cut) => !cut.isShot);

if (nextUnshot?.roleLabel !== 'Proof') {
  throw new Error('Next unshot cut should move to Proof after the Hook cut is completed.');
}

const addedCut = createAddedShootBoardCut(board, 'Custom reminder');

if (addedCut.order !== 5 || addedCut.role !== 'custom' || addedCut.instruction !== 'Custom reminder') {
  throw new Error('Added scenes should be appended as custom cuts after the existing board cuts.');
}

if (getShootBoardHref(board.id) !== '/recipe/recipe-korean-diet-hook') {
  throw new Error('Start Shooting entry points should route to the Shoot Board, not directly to camera.');
}

if (getRecipePrompterHref(board.id, board.cuts[0].sceneId) !== '/recipe/recipe-korean-diet-hook/prompter?sceneId=scene-1') {
  throw new Error('Cut shooting actions should route to the prompter for the selected cut scene.');
}
