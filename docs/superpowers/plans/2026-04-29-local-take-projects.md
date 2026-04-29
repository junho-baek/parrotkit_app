# Local Take Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace automatic gallery saving with local take projects for recipe shooting and Quick Shoot, with best-take selection plus on-demand Gallery and Open in... export actions.

**Architecture:** Keep the existing mock workspace provider as the state boundary. Add focused take-project helpers, expose recipe-scene and quick-shoot take project APIs from the provider, and reuse one take tray/review UI across recipe shooting and Quick Shoot. To keep the current dev-client runnable, v1 uses the local `recordAsync()` URI as app-local storage and React Native's built-in `Share` API instead of adding new native modules.

**Tech Stack:** Expo Router, React Native, Expo Camera, Expo MediaLibrary, Expo Video, NativeWind, TypeScript.

---

## Scope Check

The spec includes one cohesive subsystem: local take management for both recipe shooting and Quick Shoot. It does not require backend storage, global library screens, native rebuilds, or cloud sync.

## File Structure

- Modify `parrotkit-app/src/core/mocks/parrotkit-data.ts`
  - Replace the single-take mock type with project take types.
- Create `parrotkit-app/src/features/recipes/lib/take-projects.ts`
  - Pure helpers for adding, deleting, selecting best, and marking export state.
- Create `parrotkit-app/src/features/recipes/lib/take-export.ts`
  - Gallery save and native share sheet helpers using existing dependencies.
- Modify `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
  - Own recipe-scene take projects and the active Quick Shoot take project.
- Modify `parrotkit-app/src/features/recipes/components/native-take-review.tsx`
  - Change review UI from gallery-first to local-first.
- Create `parrotkit-app/src/features/recipes/components/native-take-tray.tsx`
  - Shows takes, best state, and export/delete actions.
- Modify `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
  - Stop auto gallery save; keep takes locally; render scene take tray.
- Modify `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`
  - Stop auto gallery save; keep quick takes locally; render quick take tray.
- Create `plans/20260429_local_take_projects.md`
  - Repo-local AGENTS plan note.
- Create `context/context_20260429_local_take_projects.md`
  - Completion notes.

---

### Task 1: Repo Plan Note

**Files:**
- Create: `plans/20260429_local_take_projects.md`

- [ ] **Step 1: Create repo-local plan note**

Create `plans/20260429_local_take_projects.md`:

```md
# 20260429 Local Take Projects

## 배경
- 현재 native shooting flow는 녹화 직후 take를 갤러리에 자동 저장한다.
- UGC 촬영 도구로는 한 컷에 여러 take를 찍고 best만 고르는 흐름이 더 자연스럽다.
- v1은 서버 없이 앱 내부 local take project로 가볍게 구현한다.

## 목표
- Recipe shooting과 Quick Shoot 모두 take를 앱 내부 프로젝트에 먼저 저장한다.
- 각 scene/project에서 여러 take와 best take를 관리한다.
- 사용자가 선택한 take만 갤러리에 저장하거나 `Open in...`으로 외부 앱에 보낸다.

## 범위
- Mock workspace state, take helper, review/tray UI, recipe camera, quick shoot camera.
- 서버 저장, cloud sync, global take library, native rebuild가 필요한 새 모듈 추가는 제외한다.

## 변경 파일
- `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/features/recipes/lib/take-projects.ts`
- `parrotkit-app/src/features/recipes/lib/take-export.ts`
- `parrotkit-app/src/features/recipes/components/native-take-review.tsx`
- `parrotkit-app/src/features/recipes/components/native-take-tray.tsx`
- `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`
- `context/context_20260429_local_take_projects.md`

## 테스트
- `cd parrotkit-app && npx tsc --noEmit`
- Recipe shooting에서 녹화 후 `Keep`이 갤러리 저장 없이 local take를 추가하는지 확인한다.
- Scene별 take count와 best 선택을 확인한다.
- Quick Shoot에서 여러 take keep, best 선택, delete, gallery save, open share sheet를 확인한다.

## 롤백
- 새 take helper/tray/export 파일을 제거한다.
- provider를 단일 `MockRecordedTake` 상태로 되돌린다.
- camera screens를 기존 gallery-first review flow로 되돌린다.

## 리스크
- v1은 metadata를 mock React state에 저장하므로 앱 재시작 후 take 목록 영속성은 제한적이다.
- React Native Share sheet에서 CapCut 노출 여부는 iOS와 설치 앱 상태에 의존한다.
```

- [ ] **Step 2: Commit plan note**

Run:

```bash
git add plans/20260429_local_take_projects.md docs/superpowers/plans/2026-04-29-local-take-projects.md
git commit -m "docs: plan local take projects"
```

---

### Task 2: Take Types And Pure Helpers

**Files:**
- Modify: `parrotkit-app/src/core/mocks/parrotkit-data.ts`
- Create: `parrotkit-app/src/features/recipes/lib/take-projects.ts`

- [ ] **Step 1: Replace single take type with project take types**

