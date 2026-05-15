import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  hiddenRootTabNames,
  rootPasteActionHref,
  rootTabAccessibilityRoles,
  rootTabHrefs,
  rootTabMinimumTouchTarget,
  rootTabNames,
} from './root-tab-config';
import { rootTabIconNames } from './root-tab-icons';
import materialCommunityIconGlyphMap from '../../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

const expectedVisibleRootTabs = ['index', 'explore', 'source', 'recipes', 'my'] as const;
const expectedHiddenRootTabs = [] as const;
const visibleRootTabs = rootTabNames;
const visibleRootTabNames: readonly string[] = visibleRootTabs;
const hiddenRootTabs: readonly string[] = hiddenRootTabNames;

if (visibleRootTabs.length !== expectedVisibleRootTabs.length) {
  throw new Error(
    `Root bottom tabs must expose exactly five user-facing tabs. Found: ${visibleRootTabs.join(
      ','
    )}`
  );
}

expectedVisibleRootTabs.forEach((expectedTab, index) => {
  if (visibleRootTabs[index] !== expectedTab) {
    throw new Error(
      `Root bottom tabs must stay ordered as Home, Explore, Paste, Recipes, My. Found: ${visibleRootTabs.join(
        ','
      )}`
    );
  }
});

const visibleTabLabels = visibleRootTabs.map((tabName) => {
  switch (tabName) {
    case 'index':
      return 'Home';
    case 'explore':
      return 'Explore';
    case 'source':
      return 'Paste';
    case 'recipes':
      return 'Recipes';
    case 'my':
      return 'My';
    default:
      return tabName;
  }
});

if (visibleTabLabels.join(',') !== 'Home,Explore,Paste,Recipes,My') {
  throw new Error(
    `Root bottom tabs must show exactly Home, Explore, Paste, Recipes, My. Found: ${visibleTabLabels.join(',')}`
  );
}

if (hiddenRootTabs.join(',') !== expectedHiddenRootTabs.join(',')) {
  throw new Error(
    `No root bottom tabs should be hidden for the five-slot nav. Found: ${hiddenRootTabs.join(
      ','
    )}`
  );
}

hiddenRootTabs.forEach((hiddenTab) => {
  if (visibleRootTabNames.includes(hiddenTab)) {
    throw new Error(`${hiddenTab} must stay hidden from the root bottom tabs.`);
  }
});

const expectedRootTabHrefs = {
  index: '/',
  explore: '/explore',
  source: rootPasteActionHref,
  recipes: '/recipes',
  my: '/my',
} as const;

visibleRootTabs.forEach((tabName) => {
  const expectedHref = expectedRootTabHrefs[tabName];
  const actualHref = rootTabHrefs[tabName];

  if (actualHref !== expectedHref) {
    throw new Error(
      `${tabName} bottom tab must route to ${expectedHref}. Found: ${actualHref ?? 'missing'}`
    );
  }
});

if (rootTabHrefs.index !== '/') {
  throw new Error('Home tab must deep-link to the root Home route (/), not Explore or detail routes.');
}

if (rootTabHrefs.explore !== '/explore') {
  throw new Error(`Explore tab must deep-link to the Explore route (/explore). Found: ${rootTabHrefs.explore}`);
}

const exploreHref: string = rootTabHrefs.explore;
const homeHref: string = rootTabHrefs.index;

if (exploreHref === homeHref) {
  throw new Error('Explore and Home tabs must not point to the same route.');
}

if (rootPasteActionHref !== '/recipe-create?mode=reference') {
  throw new Error('The centered Paste tab must open the reference-link recipe creation drawer.');
}

const recipesHref: string = rootTabHrefs.recipes;
const pasteHref: string = rootTabHrefs.source;
const pasteActionHref: string = rootPasteActionHref;

if (recipesHref === pasteHref || recipesHref === pasteActionHref) {
  throw new Error('Recipes tab must not route to the Paste/Source creation action.');
}

if (recipesHref !== '/recipes') {
  throw new Error(`Recipes tab must deep-link to the saved recipes list (/recipes). Found: ${recipesHref}`);
}

const myHref: string = rootTabHrefs.my;
const otherRootTabHrefs: readonly string[] = [
  rootTabHrefs.index,
  rootTabHrefs.explore,
  pasteHref,
  recipesHref,
];

if (myHref !== '/my') {
  throw new Error(`My tab must deep-link to the My/Profile route (/my). Found: ${myHref}`);
}

if (otherRootTabHrefs.includes(myHref)) {
  throw new Error('My tab must not route to Home, Explore, Paste, or Recipes.');
}

const recipesRouteSource = readFileSync(resolve(__dirname, '../../app/(tabs)/recipes.tsx'), 'utf8').trim();

if (recipesRouteSource !== "export { RecipesScreen as default } from '@/features/recipes/screens/recipes-screen';") {
  throw new Error('The /recipes tab route must render RecipesScreen, not Source or another unintended screen.');
}

const myRouteSource = readFileSync(resolve(__dirname, '../../app/(tabs)/my.tsx'), 'utf8').trim();

