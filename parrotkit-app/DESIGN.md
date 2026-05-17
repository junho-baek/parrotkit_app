---
version: alpha
name: ParrotKit
description: Toss-like typographic clarity for a warm, creator-native recipe filming tool.
colors:
  primary: "#FF9568"
  secondary: "#DE81C1"
  tertiary: "#8C67FF"
  background: "#FFFFFF"
  surface: "#FFFFFF"
  sheet: "#FFFFFF"
  surfaceMuted: "#F8FAFC"
  border: "#E2E8F0"
  borderStrong: "#CBD5E1"
  text: "#111827"
  textMuted: "#64748B"
  textSubtle: "#94A3B8"
  brandPrimary: "#FF9568"
  brandPrimarySoft: "#FFF1EA"
  brandPink: "#DE81C1"
  brandPinkSoft: "#FBEAF5"
  brandViolet: "#8C67FF"
  brandVioletSoft: "#F1EBFF"
  success: "#0F766E"
  danger: "#E5484D"
typography:
  display:
    fontFamily: System
    fontSize: 32px
    fontWeight: 800
    lineHeight: 38px
    letterSpacing: "-0.03em"
  title-lg:
    fontFamily: System
    fontSize: 26px
    fontWeight: 800
    lineHeight: 32px
    letterSpacing: "-0.025em"
  title-md:
    fontFamily: System
    fontSize: 22px
    fontWeight: 800
    lineHeight: 28px
    letterSpacing: "-0.02em"
  section:
    fontFamily: System
    fontSize: 18px
    fontWeight: 800
    lineHeight: 24px
    letterSpacing: "-0.015em"
  body:
    fontFamily: System
    fontSize: 16px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: "-0.01em"
  body-muted:
    fontFamily: System
    fontSize: 15px
    fontWeight: 500
    lineHeight: 22px
    letterSpacing: "-0.01em"
  caption:
    fontFamily: System
    fontSize: 13px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: "-0.005em"
  label:
    fontFamily: System
    fontSize: 14px
    fontWeight: 700
    lineHeight: 18px
    letterSpacing: "-0.01em"
  button:
    fontFamily: System
    fontSize: 17px
    fontWeight: 800
    lineHeight: 22px
    letterSpacing: "-0.01em"
rounded:
  sm: 10px
  md: 16px
  lg: 24px
  xl: 32px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
components:
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 20px
  card-muted:
    backgroundColor: "{colors.surfaceMuted}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 20px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 16px
  drawer:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: 24px
  selected-card:
    backgroundColor: "{colors.brandPrimarySoft}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 16px
---

## Overview

ParrotKit should feel like a polished creator tool, not a workflow console. Typography carries the interface; containers support it, they do not shout over it.

The product language is creator-native and action-oriented. The app helps users continue, create, and keep their recipes/takes. It should not expose internal state-machine, persistence, agent, queue, acceptance-criteria, or backend-contract concepts as ordinary product UI.

All future application UI changes must check this file before implementation. When this document conflicts with an ad-hoc implementation idea, this document wins unless the product owner explicitly overrides it.

## Colors

ParrotKit is not purple-first. Its primary warmth comes from **coral / peach `#FF9568`**. The brand action gradient moves from coral to pink to violet:

- **Coral / peach (`#FF9568`)**: primary brand warmth, Home accent, selected states, approachable creation energy.
- **Pink (`#DE81C1`)**: creative middle energy, transition color, soft expressive accent.
- **Violet (`#8C67FF`)**: gradient tail, depth, glow, occasional high-energy highlight. Do not turn the app into a purple SaaS dashboard.

Use the full action gradient for primary CTAs and progress moments. Because the gradient begins with a light coral, CTA text must be checked on the actual rendered gradient. Use dark text on flat coral buttons, or add enough darkening/overlay when using white text.

```ts
['#ff9568', '#de81c1', '#8c67ff']
```

Use selected states primarily with coral border/background, not default violet everywhere:

- selected border: `#FF9568`
- selected soft fill: `#FFF1EA`
- selected icon/check: `#FF9568` or the full gradient when the component supports it

White surfaces, strong black text, and generous spacing should carry most screens. Avoid dark hero blocks unless they contain distinct media or a truly unique user-facing role.

## Typography

Use Toss-like typographic clarity:

- large, confident headings
- strong font weights
- short copy
- clear hierarchy
- minimal decoration
- high readability on mobile