In `parrotkit-app/src/core/mocks/parrotkit-data.ts`, replace:

```ts
export type MockRecordedTake = {
  uri: string;
  savedAt: string;
};
```

with:

```ts
export type MockTakeExportStatus = 'local' | 'gallery_saved' | 'shared';

export type MockProjectTake = {
  id: string;
  uri: string;
  createdAt: string;
  label: string;
  exportStatus: MockTakeExportStatus;
  exportedToGalleryAt?: string;
  sharedAt?: string;
};

export type MockSceneTakeCollection = {
  sceneId: string;
  bestTakeId?: string;
  takes: MockProjectTake[];
};

export type MockRecipeTakeProject = {
  id: string;
  recipeId: string;
  updatedAt: string;
  scenes: Record<string, MockSceneTakeCollection>;
};

export type MockQuickTakeProject = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  bestTakeId?: string;
  takes: MockProjectTake[];
};
```

- [ ] **Step 2: Create take helper module**

Create `parrotkit-app/src/features/recipes/lib/take-projects.ts`:

```ts
import type {
  MockProjectTake,
  MockQuickTakeProject,
  MockRecipeTakeProject,
  MockSceneTakeCollection,
} from '@/core/mocks/parrotkit-data';

type ExportKind = 'gallery' | 'share';

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function createProjectTake(uri: string, index: number): MockProjectTake {
  return {
    createdAt: 'Just now',
    exportStatus: 'local',
    id: `take-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    label: `Take ${index}`,
    uri,
  };
}

export function getSceneTakeCollection(
  project: MockRecipeTakeProject | undefined,
  sceneId: string
): MockSceneTakeCollection {
  return project?.scenes[sceneId] ?? { sceneId, takes: [] };
}

export function getBestTake(collection: MockSceneTakeCollection | { bestTakeId?: string; takes: MockProjectTake[] }) {
  return collection.takes.find((take) => take.id === collection.bestTakeId) ?? collection.takes[0] ?? null;
}

export function addSceneTake(
  project: MockRecipeTakeProject | undefined,
  recipeId: string,
  sceneId: string,
  uri: string
): MockRecipeTakeProject {
  const currentProject = project ?? {
    id: `take-project-${recipeId}`,
    recipeId,
    scenes: {},
    updatedAt: 'Just now',
  };
  const currentCollection = getSceneTakeCollection(currentProject, sceneId);
  const take = createProjectTake(uri, currentCollection.takes.length + 1);
  const nextCollection = {
    ...currentCollection,
    bestTakeId: currentCollection.bestTakeId ?? take.id,
    takes: [...currentCollection.takes, take],
  };

  return {
    ...currentProject,
    scenes: {
      ...currentProject.scenes,
      [sceneId]: nextCollection,
    },
    updatedAt: `Updated ${nowLabel()}`,
  };
}

export function removeSceneTake(
  project: MockRecipeTakeProject,
  sceneId: string,
  takeId: string
): MockRecipeTakeProject {
  const currentCollection = getSceneTakeCollection(project, sceneId);
  const nextTakes = currentCollection.takes.filter((take) => take.id !== takeId);
  const nextBestTakeId =
    currentCollection.bestTakeId === takeId ? nextTakes[nextTakes.length - 1]?.id : currentCollection.bestTakeId;

  return {
    ...project,
    scenes: {
      ...project.scenes,
      [sceneId]: {
        sceneId,
        bestTakeId: nextBestTakeId,
        takes: nextTakes,
      },
    },
    updatedAt: `Updated ${nowLabel()}`,
  };
}

export function setSceneBestTake(
  project: MockRecipeTakeProject,
  sceneId: string,
  takeId: string
): MockRecipeTakeProject {
  const currentCollection = getSceneTakeCollection(project, sceneId);

  return {
    ...project,
    scenes: {
      ...project.scenes,
      [sceneId]: {
        ...currentCollection,
        bestTakeId: takeId,
      },
    },
    updatedAt: `Updated ${nowLabel()}`,
  };
}

export function markSceneTakeExported(
  project: MockRecipeTakeProject,
  sceneId: string,
  takeId: string,
  exportKind: ExportKind
): MockRecipeTakeProject {
  const currentCollection = getSceneTakeCollection(project, sceneId);

  return {
    ...project,
    scenes: {
      ...project.scenes,
      [sceneId]: {
        ...currentCollection,
        takes: currentCollection.takes.map((take) =>
          take.id === takeId
            ? {
                ...take,
                exportStatus: exportKind === 'gallery' ? 'gallery_saved' : 'shared',
                ...(exportKind === 'gallery'
                  ? { exportedToGalleryAt: 'Saved to Gallery just now' }
                  : { sharedAt: 'Opened just now' }),
              }
            : take
        ),
      },
    },
    updatedAt: `Updated ${nowLabel()}`,
  };
}

export function createQuickTakeProject(): MockQuickTakeProject {
  return {
    createdAt: 'Just now',
    id: `quick-project-${Date.now().toString(36)}`,
    takes: [],
    title: 'Quick Shoot',
    updatedAt: 'Just now',
  };
}

