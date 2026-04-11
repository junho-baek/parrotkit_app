import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import {
  getScenePrompterElements,
  getSelectedPrompterElements,
  type MockPrompterElement,
} from '@/features/recipes/lib/mock-prompter-elements';

export function RecipePrompterCameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ recipeId?: string; sceneId?: string }>();
  const { getPrompterSelection, getRecipeById, togglePrompterSelection } = useMockWorkspace();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const recipe = params.recipeId ? getRecipeById(params.recipeId) : null;
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

  const selectedIds = recipe && activeScene ? getPrompterSelection(recipe.id, activeScene) : [];
  const selectedElements = activeScene ? getSelectedPrompterElements(activeScene, selectedIds) : [];
  const sceneElements = activeScene ? getScenePrompterElements(activeScene) : [];

  if (!recipe || !activeScene) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950 px-6">
        <Text className="text-[24px] font-black text-white">Prompter unavailable</Text>
        <Text className="mt-2 text-center text-sm leading-6 text-white/65">
          Open this flow from a recipe detail screen.
        </Text>
        <Pressable
          className="mt-5 rounded-full border border-white/15 bg-white/10 px-5 py-3"
          onPress={() => router.back()}
        >
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
        style={StyleSheet.absoluteFill}
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

      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-between">
          <View className="px-4 pt-2">
            <View className="flex-row items-center justify-between">
              <OverlayIconButton
                accessibilityLabel="Go back"
                iconName="arrow-left"
                onPress={() => router.back()}
              />

              <View className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5">
                <Text className="text-[12px] font-semibold text-white/85">
                  {recipe.title}
                </Text>
              </View>

              <OverlayIconButton
                accessibilityLabel="Flip camera"
                iconName="camera-flip-outline"
                onPress={() => setFacing((current) => (current === 'back' ? 'front' : 'back'))}
              />
            </View>

            <View className="mt-4 self-start rounded-full border border-violet-300/35 bg-violet-400/20 px-3 py-1.5">
              <Text className="text-[11px] font-semibold uppercase tracking-[0.9px] text-white">
                {recipe.platform}
              </Text>
            </View>
          </View>

          <View pointerEvents="box-none" className="flex-1 justify-center px-4">
            <View className="self-center w-full max-w-[330px] gap-3">
              {selectedElements.length ? (
                selectedElements.map((element) => (
                  <OverlayCueCard key={element.id} element={element} />
                ))
              ) : (
                <View className="rounded-[24px] border border-dashed border-white/20 bg-black/35 px-5 py-5">
                  <Text className="text-sm font-medium leading-6 text-white/70">
                    Choose the lines you want to see on camera.
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="rounded-t-[30px] border border-white/10 bg-slate-950/72 px-4 pb-4 pt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2 pr-1">
                {recipe.scenes.map((scene, index) => {
                  const active = scene.id === activeScene.id;

                  return (
                    <Pressable
                      key={scene.id}
                      className={`rounded-full border px-4 py-2 ${
                        active ? 'border-violet-300 bg-violet-400/20' : 'border-white/10 bg-white/5'
                      }`}
                      onPress={() => setActiveSceneId(scene.id)}
                    >
                      <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-white/65'}`}>
                        Scene {index + 1}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <View className="mt-4 gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.8px] text-white/55">
                  Show On Camera
                </Text>
                <Text className="text-[12px] font-semibold text-white/75">{selectedElements.length} selected</Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {sceneElements.map((element) => {
                  const active = selectedIds.includes(element.id);

                  return (
                    <Pressable
                      key={element.id}
                      className={`rounded-full border px-3 py-2 ${
                        active ? 'border-white/25 bg-white/15' : 'border-white/10 bg-white/5'
                      }`}
                      onPress={() => togglePrompterSelection(recipe.id, activeScene, element.id)}
                    >
                      <View className="flex-row items-center gap-2">
                        <View
                          className={`h-2.5 w-2.5 rounded-full ${
                            active
                              ? element.kind === 'script'
                                ? 'bg-[#ff9a76]'
                                : 'bg-[#a78bfa]'
                              : 'bg-white/30'
                          }`}
                        />
                        <Text className={`text-[13px] font-medium ${active ? 'text-white' : 'text-white/60'}`}>
                          {element.label}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
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
          <Pressable
            className="rounded-full bg-white px-5 py-3.5"
            onPress={onRequest}
          >
            <Text className="text-center text-sm font-bold text-slate-950">Allow camera</Text>
          </Pressable>

          <Pressable
            className="rounded-full border border-white/15 bg-white/5 px-5 py-3.5"
            onPress={onBack}
          >
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

function OverlayCueCard({ element }: { element: MockPrompterElement }) {
  const toneClass = element.kind === 'script'
    ? 'border-[#ffb598]/60 bg-[#ff936b]/20'
    : 'border-[#c4b5fd]/60 bg-[#8b5cf6]/20';

  return (
    <View className={`rounded-[24px] border px-4 py-4 ${toneClass}`}>
      <Text className="text-[11px] font-semibold uppercase tracking-[0.8px] text-white/60">
        {element.kind === 'script' ? 'Script' : 'Cue'}
      </Text>
      <Text className="mt-1 text-[17px] font-semibold leading-6 text-white">{element.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomFade: {
    bottom: 0,
    height: 320,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  topFade: {
    height: 180,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