if (myRouteSource !== "export { ProfileScreen as default } from '@/features/profile/screens/profile-screen';") {
  throw new Error('The /my tab route must render ProfileScreen, not another unintended screen.');
}

const exploreRouteSource = readFileSync(resolve(__dirname, '../../app/(tabs)/explore.tsx'), 'utf8').trim();

if (exploreRouteSource !== "export { ExploreScreen as default } from '@/features/explore/screens/explore-screen';") {
  throw new Error('The /explore tab route must render ExploreScreen, not Home or another unintended screen.');
}

const rootHomeRouteSource = readFileSync(resolve(__dirname, '../../app/(tabs)/index.tsx'), 'utf8').trim();
const rootNativeTabsSource = readFileSync(resolve(__dirname, './root-native-tabs.tsx'), 'utf8');

if (!rootNativeTabsSource.includes('active={pasteDrawerState.open}')) {
  throw new Error('The centered Paste action must show active feedback while the paste drawer is open.');
}

if (!rootNativeTabsSource.includes('pasteActionActive = focused || pasteDrawerState.open')) {
  throw new Error('Paste visual active state must be derived from route focus or the open paste drawer.');
}

if (!rootNativeTabsSource.includes('styles.pasteTabButtonHaloActive')) {
  throw new Error('The centered Paste action must have a distinct active halo style.');
}

if (!rootNativeTabsSource.includes('styles.pasteTabButtonSurfacePressed')) {
  throw new Error('The centered Paste action must retain distinct pressed feedback.');
}

if (rootHomeRouteSource !== "export { HomeScreen as default } from '@/features/home/screens/home-screen';") {
  throw new Error('The root Home tab route must render HomeScreen so returning from Explore opens Home.');
}

if (!rootNativeTabsSource.includes('accessibilityLabel={label}')) {
  throw new Error('Every custom bottom nav button must pass the visible tab label to accessibilityLabel.');
}

if (!rootNativeTabsSource.includes('accessibilityRole={role}')) {
  throw new Error('Every custom bottom nav button must pass an explicit accessibilityRole.');
}

if (!rootNativeTabsSource.includes('minHeight: rootTabMinimumTouchTarget')) {
  throw new Error('Bottom nav buttons must enforce the shared minimum touch target height.');
}

const homeDeepLinkRouteSource = readFileSync(resolve(__dirname, '../../app/home.tsx'), 'utf8').trim();
const rootLayoutSource = readFileSync(resolve(__dirname, '../../app/_layout.tsx'), 'utf8');

if (!homeDeepLinkRouteSource.includes('href="/"')) {
  throw new Error('The /home deep link route must redirect to the canonical root Home route (/).');
}

if (homeDeepLinkRouteSource.includes('HomeScreen as default')) {
  throw new Error('The /home deep link route must not bypass the root tab shell by rendering HomeScreen directly.');
}

if (!/<Stack\.Screen\s+name="home"\s+\/>/.test(rootLayoutSource)) {
  throw new Error('The root stack must register the /home redirect route so Home QA paths do not hit Unmatched Route.');
}

const qaHomeNavigationPaths = [
  { path: '/', routeModule: '../../app/(tabs)/index.tsx', expected: 'HomeScreen as default' },
  { path: '/(tabs)', routeModule: '../../app/(tabs)/_layout.tsx', expected: 'RootNativeTabs as default' },
  { path: '/(tabs)/index', routeModule: '../../app/(tabs)/index.tsx', expected: 'HomeScreen as default' },
  { path: '/home', routeModule: '../../app/home.tsx', expected: 'Redirect href="/"' },
] as const;

qaHomeNavigationPaths.forEach(({ path, routeModule, expected }) => {
  const routeSource = readFileSync(resolve(__dirname, routeModule), 'utf8');

  if (!routeSource.includes(expected)) {
    throw new Error(`Home QA path ${path} must resolve to ${expected}, not Unmatched Route.`);
  }
});

visibleRootTabs.forEach((tabName) => {
  const accessibilityRole = rootTabAccessibilityRoles[tabName];

  if (rootTabMinimumTouchTarget < 48) {
    throw new Error(
      `Bottom tab touch targets must be at least 48px. Found: ${rootTabMinimumTouchTarget}`
    );
  }

  if (tabName === 'source') {
    if (accessibilityRole !== 'button') {
      throw new Error('Paste opens the recipe creation drawer and must expose button semantics.');
    }
  } else if (accessibilityRole !== 'tab') {
    throw new Error(`${tabName} bottom nav item must expose tab accessibility semantics.`);
  }

  const iconNames = rootTabIconNames[tabName];

  if (!iconNames) {
    throw new Error(`${tabName} must have focused and unfocused bottom tab icons configured.`);
  }

  (['focused', 'unfocused'] as const).forEach((state) => {
    const iconName = iconNames[state];

    if (!(iconName in materialCommunityIconGlyphMap)) {
      throw new Error(
        `${tabName} ${state} icon "${iconName}" must exist in the bundled MaterialCommunityIcons glyph map.`
      );
    }
  });
});