export function addQuickTake(project: MockQuickTakeProject, uri: string): MockQuickTakeProject {
  const take = createProjectTake(uri, project.takes.length + 1);

  return {
    ...project,
    bestTakeId: project.bestTakeId ?? take.id,
    takes: [...project.takes, take],
    updatedAt: `Updated ${nowLabel()}`,
  };
}

export function removeQuickTake(project: MockQuickTakeProject, takeId: string): MockQuickTakeProject {
  const nextTakes = project.takes.filter((take) => take.id !== takeId);
  const nextBestTakeId = project.bestTakeId === takeId ? nextTakes[nextTakes.length - 1]?.id : project.bestTakeId;

  return {
    ...project,
    bestTakeId: nextBestTakeId,
    takes: nextTakes,
    updatedAt: `Updated ${nowLabel()}`,
  };
}

export function setQuickBestTake(project: MockQuickTakeProject, takeId: string): MockQuickTakeProject {
  return {
    ...project,
    bestTakeId: takeId,
    updatedAt: `Updated ${nowLabel()}`,
  };
}

export function markQuickTakeExported(
  project: MockQuickTakeProject,
  takeId: string,
  exportKind: ExportKind
): MockQuickTakeProject {
  return {
    ...project,
    takes: project.takes.map((take) =>
      take.id === takeId
        ? {
            ...take,
            exportStatus: exportKind === 'gallery' ? 'gallery_saved' : 'shared',
            ...(exportKind === 'gallery'
              ? { exportedToGalleryAt: 'Saved to Gallery just now' }
              : { sharedAt: 'Opened just now' }),
          }
        : take
    ),
    updatedAt: `Updated ${nowLabel()}`,
  };
}
```

- [ ] **Step 3: Verify types**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript fails until provider imports are updated in Task 3 because `MockRecordedTake` was removed.

- [ ] **Step 4: Commit helpers**

Run:

```bash
git add parrotkit-app/src/core/mocks/parrotkit-data.ts parrotkit-app/src/features/recipes/lib/take-projects.ts
git commit -m "feat: add local take project helpers"
```

---

### Task 3: Workspace Take Project API

**Files:**
- Modify: `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`

- [ ] **Step 1: Update imports and context type**

Replace `MockRecordedTake` import with `MockProjectTake`, `MockQuickTakeProject`, `MockRecipeTakeProject`, `MockSceneTakeCollection`.

Add helper imports:

```ts
import {
  addQuickTake,
  addSceneTake,
  createQuickTakeProject,
  getBestTake,
  getSceneTakeCollection as selectSceneTakeCollection,
  markQuickTakeExported,
  markSceneTakeExported,
  removeQuickTake,
  removeSceneTake,
  setQuickBestTake,
  setSceneBestTake,
} from '@/features/recipes/lib/take-projects';
```

In `MockWorkspaceContextValue`, replace the old recorded take methods with:

```ts
  quickTakeProject: MockQuickTakeProject;
  getSceneTakeCollection: (recipeId: string, sceneId: string) => MockSceneTakeCollection;
  getSceneBestTake: (recipeId: string, sceneId: string) => MockProjectTake | null;
  addSceneProjectTake: (recipeId: string, sceneId: string, uri: string) => MockProjectTake | null;
  deleteSceneProjectTake: (recipeId: string, sceneId: string, takeId: string) => void;
  setSceneBestProjectTake: (recipeId: string, sceneId: string, takeId: string) => void;
  markSceneProjectTakeGallerySaved: (recipeId: string, sceneId: string, takeId: string) => void;
  markSceneProjectTakeShared: (recipeId: string, sceneId: string, takeId: string) => void;
  addQuickProjectTake: (uri: string) => MockProjectTake | null;
  deleteQuickProjectTake: (takeId: string) => void;
  setQuickBestProjectTake: (takeId: string) => void;
  markQuickProjectTakeGallerySaved: (takeId: string) => void;
  markQuickProjectTakeShared: (takeId: string) => void;
```

- [ ] **Step 2: Replace recorded state**

Replace:

```ts
type RecordedTakeState = Record<string, Record<string, MockRecordedTake>>;
```

with:

```ts
type RecipeTakeProjectState = Record<string, MockRecipeTakeProject>;
```

Replace:

```ts
  const [recordedTakes, setRecordedTakes] = useState<RecordedTakeState>({});
```

with:

```ts
  const [recipeTakeProjects, setRecipeTakeProjects] = useState<RecipeTakeProjectState>({});
  const [quickTakeProject, setQuickTakeProject] = useState<MockQuickTakeProject>(() => createQuickTakeProject());
