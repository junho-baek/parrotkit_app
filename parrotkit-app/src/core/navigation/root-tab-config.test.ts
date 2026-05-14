import { rootTabNames } from './root-tab-config';

const visibleRootTabs: readonly string[] = rootTabNames;
const visibleTabs = visibleRootTabs.join(',');

if (visibleTabs !== 'index,explore,my') {
  throw new Error(`Root bottom tabs must stay limited to Home, Explore, My. Found: ${visibleTabs}`);
}

if (visibleRootTabs.includes('source') || visibleRootTabs.includes('recipes')) {
  throw new Error('Source and Recipes must not be visible root bottom tabs.');
}