System font is acceptable for React Native. If a custom font is introduced later, prefer a Pretendard-like variable sans that supports strong Korean and English weights.

Typography should reduce UI complexity. Do not add a label, heading, and description to every block by habit. If the button copy or card title already explains the action, extra labels are unnecessary.

Good:

- `레시피 생성`
- `마지막 레시피 이어가기`
- `레시피 보드 열기`
- `Beauty`, `Food`, `Other`

Avoid over-structured UI like:

- eyebrow label + heading + paragraph + helper text + badge for a simple action
- repeated labels that restate the button
- implementation copy disguised as explanation


## Simplicity Guardrails

These rules are mandatory for agents changing the UI:

- Do not create box-in-box layouts. A card may contain text, media, icons, and progress, but avoid nested bordered cards inside another bordered card unless the inner surface is actual media.
- Do not add redundant CTA buttons when the whole card already acts as the CTA. Prefer card press + chevron or clear title over multiple buttons.
- Avoid the word `workflow` in user-facing copy. Users continue recipes, boards, cuts, and takes.
- Avoid mechanical `label + heading + description` blocks. If the heading or button copy explains the action, remove the label/description.
- Prefer fewer, slightly smaller text sizes with strong weight over oversized headings everywhere. Toss-like means clear hierarchy, not giant text on every screen.
- Explore cards are content CTAs. Pressing the card opens detail; do not place multiple competing purple buttons inside the card.
- Recipe boards are pages, not drawers. They should show the board directly and keep only useful content: cut title, line to say, 촬영 가이드/shot guide, checklist/progress, and saved takes.

## Layout

Mobile screens should answer one user question at a time.

Home should answer:

1. What can I continue?
2. What can I create?
3. What did I save?

Rules:

- One primary action per screen section.
- Continue appears once near the top; do not duplicate it as a second lower hero.
- Creation entry should be obvious and should open the recipe creation drawer.
- Saved recipes and saved takes are user-owned content, not workflow records.
- Use bottom inset and safe-area padding so FABs, tab bars, and fixed CTAs do not cover content.

## Elevation & Depth

Use depth sparingly:

- cards: soft borders and white surfaces first
- drawers: dimmed backdrop + rounded top corners + drag handle
- primary CTA: gradient and weight, not heavy shadow
- violet shadow/glow: only as a subtle gradient tail, not the default brand language

## Shapes

ParrotKit should feel tactile and mobile-native:

- cards: 20–24px radius
- drawers: 28–32px top radius
- pills: fully rounded
- image cards: rounded and visual, not flat console rows

## Components

### Shooting board

The shooting board is a short-form filming session surface. It should feel like a creator execution tool, not a generic video player, workflow console, or checklist dashboard.

Session shell:

- A dark top session bar may be used when the board is in active shooting/planning mode.
- The dark bar owns session status: elapsed or estimated duration, cut progress, saved take count, and the `Done` / `완료` action.
- Keep the recipe/guide title in the white body header below the session bar. Do not duplicate the title as both a large dark-bar title and a large body title.
- The body header may show one lightweight note entry such as `오늘의 메모를 입력해보세요.` / `Add a shooting note.`

Note/checklist model:

- The note row is an entry point, not the checklist itself.
- Tapping the note row should open an inline expanded area, bottom sheet, or modal for today's note, prep checklist, brand reminders, and completion action.
- Do not show a full checklist directly under the board header by default.
- Checklist content belongs in the note/checklist surface or inside an expanded cut.

Short-form media:

- Reference and My Take media default to 9:16 vertical frames because ParrotKit is for short-form creation.
- Avoid 16:9 full-width players for cut references unless a source is truly landscape and the UI explicitly frames it as source review rather than shooting guidance.
- Collapsed cut rows should use compact 9:16 thumbnails or mini frames. Expanded cuts may use larger 9:16 Reference/My Take frames.

Cut naming and row hierarchy:

- Collapsed cut rows should read as execution items.
- Prefer user-readable execution names over internal structure labels. Good: `Open on the finished look`, `Show the proof close-up`, `Film the repeatable steps`, `End with the save line`.
- Avoid making `Hook`, `Proof`, `Demonstration`, or `CTA` the primary visible name. Those can remain internal structure or secondary metadata when needed.
- Keep `Cut #`, duration, and progress compact. Do not let them compete with the execution name.
- My Take owns take state. Count badges, final checks, and retake status should live inside or near the My Take frame, not as separate explanatory pills.
- Reorder handles should appear only in reorder mode.