```

- [ ] **Step 3: Add recipe take API implementation**

Replace `getSceneRecordedTake`, `setSceneRecordedTake`, and `clearSceneRecordedTake` with:

```ts
  const getSceneTakeCollection = useCallback(
    (recipeId: string, sceneId: string) => selectSceneTakeCollection(recipeTakeProjects[recipeId], sceneId),
    [recipeTakeProjects]
  );

  const getSceneBestTake = useCallback(
    (recipeId: string, sceneId: string) => getBestTake(selectSceneTakeCollection(recipeTakeProjects[recipeId], sceneId)),
    [recipeTakeProjects]
  );

  const addSceneProjectTake = useCallback((recipeId: string, sceneId: string, uri: string) => {
    let addedTake: MockProjectTake | null = null;

    setRecipeTakeProjects((current) => {
      const nextProject = addSceneTake(current[recipeId], recipeId, sceneId, uri);
      const nextCollection = selectSceneTakeCollection(nextProject, sceneId);

      addedTake = nextCollection.takes[nextCollection.takes.length - 1] ?? null;

      return {
        ...current,
        [recipeId]: nextProject,
      };
    });

    return addedTake;
  }, []);

  const deleteSceneProjectTake = useCallback((recipeId: string, sceneId: string, takeId: string) => {
    setRecipeTakeProjects((current) => {
      const project = current[recipeId];
      if (!project) return current;

      return {
        ...current,
        [recipeId]: removeSceneTake(project, sceneId, takeId),
      };
    });
  }, []);

  const setSceneBestProjectTake = useCallback((recipeId: string, sceneId: string, takeId: string) => {
    setRecipeTakeProjects((current) => {
      const project = current[recipeId];
      if (!project) return current;

      return {
        ...current,
        [recipeId]: setSceneBestTake(project, sceneId, takeId),
      };
    });
  }, []);

  const markSceneProjectTakeGallerySaved = useCallback((recipeId: string, sceneId: string, takeId: string) => {
    setRecipeTakeProjects((current) => {
      const project = current[recipeId];
      if (!project) return current;

      return {
        ...current,
        [recipeId]: markSceneTakeExported(project, sceneId, takeId, 'gallery'),
      };
    });
  }, []);

  const markSceneProjectTakeShared = useCallback((recipeId: string, sceneId: string, takeId: string) => {
    setRecipeTakeProjects((current) => {
      const project = current[recipeId];
      if (!project) return current;

      return {
        ...current,
        [recipeId]: markSceneTakeExported(project, sceneId, takeId, 'share'),
      };
    });
  }, []);
```

- [ ] **Step 4: Add quick take API implementation**

Add after recipe take API:

```ts
  const addQuickProjectTake = useCallback((uri: string) => {
    let addedTake: MockProjectTake | null = null;

    setQuickTakeProject((current) => {
      const nextProject = addQuickTake(current, uri);

      addedTake = nextProject.takes[nextProject.takes.length - 1] ?? null;

      return nextProject;
    });

    return addedTake;
  }, []);

  const deleteQuickProjectTake = useCallback((takeId: string) => {
    setQuickTakeProject((current) => removeQuickTake(current, takeId));
  }, []);

  const setQuickBestProjectTake = useCallback((takeId: string) => {
    setQuickTakeProject((current) => setQuickBestTake(current, takeId));
  }, []);

  const markQuickProjectTakeGallerySaved = useCallback((takeId: string) => {
    setQuickTakeProject((current) => markQuickTakeExported(current, takeId, 'gallery'));
  }, []);

  const markQuickProjectTakeShared = useCallback((takeId: string) => {
    setQuickTakeProject((current) => markQuickTakeExported(current, takeId, 'share'));
  }, []);
```

- [ ] **Step 5: Add methods to provider value**

Add all new methods and `quickTakeProject` to the `value` object and dependency array. Remove the old recorded take methods.

- [ ] **Step 6: Verify provider compiles after camera screens still fail**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript may still fail in camera screens that call the removed recorded-take methods. Those are fixed in Tasks 5 and 6.

- [ ] **Step 7: Commit provider API**

Run:

```bash
git add parrotkit-app/src/core/providers/mock-workspace-provider.tsx
git commit -m "feat: expose local take project workspace"
```

---

### Task 4: Export Helper And Take Tray UI

**Files:**
- Create: `parrotkit-app/src/features/recipes/lib/take-export.ts`
- Modify: `parrotkit-app/src/features/recipes/components/native-take-review.tsx`
- Create: `parrotkit-app/src/features/recipes/components/native-take-tray.tsx`

- [ ] **Step 1: Create export helper**

Create `parrotkit-app/src/features/recipes/lib/take-export.ts`:

```ts
import * as MediaLibrary from 'expo-media-library';
import { Share } from 'react-native';

export type TakeExportResult = {
  message: string;
  status: 'saved' | 'shared' | 'denied' | 'failed';
};

export async function saveTakeToGallery(uri: string): Promise<TakeExportResult> {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync(true, ['video']);

    if (!permission.granted) {
      return { message: 'Gallery access needed', status: 'denied' };
    }

    await MediaLibrary.saveToLibraryAsync(uri);

    return { message: 'Saved to Gallery', status: 'saved' };
  } catch {
    return { message: 'Could not save to Gallery', status: 'failed' };
  }
}

