import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function ExploreScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.explore}
      description="A discovery tab placeholder for trend surfing, creator search, and feed experiments while the shell remains fully native."
      eyebrow="DISCOVERY"
      footerBody="Explore stays a true tab destination, while Source owns input and import actions through its own bottom-sheet flow."
      footerTitle="The tab bar is reserved for repeat destinations."
      highlights={[
        'Search and discovery remain in a stable native tab route',
        'Capture no longer competes with destination tabs for attention',
        'Later API-connected feeds can slot in without changing the root navigation model',
      ]}
      title="Explore"
    />
  );
}
