import { NativeTabScreen } from '../../src/components/native-tab-screen';

export default function RecipesScreen() {
  return (
    <NativeTabScreen
      title="Recipes"
      eyebrow="LIBRARY"
      description="A native recipes tab that can later host saved scripts, analysis results, and mobile-first editing flows."
      accentColor="#4f46e5"
      highlights={[
        'Persistent tab destination for saved recipe assets',
        'Natural placement for list-heavy content and detail pushes',
        'Compatible with nested stacks when recipe detail screens arrive',
      ]}
    />
  );
}