export async function openTakeInShareSheet(uri: string): Promise<TakeExportResult> {
  try {
    await Share.share({
      title: 'Open take in...',
      url: uri,
    });

    return { message: 'Opened share sheet', status: 'shared' };
  } catch {
    return { message: 'Could not open share sheet', status: 'failed' };
  }
}
```

- [ ] **Step 2: Update review component props and copy**

In `native-take-review.tsx`, replace `NativeGallerySaveStatus` with:

```ts
export type NativeTakeReviewStatus = 'idle' | 'saving' | 'saved' | 'denied' | 'failed' | 'shared';
```

Change props:

```ts
type NativeTakeReviewProps = {
  status: NativeTakeReviewStatus;
  statusMessage?: string;
  uri: string;
  onRetry: () => void;
  onKeep: () => void;
  onSaveToGallery: () => void;
  onOpenIn: () => void;
  keepDisabled?: boolean;
};
```

Update button row to show three actions:

```tsx
<ReviewButton iconName="restart" label="Retry" onPress={onRetry} tone="secondary" />
<ReviewButton iconName="export-variant" label="Open in..." onPress={onOpenIn} tone="secondary" />
<ReviewButton disabled={keepDisabled} iconName="check" label="Keep" onPress={onKeep} tone="primary" />
```

Add a small gallery action under the row:

```tsx
<Pressable accessibilityRole="button" onPress={onSaveToGallery} style={styles.galleryAction}>
  <MaterialCommunityIcons color="#ffffff" name="image-multiple-outline" size={17} />
  <Text style={styles.galleryActionLabel}>Save to Gallery</Text>
</Pressable>
```

Update default status copy:
- `idle`: title `Take Recorded`, caption `Keep it in this project or export it.`
- `saving`: title `Saving`, caption `Exporting this take.`
- `saved`: title `Saved to Gallery`
- `shared`: title `Share Sheet Opened`
- `denied`: title `Gallery Access Needed`
- `failed`: title `Export Failed`

- [ ] **Step 3: Create take tray component**

Create `parrotkit-app/src/features/recipes/components/native-take-tray.tsx`:

```tsx
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { MockProjectTake } from '@/core/mocks/parrotkit-data';

type NativeTakeTrayProps = {
  bestTakeId?: string;
  onDelete: (takeId: string) => void;
  onOpenIn: (take: MockProjectTake) => void;
  onSaveToGallery: (take: MockProjectTake) => void;
  onSetBest: (takeId: string) => void;
  takes: MockProjectTake[];
};

