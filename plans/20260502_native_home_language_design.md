# Native Home Language Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the native Home screen around immediate recipe shooting on a white surface, and add English/Korean language selection in My settings.

**Architecture:** Keep the existing Expo Router native tabs and white app chrome. Add a small app-language provider for UI copy, then consume it from Home, My, native tabs, the top bar, and the global source CTA.

**Tech Stack:** Expo Router, React Native, NativeWind, TypeScript, expo-linear-gradient, MaterialCommunityIcons.

---

## 배경

- 첨부 시안은 현재 홈에서 핵심 행동까지의 진입 장벽, 정보 우선순위, 빠른 실행성, 레시피 탐색성, 촬영 흐름 맥락 부족을 지적한다.
- 사용자는 어두운 배경으로 전환하지 않고 기존 흰 배경과 하단 native tabs를 유지하길 원한다.
- 홈 UI는 `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`가 담당하고, My 화면은 `parrotkit-app/src/features/profile/screens/profile-screen.tsx`가 담당한다.
- 현재 원격에는 `origin/dev`가 없고 `origin/main`만 존재한다. 이번 작업은 현재 clone의 `main...origin/main` 기준에서 진행한다.

## 목표

- 홈 상단에 “이어하기” 카드와 촬영 계속하기 CTA를 배치해 가장 잦은 행동을 첫 화면에서 바로 수행하게 한다.
- 내 레시피 빠른 시작 가로 레일과 최근 레시피 리스트를 추가해 레시피 탐색을 보조 흐름으로 정리한다.
- 흰 배경, 기존 top bar, 하단 native tabs, global source CTA를 유지한다.
- My 탭에 앱 언어 설정을 추가하고 English/Korean UI copy를 전환한다.

## 범위

- Expo 네이티브 앱 `parrotkit-app/`만 변경한다.
- 실제 Supabase/서버 데이터 계약은 변경하지 않는다.
- 언어 설정은 앱 런타임 상태 기반으로 제공한다. 새 저장소 dependency는 추가하지 않는다.
- Quick Shoot camera/prompting/recording 구현은 변경하지 않는다.

## 변경 파일

- Create: `parrotkit-app/src/core/i18n/app-language.tsx`
  - 언어 타입, provider, `useAppLanguage`, 홈/프로필/내비게이션 copy dictionary를 제공한다.
- Modify: `parrotkit-app/src/app/_layout.tsx`
  - `AppLanguageProvider`를 앱 루트 provider 체인에 추가한다.
- Modify: `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
  - 하단 탭 label을 언어 설정에 맞게 표시하고 첫 탭 label을 Home/홈으로 조정한다.
- Modify: `parrotkit-app/src/core/navigation/app-top-bar.tsx`
  - 우측 알림 아이콘과 접근성 label을 추가한다.
- Modify: `parrotkit-app/src/core/navigation/global-source-cta.tsx`
  - floating source CTA label/accessibility copy를 언어 설정에 맞춘다.
- Modify: `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`
  - Home pager root 배경을 흰색으로 맞춘다.
- Modify: `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
  - 시안의 정보 구조를 흰 배경용 카드/레일/리스트로 재구성한다.
- Modify: `parrotkit-app/src/features/profile/screens/profile-screen.tsx`
  - My settings 언어 선택 segmented control을 추가한다.
- Modify: `plans/20260502_native_home_language_design.md`
  - 작업 결과와 연결 context 파일명을 기록한다.
- Create: `context/context_20260502_native_home_language_design.md`
  - 변경 요약과 검증 결과를 기록한다.

## 테스트

- `cd parrotkit-app && npx tsc --noEmit`
  - Expected: TypeScript type check passes.
- `cd parrotkit-app && npx expo config --type public >/tmp/parrotkit-expo-config.json`
  - Expected: Expo app config resolves without provider/import errors.
- Manual QA target:
  - Home keeps white background and bottom tabs.
  - Continue card appears before recipe shelves.
  - My > Settings language control switches Home/My/tab/source CTA copy between English and Korean.

## 롤백

- Remove `AppLanguageProvider` wrapping from `parrotkit-app/src/app/_layout.tsx`.
- Revert Home, My, native tab, top bar, source CTA edits.
- Delete `parrotkit-app/src/core/i18n/app-language.tsx`.
- Delete the new context file and remove the result section from this plan.

