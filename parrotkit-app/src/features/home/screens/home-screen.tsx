import { FeaturePreviewScreen } from '@/core/ui/feature-preview-screen';
import { screenAccents } from '@/core/theme/colors';

export function HomeScreen() {
  return (
    <FeaturePreviewScreen
      accentColor={screenAccents.home}
      description="A native-first home tab for testing the real shell while keeping room for creator recaps, recent activity, and quick mobile actions."
      eyebrow="HOME"
      footerBody="Use the real platform tab bar below, and open Paste from the floating action so quick input stays lightweight instead of becoming a destination tab."
      footerTitle="This screen lives inside Expo Router native tabs."
      highlights={[
        'Native tab selection and icon rendering on iOS and Android',
        'Safe-area behavior at the bottom edge with a floating action overlay',
        'Good baseline for turning the home surface into a true mobile dashboard',
      ]}
      title="Parrotkit Home"
    />
  );
}