Reference viewer and camera prompter:

- Reference viewer titles should use execution names, not structure labels. Avoid visible `Hook`, `Proof`, `CTA`, `Reference`, or `Cut #1: Hook` style headers when the current cut title already explains the action.
- Reference viewer cut navigation should be a compact rail. Use cut number/time for movement, not a second row of card titles.
- Camera prompter is an active filming surface. Avoid visible labels such as `READY`, `Scene 1`, `CARD PROMPT`, `FULL SCRIPT`, and `SHOOTING GUIDELINE` unless they reduce immediate recording uncertainty.
- Camera cut count must follow the shoot-board cut list. Added cuts count as real filming cuts.
- Prompter text size and opacity controls should feel like filming controls, not configuration labels. Prefer icons, compact sliders, and short mode names.

### Recipe creation drawer

Recipe creation must use the bottom drawer / modal sheet pattern. This is a carefully designed interaction and should not be flattened into a generic settings form.

The drawer is a guided creation chooser:

1. choose creation mode: Blank / Link / Brand
2. choose niche
3. choose goal
4. optionally type custom niche via Other
5. open the recipe board

The drawer should include:

- dimmed backdrop
- visible drag handle
- close affordance
- compact mode tabs
- tactile niche cards
- visual goal cards
- inline Other input when Other is selected
- one primary CTA

Reference Link and Brand Context may remain Pro/secondary/locked in v1. They should not launch unfinished API/upload/setup flows.

### Bottom navigation and creation entry

ParrotKit may use a custom app-style bottom navigation instead of the fully native tab primitive when the center creation action needs drawer behavior.

Preferred v1 bottom navigation model:

- `Home`
- `Explore`
- `Paste` as the larger center action
- `Recipes`
- `My`

`Paste` is not a generic plus button. It means: paste a short-form/reference link, use that reference as source material, then open the recipe creation drawer/flow. The center Paste action may be circular and visually larger than the neighboring tabs, but should still feel integrated with the bottom bar rather than like a random floating debug button.

If Paste is planned as a Pro feature, the current v1 interaction should still open a drawer/window that clearly shows the paste affordance. Do not dead-end the user on a generic locked screen; the product should make the Paste-to-recipe promise visible.

### CTA copy

Primary creation entry:

- English nav CTA: `Paste`
- Korean explanatory/action copy may still use `레시피 생성` when the context is recipe creation rather than link paste.
- English contextual copy may still use `Create recipe` in drawer/card contexts when no link paste is involved.

Recipe drawer CTA:

- Korean: `레시피 보드 열기`
- English: `Open recipe board`

Avoid as primary user-facing creation copy:

- `Shoot`
- `New Shoot`
- `Start Shoot`
- `Open shoot board`

Internal code/domain terms may still use shoot-board concepts where needed. The restriction is for user-facing copy.

### Labels, headings, and descriptions

Do not mechanically apply `label + heading + description` to every component. That pattern can make the mobile app feel like a dashboard or configuration console.

Use the smallest amount of text that makes the action clear:

- If a card title is already CTA-like, skip the eyebrow label.
- If the button explains the action, skip helper text.
- If a visual card is self-explanatory, use a short title only.
- Descriptions should earn their space by reducing user uncertainty.

## Do's and Don'ts

### Do

- Check this `DESIGN.md` before making UI changes.
- Preserve Toss-like typography: strong weight, clear hierarchy, short copy.
- Preserve the coral → pink → violet action gradient.
- Treat coral/peach as the primary warmth.
- Preserve the recipe creation bottom drawer.
- Use one clear primary CTA per area.
- Use product language over system language.
- Show user-owned recipes/takes as content.
- Use labels only when they clarify the action.

### Don't

- Do not make Home look like a workflow console.
- Do not expose internal implementation concepts in normal product UI.
- Do not duplicate the same primary CTA in multiple hero blocks.
- Do not replace the recipe creation drawer with a flat generic form.
- Do not turn the product into a purple SaaS dashboard.
- Do not overuse dark hero cards.
- Do not add labels/headings/descriptions mechanically.
- Do not use `Shoot`, `New Shoot`, or `Start Shoot` as primary creation CTAs.
