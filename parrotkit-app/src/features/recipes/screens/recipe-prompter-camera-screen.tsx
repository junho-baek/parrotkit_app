import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import { ShootingSceneSwitcher } from '@/features/recipes/components/shooting-scene-switcher';
import { getVisiblePrompterBlocks, normalizeNativeRecipe } from '@/features/recipes/lib/recipe-domain-normalizer';
import { PrompterBlock } from '@/features/recipes/types/recipe-domain';

export function RecipePrompterCameraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recipeId?: string; sceneId?: string }>();
  const { getRecipeById } = useMockWorkspace();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const rawRecipe = params.recipeId ? getRecipeById(params.recipeId) : null;
  const recipe = useMemo(() => (rawRecipe ? normalizeNativeRecipe(rawRecipe) : null), [rawRecipe]);
  const [activeSceneId, setActiveSceneId] = useState(params.sceneId ?? recipe?.scenes[0]?.id ?? '');

  useEffect(() => {
    if (!activeSceneId && recipe?.scenes[0]) {
      setActiveSceneId(recipe.scenes[0].id);
    }
  }, [activeSceneId, recipe]);

  useEffect(() => {
    if (params.sceneId) {
      setActiveSceneId(params.sceneId);
    }
  }, [params.sceneId]);

  const activeScene = useMemo(
    () => recipe?.scenes.find((scene) => scene.id === activeSceneId) ?? recipe?.scenes[0] ?? null,
    [activeSceneId, recipe]
  );
  const selectedBlocks = activeScene ? getVisiblePrompterBlocks(activeScene) : [];

  if (!recipe || !activeScene) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950 px-6">
        <Text className="text-[24px] font-black text-white">Prompter unavailable</Text>
        <Pressable className="mt-5 rounded-full border border-white/15 bg-white/10 px-5 py-3" onPress={() => router.back()}>
          <Text className="text-sm font-semibold text-white">Back</Text>
        </Pressable>
      </View>
    );
  }

  if (!permission) {
    return <View className="flex-1 bg-slate-950" />;
  }

  if (!permission.granted) {
    return <CameraPermissionGate onBack={() => router.back()} onRequest={requestPermission} />;
  }

  return (
    <View className="flex-1 bg-slate-950">
      <CameraView
        active
        animateShutter={false}
        facing={facing}
        mirror={facing === 'front'}
        style={styles.camera}
      />

      <LinearGradient
        colors={['rgba(2,6,23,0.72)', 'rgba(2,6,23,0)']}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        start={{ x: 0.5, y: 0 }}
        style={styles.topFade}
      />
      <LinearGradient
        colors={['rgba(2,6,23,0)', 'rgba(2,6,23,0.9)']}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
        start={{ x: 0.5, y: 0 }}
        style={styles.bottomFade}
      />

      <View className="flex-1 justify-between" style={styles.content}>
        <View className="px-4" style={{ paddingTop: insets.top + (Platform.OS === 'android' ? 14 : 6) }}>
          <View className="flex-row items-center justify-between">
            <OverlayIconButton accessibilityLabel="Go back" iconName="arrow-left" onPress={() => router.back()} />

            <View className="max-w-[230px] rounded-full border border-white/15 bg-black/35 px-3 py-1.5">
              <Text className="text-[12px] font-semibold text-white/85" numberOfLines={1}>
                {recipe.title}
              </Text>
            </View>

            <OverlayIconButton
              accessibilityLabel="Flip camera"
              iconName="camera-flip-outline"
              onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
            />
          </View>
        </View>

        <View pointerEvents="box-none" className="flex-1 justify-center px-4">
          <View className="self-center w-full max-w-[330px] gap-3">
            {selectedBlocks.length ? (
              selectedBlocks.map((block) => (
                <OverlayCueCard key={block.id} block={block} />
              ))
            ) : (
              <View className="rounded-[24px] border border-dashed border-white/20 bg-black/35 px-5 py-5">
                <Text className="text-sm font-medium leading-6 text-white/70">
                  Select cues in the Recipe tab before shooting.
                </Text>
              </View>
            )}
          </View>
        </View>

        <View
          className="rounded-t-[30px] border border-white/10 bg-slate-950/72 px-4 pt-4"
          style={{ paddingBottom: insets.bottom + (Platform.OS === 'android' ? 12 : 4) }}
        >
          <ShootingSceneSwitcher
            activeSceneId={activeScene.id}
            onSelectScene={setActiveSceneId}
            scenes={recipe.scenes}
          />
        </View>
      </View>
    </View>
  );
}

function CameraPermissionGate({
  onRequest,
  onBack,
}: {
  onRequest: () => void;
  onBack: () => void;
}) {
  return (
    <View className="flex-1 justify-center bg-slate-950 px-6">
      <View className="rounded-[32px] border border-white/10 bg-white/5 px-6 py-7">
        <Text className="text-[28px] font-black text-white">Camera access</Text>
        <Text className="mt-3 text-sm leading-6 text-white/70">
          Enable camera permission to open the native prompter view.
        </Text>

        <View className="mt-6 gap-3">
          <Pressable className="rounded-full bg-white px-5 py-3.5" onPress={onRequest}>
            <Text className="text-center text-sm font-bold text-slate-950">Allow camera</Text>
          </Pressable>

          <Pressable className="rounded-full border border-white/15 bg-white/5 px-5 py-3.5" onPress={onBack}>
            <Text className="text-center text-sm font-semibold text-white">Back to recipe</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function OverlayIconButton({
  iconName,
  onPress,
  accessibilityLabel,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      className="h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35"
      onPress={onPress}
    >
      <MaterialCommunityIcons color="#fff" name={iconName} size={20} />
    </Pressable>
  );
}

function OverlayCueCard({ block }: { block: PrompterBlock }) {
  const toneClass = block.type === 'key_line'
    ? 'border-[#ffb598]/60 bg-[#ff936b]/20'
    : 'border-[#c4b5fd]/60 bg-[#8b5cf6]/20';

  return (
    <View className={`rounded-[24px] border px-4 py-4 ${toneClass}`}>
      <Text className="text-[17px] font-semibold leading-6 text-white">{block.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  content: {
    zIndex: 2,
  },
  bottomFade: {
    bottom: 0,
    height: 320,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  topFade: {
    height: 180,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
});