## 리스크

- Runtime-only language state resets on app restart because no persistent storage dependency is being added.
- Native tab label changes depend on Expo unstable native tabs updating labels when context state changes.
- Image-heavy recipe rails can expose remote image latency; current mock data already uses remote thumbnails, so this does not add a new network pattern.

## 작업

### Task 1: Add App Language Provider

**Files:**
- Create: `parrotkit-app/src/core/i18n/app-language.tsx`
- Modify: `parrotkit-app/src/app/_layout.tsx`

- [x] Step 1: Create `AppLanguageProvider` with `language`, `setLanguage`, and typed copy dictionaries for English/Korean.
- [x] Step 2: Wrap the existing app provider tree with `AppLanguageProvider`.
- [x] Step 3: Run `cd parrotkit-app && npx tsc --noEmit` and fix import/type errors.

### Task 2: Redesign Native Home

**Files:**
- Modify: `parrotkit-app/src/features/home/components/home-workspace-surface.tsx`
- Modify: `parrotkit-app/src/features/home/screens/home-quick-shoot-pager-screen.tsx`

- [x] Step 1: Replace the current “Shoot” hero with a welcome header, top-priority continue card, quick-start recipe rail, and recent recipe list.
- [x] Step 2: Keep the screen background white and use subtle borders/shadows instead of dark page chrome.
- [x] Step 3: Wire all static Home copy through `useAppLanguage`.
- [x] Step 4: Run `cd parrotkit-app && npx tsc --noEmit` and fix Home typing/layout errors.

### Task 3: Add My Language Setting

**Files:**
- Modify: `parrotkit-app/src/features/profile/screens/profile-screen.tsx`

- [x] Step 1: Add a Settings section below profile stats with English/Korean segmented buttons.
- [x] Step 2: Wire button state to `setLanguage('en')` and `setLanguage('ko')`.
- [x] Step 3: Translate static My screen labels through `useAppLanguage`.
- [x] Step 4: Run `cd parrotkit-app && npx tsc --noEmit` and fix profile typing/layout errors.

### Task 4: Localize App Chrome

**Files:**
- Modify: `parrotkit-app/src/core/navigation/root-native-tabs.tsx`
- Modify: `parrotkit-app/src/core/navigation/app-top-bar.tsx`
- Modify: `parrotkit-app/src/core/navigation/global-source-cta.tsx`

- [x] Step 1: Replace hard-coded native tab labels with localized labels.
- [x] Step 2: Add the top bar notification icon shown in the design reference while preserving the existing white/translucent top bar.
- [x] Step 3: Localize global source CTA label and accessibility text.
- [x] Step 4: Run `cd parrotkit-app && npx tsc --noEmit` and fix chrome typing errors.

### Task 5: Documentation And Final Verification

**Files:**
- Modify: `plans/20260502_native_home_language_design.md`
- Create: `context/context_20260502_native_home_language_design.md`

- [x] Step 1: Run `cd parrotkit-app && npx tsc --noEmit`.
- [x] Step 2: Run `cd parrotkit-app && npx expo config --type public >/tmp/parrotkit-expo-config.json`.
- [x] Step 3: Record final results in the plan and context file.
- [x] Step 4: Check `git status --short`.

## 결과

- `parrotkit-app/src/core/i18n/app-language.tsx`를 추가해 English/Korean UI copy와 `AppLanguageProvider`를 제공했다.
- Native Home을 흰 배경 기반의 welcome header, Continue card, quick-start horizontal rail, recent recipe list 구조로 재구성했다.
- My 화면 Settings 섹션에 English/Korean language segmented control을 추가했다.
- Native tabs, top bar accessibility, global source CTA label을 언어 설정에 맞게 연결했다.
- Home pager root 배경을 흰색으로 바꿔 홈 swipe/pager 표면에서 어두운 배경이 노출되지 않게 했다.

## 검증 결과

- `cd parrotkit-app && npx tsc --noEmit` 통과.
- `git diff --check` 통과.
- `cd parrotkit-app && npx expo config --type public >/tmp/parrotkit-expo-config.json` 통과.
- 연결 context: `context/context_20260502_native_home_language_design.md`