export function NativeTakeTray({
  bestTakeId,
  onDelete,
  onOpenIn,
  onSaveToGallery,
  onSetBest,
  takes,
}: NativeTakeTrayProps) {
  if (!takes.length) {
    return null;
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{takes.length} {takes.length === 1 ? 'take' : 'takes'}</Text>
        <Text style={styles.caption}>{bestTakeId ? 'Best selected' : 'Pick a best'}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.list}>
          {takes.map((take) => {
            const best = take.id === bestTakeId;

            return (
              <View key={take.id} style={[styles.card, best && styles.bestCard]}>
                <View style={styles.cardTop}>
                  <Text style={styles.takeLabel}>{take.label}</Text>
                  {best ? <MaterialCommunityIcons color="#a78bfa" name="star" size={17} /> : null}
                </View>
                <Text style={styles.meta}>{take.exportedToGalleryAt ?? take.sharedAt ?? take.createdAt}</Text>

                <View style={styles.actions}>
                  <SmallAction iconName="star-outline" label="Best" onPress={() => onSetBest(take.id)} />
                  <SmallAction iconName="image-multiple-outline" label="Gallery" onPress={() => onSaveToGallery(take)} />
                  <SmallAction iconName="export-variant" label="Open" onPress={() => onOpenIn(take)} />
                  <SmallAction iconName="trash-can-outline" label="Delete" onPress={() => onDelete(take.id)} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function SmallAction({
  iconName,
  label,
  onPress,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" onPress={onPress} style={styles.smallAction}>
      <MaterialCommunityIcons color="#ffffff" name={iconName} size={15} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 7,
    marginTop: 10,
  },
  bestCard: {
    borderColor: 'rgba(167, 139, 250, 0.78)',
  },
  caption: {
    color: 'rgba(255, 255, 255, 0.52)',
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    width: 156,
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  list: {
    flexDirection: 'row',
    gap: 10,
  },
  meta: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  root: {
    marginBottom: 12,
  },
  smallAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  takeLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
});
```

- [ ] **Step 4: Verify components compile after screen updates still pending**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript may still fail until Task 5 updates screen props.

- [ ] **Step 5: Commit export and UI components**

Run:

```bash
git add parrotkit-app/src/features/recipes/lib/take-export.ts parrotkit-app/src/features/recipes/components/native-take-review.tsx parrotkit-app/src/features/recipes/components/native-take-tray.tsx
git commit -m "feat: add local take review and tray UI"
```

---

### Task 5: Recipe Shooting Local Take Flow

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx`

- [ ] **Step 1: Replace gallery-first imports and workspace API**

Remove `import * as MediaLibrary from 'expo-media-library';`.

Add:

```ts
import { NativeTakeTray } from '@/features/recipes/components/native-take-tray';
import { openTakeInShareSheet, saveTakeToGallery } from '@/features/recipes/lib/take-export';
```

From `useMockWorkspace`, replace `getSceneRecordedTake`, `setSceneRecordedTake` with:

```ts
    addSceneProjectTake,
    deleteSceneProjectTake,
    getSceneBestTake,
    getSceneTakeCollection,
    markSceneProjectTakeGallerySaved,
    markSceneProjectTakeShared,
    setSceneBestProjectTake,
```

- [ ] **Step 2: Replace gallery state names**

Replace:

```ts
  const [gallerySaveStatus, setGallerySaveStatus] = useState<NativeGallerySaveStatus>('idle');
  const [gallerySaveMessage, setGallerySaveMessage] = useState('');
  const [savingTake, setSavingTake] = useState(false);
  const gallerySaveRunRef = useRef(0);
  const gallerySavedUrisRef = useRef<Set<string>>(new Set());
```

with:

```ts
  const [takeReviewStatus, setTakeReviewStatus] = useState<NativeTakeReviewStatus>('idle');
  const [takeReviewMessage, setTakeReviewMessage] = useState('');
  const [keepingTake, setKeepingTake] = useState(false);
```

Import `NativeTakeReviewStatus` from `native-take-review`.

- [ ] **Step 3: Replace saved take selectors**

Replace:

```ts
  const savedTake = recipe && activeScene ? getSceneRecordedTake(recipe.id, activeScene.id) : null;
```

with:

```ts
  const takeCollection = recipe && activeScene ? getSceneTakeCollection(recipe.id, activeScene.id) : null;
  const bestTake = recipe && activeScene ? getSceneBestTake(recipe.id, activeScene.id) : null;
```

- [ ] **Step 4: Stop auto gallery save**

Remove the `saveTakeToNativeGallery` callback entirely.

In `handleRecordPress`, replace:

```ts
        setReviewUri(result.uri);
        void saveTakeToNativeGallery(result.uri);
```

with:

```ts
        setReviewUri(result.uri);
        setTakeReviewStatus('idle');
        setTakeReviewMessage('Keep it in this project or export it.');
```

- [ ] **Step 5: Add export callbacks**

Add callbacks:

```ts
  const handleSaveReviewToGallery = useCallback(async () => {
    if (!reviewUri) return;

    setTakeReviewStatus('saving');
    setTakeReviewMessage('Saving this take to Gallery.');
    const result = await saveTakeToGallery(reviewUri);

    setTakeReviewStatus(result.status === 'saved' ? 'saved' : result.status);
    setTakeReviewMessage(result.message);
  }, [reviewUri]);

  const handleOpenReviewIn = useCallback(async () => {
    if (!reviewUri) return;

    const result = await openTakeInShareSheet(reviewUri);

    setTakeReviewStatus(result.status === 'shared' ? 'shared' : result.status);
    setTakeReviewMessage(result.message);
  }, [reviewUri]);

  const handleSaveTakeToGallery = useCallback(async (take: MockProjectTake) => {
    if (!recipe || !activeScene) return;

    const result = await saveTakeToGallery(take.uri);
    setSaveMessage(result.message);

    if (result.status === 'saved') {
      markSceneProjectTakeGallerySaved(recipe.id, activeScene.id, take.id);
    }
  }, [activeScene, markSceneProjectTakeGallerySaved, recipe]);

  const handleOpenTakeIn = useCallback(async (take: MockProjectTake) => {
    if (!recipe || !activeScene) return;

    const result = await openTakeInShareSheet(take.uri);
    setSaveMessage(result.message);

    if (result.status === 'shared') {
      markSceneProjectTakeShared(recipe.id, activeScene.id, take.id);
    }
  }, [activeScene, markSceneProjectTakeShared, recipe]);
```

Import `MockProjectTake`.

- [ ] **Step 6: Replace Keep behavior**

Replace `handleUseTake` with:

```ts
  const handleKeepTake = useCallback(() => {
    if (!recipe || !activeScene || !reviewUri || keepingTake) return;

    setKeepingTake(true);

    try {
      const take = addSceneProjectTake(recipe.id, activeScene.id, reviewUri);

      setReviewUri(null);
      setTakeReviewStatus('idle');
      setTakeReviewMessage('');
      setSaveMessage(take ? `${take.label} kept in project` : 'Take kept in project');
    } finally {
      setKeepingTake(false);
    }
  }, [activeScene, addSceneProjectTake, keepingTake, recipe, reviewUri]);
```

- [ ] **Step 7: Render take tray and new review props**

Above `NativePrompterToolbar`, render:

```tsx
          {takeCollection ? (
            <NativeTakeTray
              bestTakeId={takeCollection.bestTakeId}
              onDelete={(takeId) => {
                if (!recipe || !activeScene) return;
                deleteSceneProjectTake(recipe.id, activeScene.id, takeId);
              }}
              onOpenIn={handleOpenTakeIn}
              onSaveToGallery={handleSaveTakeToGallery}
              onSetBest={(takeId) => {
                if (!recipe || !activeScene) return;
                setSceneBestProjectTake(recipe.id, activeScene.id, takeId);
              }}
              takes={takeCollection.takes}
            />
          ) : null}
```

Replace `NativeTakeReview` props with:

```tsx
          <NativeTakeReview
            keepDisabled={keepingTake}
            onKeep={handleKeepTake}
            onOpenIn={handleOpenReviewIn}
            onRetry={handleRetryReview}
            onSaveToGallery={handleSaveReviewToGallery}
            status={takeReviewStatus}
            statusMessage={takeReviewMessage}
            uri={reviewUri}
          />
```

- [ ] **Step 8: Update status label**

Replace:

```ts
  const statusLabel = saveMessage || savedTake?.savedAt || (!microphonePermission?.granted ? 'Mic off: muted recording' : '');
```

with:

```ts
  const statusLabel =
    saveMessage ||
    (takeCollection?.takes.length ? `${takeCollection.takes.length} takes saved` : '') ||
    bestTake?.createdAt ||
    (!microphonePermission?.granted ? 'Mic off: muted recording' : '');
```

- [ ] **Step 9: Verify recipe flow compiles**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: TypeScript may still fail in Quick Shoot until Task 6.

- [ ] **Step 10: Commit recipe flow**

Run:

```bash
git add parrotkit-app/src/features/recipes/screens/recipe-prompter-camera-screen.tsx
git commit -m "feat: keep recipe takes in local projects"
```

---

### Task 6: Quick Shoot Local Take Flow

**Files:**
- Modify: `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx`

- [ ] **Step 1: Replace imports and workspace API**

Remove `import * as MediaLibrary from 'expo-media-library';`.

Add:

```ts
import { useMockWorkspace } from '@/core/providers/mock-workspace-provider';
import type { MockProjectTake } from '@/core/mocks/parrotkit-data';
import { NativeTakeTray } from '@/features/recipes/components/native-take-tray';
import { openTakeInShareSheet, saveTakeToGallery } from '@/features/recipes/lib/take-export';
```

Inside `QuickShootCameraSurface`, add:

```ts
  const {
    addQuickProjectTake,
    deleteQuickProjectTake,
    markQuickProjectTakeGallerySaved,
    markQuickProjectTakeShared,
    quickTakeProject,
    setQuickBestProjectTake,
  } = useMockWorkspace();
```

- [ ] **Step 2: Replace gallery state**

Replace gallery status/message/saving refs with:

```ts
  const [takeReviewStatus, setTakeReviewStatus] = useState<NativeTakeReviewStatus>('idle');
  const [takeReviewMessage, setTakeReviewMessage] = useState('');
  const [keepingTake, setKeepingTake] = useState(false);
```

Import `NativeTakeReviewStatus`.

- [ ] **Step 3: Stop auto gallery save**

Remove `gallerySaveRunRef`, `gallerySavedUrisRef`, `resetGalleryReview`, and `saveTakeToNativeGallery`.

In `handleRecordPress`, replace:

```ts
        setReviewUri(result.uri);
        void saveTakeToNativeGallery(result.uri);
```

with:

```ts
        setReviewUri(result.uri);
        setTakeReviewStatus('idle');
        setTakeReviewMessage('Keep it in this quick project or export it.');
```

- [ ] **Step 4: Add keep/export callbacks**

Add:

```ts
  const handleKeepTake = useCallback(() => {
    if (!reviewUri || keepingTake) return;

    setKeepingTake(true);

    try {
      const take = addQuickProjectTake(reviewUri);

      setReviewUri(null);
      setTakeReviewStatus('idle');
      setTakeReviewMessage('');
      setSaveMessage(take ? `${take.label} kept in Quick Shoot` : 'Take kept in Quick Shoot');
    } finally {
      setKeepingTake(false);
    }
  }, [addQuickProjectTake, keepingTake, reviewUri]);

  const handleSaveReviewToGallery = useCallback(async () => {
    if (!reviewUri) return;

    setTakeReviewStatus('saving');
    setTakeReviewMessage('Saving this take to Gallery.');
    const result = await saveTakeToGallery(reviewUri);

    setTakeReviewStatus(result.status === 'saved' ? 'saved' : result.status);
    setTakeReviewMessage(result.message);
  }, [reviewUri]);

  const handleOpenReviewIn = useCallback(async () => {
    if (!reviewUri) return;

    const result = await openTakeInShareSheet(reviewUri);

    setTakeReviewStatus(result.status === 'shared' ? 'shared' : result.status);
    setTakeReviewMessage(result.message);
  }, [reviewUri]);

  const handleSaveTakeToGallery = useCallback(async (take: MockProjectTake) => {
    const result = await saveTakeToGallery(take.uri);
    setSaveMessage(result.message);

    if (result.status === 'saved') {
      markQuickProjectTakeGallerySaved(take.id);
    }
  }, [markQuickProjectTakeGallerySaved]);

  const handleOpenTakeIn = useCallback(async (take: MockProjectTake) => {
    const result = await openTakeInShareSheet(take.uri);
    setSaveMessage(result.message);

    if (result.status === 'shared') {
      markQuickProjectTakeShared(take.id);
    }
  }, [markQuickProjectTakeShared]);
```

- [ ] **Step 5: Render tray and review props**

Above `NativePrompterToolbar`, render:

```tsx
            <NativeTakeTray
              bestTakeId={quickTakeProject.bestTakeId}
              onDelete={deleteQuickProjectTake}
              onOpenIn={handleOpenTakeIn}
              onSaveToGallery={handleSaveTakeToGallery}
              onSetBest={setQuickBestProjectTake}
              takes={quickTakeProject.takes}
            />
```

Replace `NativeTakeReview` props with:

```tsx
          <NativeTakeReview
            keepDisabled={keepingTake}
            onKeep={handleKeepTake}
            onOpenIn={handleOpenReviewIn}
            onRetry={handleRetryReview}
            onSaveToGallery={handleSaveReviewToGallery}
            status={takeReviewStatus}
            statusMessage={takeReviewMessage}
            uri={reviewUri}
          />
```

- [ ] **Step 6: Update status label**

Replace current `statusLabel` with:

```ts
  const statusLabel =
    saveMessage ||
    (quickTakeProject.takes.length ? `${quickTakeProject.takes.length} quick takes saved` : '') ||
    (cameraActive && !microphonePermission?.granted ? 'Mic off: muted recording' : '');
```

- [ ] **Step 7: Verify full app compiles**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 8: Commit quick flow**

Run:

```bash
git add parrotkit-app/src/features/recipes/screens/quick-shoot-camera-surface.tsx
git commit -m "feat: keep quick shoot takes locally"
```

---

### Task 7: Context, QA, Push

**Files:**
- Create: `context/context_20260429_local_take_projects.md`
- Modify: `plans/20260429_local_take_projects.md`

- [ ] **Step 1: Create context**

Create `context/context_20260429_local_take_projects.md`:

```md
# 20260429 Local Take Projects

## 요약
- Recipe shooting과 Quick Shoot에서 녹화 직후 갤러리 자동 저장을 중단했다.
- 녹화된 take는 앱 내부 local take project에 먼저 보관한다.
- 각 scene/project는 여러 take와 best take를 가진다.
- 사용자는 선택한 take만 Gallery에 저장하거나 `Open in...`으로 외부 앱에 보낼 수 있다.

## 검증
- `cd parrotkit-app && npx tsc --noEmit` 통과.
- Metro 8081에서 iOS bundle reload를 확인했다.
- 실기기 수동 QA는 다음을 확인해야 한다: Recipe scene take 2개 keep, best 변경, Gallery save, Open in... share sheet, Quick Shoot take keep.

## 리스크
- v1 metadata는 mock provider state라 앱 재시작 후 take 목록은 유지되지 않는다.
- 외부 앱 목록은 iOS share sheet와 설치 앱 상태에 의존한다.
```

- [ ] **Step 2: Append result to repo plan**

Append to `plans/20260429_local_take_projects.md`:

```md

## 결과
- Local take project helper와 workspace API를 추가했다.
- Recipe shooting과 Quick Shoot 모두 `Keep` 우선 local take flow로 바꿨다.
- Gallery save와 Open in... export는 사용자가 선택한 take에서만 실행된다.
- 연결 context: `context/context_20260429_local_take_projects.md`
```

- [ ] **Step 3: Final verification**

Run:

```bash
cd parrotkit-app && npx tsc --noEmit
git diff --check HEAD
curl -s http://localhost:8081/status
```

Expected:
- `npx tsc --noEmit` exits 0.
- `git diff --check HEAD` exits 0.
- Metro prints `packager-status:running` if dev server is still running.

- [ ] **Step 4: Commit docs**

Run:

```bash
git add context/context_20260429_local_take_projects.md plans/20260429_local_take_projects.md
git commit -m "docs: record local take projects"
```

- [ ] **Step 5: Push main**

Run:

```bash
git status --short --branch
git push
```

Expected: `main` pushes to `parrotkit_app/main`.

---

## Self-Review

- Spec coverage: Recipe takes, Quick Shoot takes, best selection, Gallery export, Open in... export, delete, and local-only scope are covered.
- Placeholder scan: no TBD/TODO placeholders are used.
- Type consistency: Provider method names match screen task usage. `NativeTakeReviewStatus` replaces `NativeGallerySaveStatus` across both camera screens.

## Execution Result

- Implemented local take projects for recipe shooting and Quick Shoot.
- Kept the current dev-client runnable by using existing Expo MediaLibrary plus React Native Share, without adding native modules.
- Validation: `cd parrotkit-app && npx tsc --noEmit` passed and Metro 8081 returned `packager-status:running`.
- Linked context: `context/context_20260429_local_take_projects.md`.
