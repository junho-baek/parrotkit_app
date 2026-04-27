# Context 2026-04-28 Native Quick Shoot Swipe Recipe

## Summary
- Added screen-level swipe navigation to native Quick Shoot.
- Right-to-left swipe moves Quick Shoot back to Home.
- Left-to-right swipe turns the current visible Quick Shoot cues into a new cut-by-cut recipe and opens its recipe detail.
- Added a mock workspace API for creating a recipe from `PrompterBlock[]`.
- Added behind-surface swipe panels so users can see `Make Recipe` or `Home` while dragging.

## Files
- `parrotkit-app/src/core/providers/mock-workspace-provider.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`
- `plans/20260428_native_quick_shoot_swipe_recipe.md`

## Verification
- `cd parrotkit-app && npx tsc --noEmit` passed.
- Relaunched the installed iPhone dev-client against `http://192.168.0.104:8081`.
- Metro bundled the iOS entry after relaunch.

## Notes
- Quick Shoot screen-level swipe is disabled while recording, reviewing a take, or saving a take.
- Generated Quick Shoot recipes use visible cue order as scene order.
- Existing untracked `.superpowers/` artifacts remain untouched.
