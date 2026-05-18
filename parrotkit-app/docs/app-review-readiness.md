# App Review Readiness

This file tracks the minimum store-review foundation for ParrotKit.

## Product Positioning

- App name: ParrotKit
- Primary use: creator workflow for turning reference clips into shootable recipe boards and camera prompts.
- Review-safe explanation: users record their own videos, review takes locally in the app, and export chosen takes.

## Store Identity

- iOS bundle identifier: `com.parrotkit.app`
- Android package: `com.parrotkit.app`
- Deep link scheme: `parrotkit`
- Production build profile: `eas.json` `build.production`
- Internal QA build profile: `eas.json` `build.preview`

## Permission Copy

- Camera: used to record recipe takes with on-screen shooting cues.
- Microphone: used only when the user records video takes with audio.
- Photo library read: used when the user chooses videos from their library as takes or references.
- Photo library add: used when the user chooses to export selected takes.

## Privacy And Safety Declarations

- No tracking domains are declared in the iOS privacy manifest.
- Current local mock build does not declare collected data types.
- Before submitting a connected backend build, update Apple privacy details and Google Play Data safety if accounts, analytics, crash reporting, cloud sync, AI prompts, or media uploads are enabled.
- Add an accessible in-app privacy policy link before production submission.

## Review Checklist

- Add App Store Connect `ascAppId` to `eas.json` after the app record is created, or let EAS submit prompt for it.
- Confirm Apple Developer Team and Google Play package ownership.
- Prepare screenshots for recipe detail, cuts board, prompter camera, take review, and export.
- Verify camera, microphone, and media-library prompts on a physical iOS device and Android device.
- Confirm no demo-only, broken, or unreachable routes are present in production builds.
- Confirm all externally visible AI or creator-template claims avoid guaranteed performance or medical/health promises.
- Confirm sample media is licensed for app preview and store screenshots.
- Run `npx expo config --type public`, `npx tsc --noEmit`, and a production EAS build before submission.

## Metadata Draft

- Subtitle: Turn reference videos into shootable creator recipes.
- Short description: Plan UGC shots, follow camera prompts, and review takes in one creator workflow.
- Keywords: creator tools, UGC, video prompts, shot list, reels, short video, content planning.
