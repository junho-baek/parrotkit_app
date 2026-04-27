# Context 2026-04-27 Native Quick Shoot Home Swipe

## Summary
- Added a standalone native `Quick Shoot` mode for using the camera and prompter without a recipe.
- Added `/quick-shoot` as a root stack route with left-side horizontal navigation animation.
- Home now listens for a left-to-right swipe directly on the scroll view touch stream.
- The home surface translates right with the user's finger and reveals a dark `Quick Shoot` panel underneath before routing.
- Quick shoot uses local prompter cue state and reuses the native cue overlay, toolbar, record button, and gallery-saving review flow.

## Files
- `parrotkit-app/src/app/_layout.tsx`
- `parrotkit-app/src/app/quick-shoot.tsx`
- `parrotkit-app/src/features/home/screens/home-screen.tsx`
- `parrotkit-app/src/features/recipes/components/native-prompter-toolbar.tsx`
- `parrotkit-app/src/features/recipes/screens/quick-shoot-camera-screen.tsx`
- `plans/20260427_native_quick_shoot_home_swipe.md`

## Verification
- `cd parrotkit-app && npx tsc --noEmit` passed.
- Restarted Metro on `192.168.0.104:8081` with `--clear` because the running watcher did not initially pick up the new screen file.
- Relaunched the installed iPhone dev-client against the 8081 development URL through `xcrun devicectl`.
- Metro rebuilt successfully and bundled `node_modules/expo-router/entry.js` with 1516 modules.
- Re-ran `cd parrotkit-app && npx tsc --noEmit` after replacing threshold-only navigation with the animated swipe surface.
- Relaunched the installed iPhone dev-client again after the animated swipe update and Metro produced a fresh bundle.
- Reversed the swipe direction to left-to-right, re-ran `cd parrotkit-app && npx tsc --noEmit`, and relaunched the iPhone dev-client.
- Enlarged the native prompter `+` cue button and made the color palette collapsible with a palette toggle plus close button.

## Notes
- Quick shoot takes are not attached to recipe state; they save to the native gallery and then dismiss the review overlay.
- Existing untracked `.superpowers/` artifacts remain untouched.
