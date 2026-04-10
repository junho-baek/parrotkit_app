import { NativeTabScreen } from '../../src/components/native-tab-screen';

export default function ExploreScreen() {
  return (
    <NativeTabScreen
      title="Explore"
      eyebrow="DISCOVERY"
      description="This tab stands in for creator discovery and trend surfing while keeping the navigation shell fully native."
      accentColor="#de81c1"
      highlights={[
        'Search/discovery destination in a true tab route',
        'Consistent native label and icon treatment',
        'Easy baseline for later API-connected feed work',
      ]}
    />
  );
}
