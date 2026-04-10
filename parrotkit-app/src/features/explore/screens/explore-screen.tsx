import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function ExploreScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.explore}
      description="A discovery tab placeholder for trend surfing, creator search, and feed experiments while the shell remains fully native."
      eyebrow="DISCOVERY"
      footerBody="Explore stays a true tab destination, while quick capture is promoted into an action drawer so the bottom nav remains focused on persistent destinations."
      footerTitle="The tab bar is reserved for repeat destinations."
      highlights={[
        'Search and discovery remain in a stable native tab route',
        'The shared shell already supports fast overlay actions without extra tabs',
        'Later API-connected feeds can slot in without changing the root navigation model',
      ]}
      title="Explore"
    />
  );
}
