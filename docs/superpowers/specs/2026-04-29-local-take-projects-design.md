# Local Take Projects Design

## Goal
ParrotKit should keep recorded takes inside the app first, then let the creator choose which take to keep, mark as best, save to the native gallery, or open in another app such as CapCut through the iOS share sheet.

## Product Direction
The current recording flow saves videos to the native gallery too early. That makes every experiment leak into Photos and prevents a creator from treating one recipe as a small shooting project with multiple attempts per cut.

The v1 direction is local-only:
- No server upload.
- No account sync.
- No cloud storage.
- No automatic gallery save.
- Takes live in app-controlled local storage until the user exports them.

This keeps the product light, private, fast, and focused on the creator's shooting workflow.

## Scope
This spec covers both recipe shooting and Quick Shoot:
- Recipe shooting stores takes by `recipeId` and `sceneId`.
- Quick Shoot stores takes in a lightweight local quick project.
- Each scene or quick project can hold multiple takes.
- A creator can pick one best take.
- A creator can save a chosen take to the native gallery.
- A creator can open a chosen take in another compatible app through native sharing.

This spec does not cover:
- Supabase or S3 upload.
- Cross-device sync.
- Public take sharing.
- Video editing inside ParrotKit.
- Dedicated CapCut private URL schemes.
- Long-term storage cleanup policies beyond local delete actions.

## User Stories
1. As a creator shooting a recipe scene, I can record five takes for cut 1 without filling my camera roll.
2. As a creator, I can replay those takes inside ParrotKit and mark the strongest one as best.
3. As a creator, I can save only the chosen take to my iPhone gallery.
4. As a creator, I can send a chosen take to CapCut, TikTok, Instagram, Files, or another compatible app through the native share sheet.
5. As a creator using Quick Shoot, I can keep quick takes in the app and later turn the quick shoot into a recipe.

## Data Model
Introduce local take project types near the current mock workspace model.

```ts
export type MockTakeExportStatus = 'local' | 'gallery_saved' | 'shared';

export type MockProjectTake = {
  id: string;
  uri: string;
  createdAt: string;
  durationMs?: number;
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

The existing `MockRecordedTake` single-take type should be replaced or wrapped by the new project model. Existing UI that only needs "does this scene have a chosen take?" can read the best take from the scene collection.

## Storage Behavior
When `CameraView.recordAsync()` returns a local `uri`, ParrotKit should not immediately call `MediaLibrary.saveToLibraryAsync`.

Instead:
1. The review overlay receives the recorded `uri`.
2. The creator taps `Keep`.
3. The app adds a `MockProjectTake` to the active recipe scene or Quick Shoot project.
4. The original local file URI remains the source of truth for v1.
5. `Save to Gallery` exports that selected take through `MediaLibrary.saveToLibraryAsync(uri)`.
6. `Open in...` calls `Sharing.shareAsync(uri, { UTI: 'public.movie' })` on iOS when sharing is available.

This uses two Expo APIs:
- `expo-media-library` for native gallery export.
- `expo-sharing` for the native share sheet and compatible external apps.

## Recipe Shooting UX
The recipe prompter camera should become scene-project aware.

After recording:
- Show the video preview.
- Primary button: `Keep`
- Secondary button: `Retry`
- More/export action: `Save to Gallery` and `Open in...`

After keeping a take:
- The active scene shows a take count such as `3 takes`.
- If no best exists, the kept take becomes best by default.
- If a best already exists, the new take is stored but does not replace the best automatically.
- A scene take tray can show all takes for that scene.

Scene take tray actions:
- `Set Best`
- `Save to Gallery`
- `Open in...`
- `Delete`

The prompter status should prefer:
- `Best take selected`
- `3 takes saved`
- export messages such as `Saved to Gallery`

## Quick Shoot UX
Quick Shoot should also store takes locally.

After recording:
- `Keep` stores the take in the active Quick Shoot project.
- `Retry` discards the review URI and returns to camera.
- `Save to Gallery` exports the take without making it the only saved version.
- `Open in...` opens the share sheet.

Quick Shoot keeps one active local project in v1:
- It starts when the Quick Shoot screen opens.
- It stores all kept quick takes until the app session resets.
- When the creator swipes to make a recipe, the current quick cues become recipe scenes and the best quick take can be attached as a project-level take reference in the future.

For v1 implementation, Quick Shoot does not need a full global library screen. It only needs local take count, best selection, export, and delete inside the Quick Shoot surface.

## Export Semantics
`Save to Gallery`:
- Requests write-only Photos permission when needed.
- Calls `MediaLibrary.saveToLibraryAsync(uri)`.
- Marks the take with `exportStatus: 'gallery_saved'` and `exportedToGalleryAt`.
- Does not duplicate the take in the app.

`Open in...`:
- Checks `Sharing.isAvailableAsync()`.
- Calls `Sharing.shareAsync(uri, { UTI: 'public.movie', dialogTitle: 'Open take in...' })`.
- Marks `sharedAt` if the call resolves.
- The UI should say `Open in...` instead of `Open in CapCut`, because CapCut availability is controlled by iOS and installed apps.

## Error Handling
- If gallery permission is denied, keep the take local and show `Gallery access needed`.
- If gallery save fails, keep the take local and show `Could not save to Gallery`.
- If native sharing is unavailable, show `Sharing is not available on this device`.
- If sharing fails or is cancelled, keep the take local and leave export status unchanged.
- If a take is deleted, remove it from local project state. If it was best, select the newest remaining take as best; if no takes remain, clear `bestTakeId`.

## Testing
Minimum verification:
- TypeScript passes with `cd parrotkit-app && npx tsc --noEmit`.
- Recipe camera recording no longer auto-saves to Photos.
- Recipe scene can keep multiple takes.
- Scene best take can be changed.
- Kept take can be saved to gallery on demand.
- Kept take can open native share sheet.
- Quick Shoot can keep multiple local takes.
- Quick Shoot export actions use the same gallery/share helpers.

Manual QA on iPhone:
- Record two recipe scene takes, keep both, mark the second as best, save only the best to Photos.
- Record one Quick Shoot take, keep it, open share sheet, cancel, then confirm the take still remains local.

## Implementation Boundaries
The implementation should prefer small helpers over growing the camera screens further:
- A focused take-project helper for adding, deleting, and selecting best takes.
- A shared export helper for `MediaLibrary` and `Sharing`.
- A reusable take tray component for listing local takes and actions.

The camera screens should orchestrate state and route behavior, not contain all take-project logic inline.
