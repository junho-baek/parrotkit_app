import { NativeTabScreen } from '../../src/components/native-tab-screen';

export default function PasteScreen() {
  return (
    <NativeTabScreen
      title="Paste"
      eyebrow="INPUT"
      description="A dedicated native tab for URL paste and capture flows, ready to evolve into the mobile entry point for recipe creation."
      accentColor="#8c67ff"
      highlights={[
        'Separate action tab for quick input workflows',
        'Native selected-state feedback on platform tab bars',
        'Good base for adding clipboard or deep-link capture later',
      ]}
    />
  );
}
