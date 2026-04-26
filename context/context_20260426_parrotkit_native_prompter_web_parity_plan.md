# ParrotKit Native Prompter Web Parity Plan Context

## Date
2026-04-26

## Summary
Created a focused implementation plan for native prompter web parity after user feedback that the current native prompter is only display-only and lacks the web shooting features.

## Key Findings
- Web `CameraShooting` supports drag, edit, resize, add/hide, record, review, and use-take.
- Native `RecipePrompterCameraScreen` currently only shows static visible `PrompterBlock`s.
- Expo Camera exposes `record`, `stopRecording`, `mode="video"`, and microphone permission APIs.
- App currently lacks `expo-video`, so review playback needs that dependency.

## Plan
- Saved at `docs/superpowers/plans/2026-04-26-parrotkit-native-prompter-web-parity.md`.
