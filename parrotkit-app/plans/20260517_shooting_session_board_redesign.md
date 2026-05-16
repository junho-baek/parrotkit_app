# Shooting Session Board Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the recipe shooting board as a short-form filming session surface with a dark session bar, 9:16 reference/take media, note entry flow, and execution-first cut rows.

**Architecture:** Keep the recipe detail screen as the owning container, but split the shooting board shell into smaller components: session header, body header/note entry, and cut execution rows. Add source-contract tests first so future UI regressions fail before screenshot QA.

**Tech Stack:** Expo Router, React Native, NativeWind className styling, `StyleSheet`, `react-native-draggable-flatlist`, `sucrase-node` source-contract tests, TypeScript.

---

## 배경

최근 #10 촬영 보드 정리에서 레퍼런스 영상을 컷 상단으로 옮기고 `No take yet`, `0 takes`, `Take saved` 같은 중복 상태 라벨을 제거했다. 이후 레퍼런스 UI 리뷰에서 더 큰 제품 기준이 확정되었다.

- ParrotKit은 숏폼 제작 도구이므로 reference / My Take는 16:9가 아니라 9:16 기본값이어야 한다.
- 촬영 보드는 일반 페이지 헤더보다 활성 촬영 세션에 가까우므로 상단 검정 세션바가 어울린다.
- `완료`는 본문 리스트의 reorder 완료가 아니라 세션 상단바의 주요 종료 액션으로 보여야 한다.
- 레시피/가이드 이름은 상단바보다 본문 헤더에서 크게 읽히는 편이 좋다.
- `오늘의 메모를 입력해보세요.`는 바로 체크리스트를 노출하는 영역이 아니라 note/checklist surface로 들어가는 진입점이어야 한다.
- 컷의 1차 이름은 `Hook`, `Proof`, `CTA` 같은 구조 라벨보다 사용자가 바로 실행할 수 있는 이름이어야 한다.

## 목표

- `DESIGN.md`의 shooting board 기준을 실제 구현 계약으로 반영한다.
- 촬영 보드 최상단에 검정 세션바를 추가하고 `완료`를 배치한다.
- 본문 헤더에 레시피/가이드 제목과 note entry row를 배치한다.
- note row tap으로 오늘 메모와 체크리스트 surface를 열 수 있게 만든다.
- reference / My Take media frame을 9:16으로 정렬한다.
- collapsed cut row를 실행 항목처럼 보이게 정리하고, primary name에서 `Hook`, `Proof`, `Demonstration`, `CTA`를 내린다.
- reorder handle은 reorder mode에서만 노출한다.

## 범위

- Recipe detail shooting-board tab/screen only.
- `src/features/recipes/components/*shoot-board*` 컴포넌트.
- `src/features/recipes/lib/*cut-card*` view-model helper.
- Source-contract tests and targeted TypeScript verification.
- Android/iPhone simulator screenshot QA.

범위 밖:

- 레퍼런스 비디오 실제 재생 엔진 교체.
- 서버 persistence / Supabase schema 변경.
- Explore detail landing UI 전면 재설계.
- 배포 환경 QA 리포트 업로드.

## 변경 파일

- Modify: `src/features/recipes/screens/recipe-detail-screen.tsx`
- Create: `src/features/recipes/components/shoot-board-session-header.tsx`
- Create: `src/features/recipes/components/shoot-board-body-header.tsx`
- Rename or replace: `src/features/recipes/components/shoot-board-note-cta.tsx`
- Modify: `src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify: `src/features/recipes/components/shoot-board-media-slot.tsx`
- Modify: `src/features/recipes/components/shoot-board-sticky-header.tsx`
- Modify: `src/features/recipes/lib/cut-card-header.ts`
- Create: `src/features/recipes/lib/cut-card-execution-title.ts`
- Test: `src/features/recipes/screens/recipe-detail/recipe-detail-board-session-contract.test.ts`
- Test: `src/features/recipes/components/shoot-board-note-entry-contract.test.ts`
- Test: `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- Test: `src/features/recipes/lib/cut-card-execution-title.test.ts`
- Update: `context/context_YYYYMMDD_shooting_session_board_redesign.md`

## 테스트

- `./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-execution-title.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-note-entry-contract.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`
- `./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-session-contract.test.ts`
- `./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json`
- `npm run check:architecture`
- `npx -y @google/design.md lint DESIGN.md`
- `git diff --check`
- Android and iPhone simulator screenshots for the shooting board.

`npm run build`는 사용자가 명시적으로 요청하거나 배포 직전 점검이 필요할 때만 실행한다.

## 롤백

최종 커밋을 revert하면 기존 #10 정리 상태로 돌아간다. 구현 중에는 session header, note entry, 9:16 media, execution title 변경을 각각 독립 커밋으로 쪼개서 특정 축만 되돌릴 수 있게 유지한다.

## 리스크

- 검정 세션바가 기존 recipe detail hero/detail tab과 충돌할 수 있다. `tab=shoot` 상태에서만 적용하고 analysis/recipe tab은 건드리지 않는다.
- note entry를 bottom sheet로 만들 경우 keyboard inset과 Android height가 불안정할 수 있다. v1은 inline expansion으로 시작하고, 별도 QA에서 modal/sheet가 필요하면 교체한다.
- 9:16 frame이 collapsed row height를 키울 수 있다. collapsed row는 thumbnail-size 9:16, expanded row는 larger 9:16 pair로 분리한다.
- `Hook` 같은 role label을 완전히 제거하면 내부 구조 파악이 어려울 수 있다. primary title에서는 제거하고, expanded metadata 또는 internal helper에만 남긴다.

---

## Task 1: DESIGN.md Contract

**Files:**
- Modify: `DESIGN.md`

- [ ] **Step 1: Add the shooting-board design contract**

Add `### Shooting board` under `## Components` with this contract:

```markdown
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
```

- [ ] **Step 2: Run design lint**

Run:

```bash
npx -y @google/design.md lint DESIGN.md
```

Expected:

```text
0 errors
```

Existing unused-token warnings are acceptable if no new errors are introduced.

---

## Task 2: Session Header Contract Test

**Files:**
- Create: `src/features/recipes/screens/recipe-detail/recipe-detail-board-session-contract.test.ts`
- Modify: `src/features/recipes/screens/recipe-detail-screen.tsx`
- Create: `src/features/recipes/components/shoot-board-session-header.tsx`

- [ ] **Step 1: Write the failing source-contract test**

```ts
import { readFileSync } from "fs";
import { join } from "path";

const screenSource = readFileSync(
  join(__dirname, "../recipe-detail-screen.tsx"),
  "utf8",
);

const headerSource = readFileSync(
  join(__dirname, "../../components/shoot-board-session-header.tsx"),
  "utf8",
);

if (!screenSource.includes("ShootBoardSessionHeader")) {
  throw new Error("Shooting board must render ShootBoardSessionHeader.");
}

if (!headerSource.includes("backgroundColor: \"#0B0F14\"")) {
  throw new Error("Session header should use the dark active-session bar.");
}

if (!headerSource.includes("copy.done")) {
  throw new Error("Session header must own the Done / 완료 action.");
}

if (headerSource.includes("board.title")) {
  throw new Error("Session header should not duplicate the recipe title.");
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-session-contract.test.ts
```

Expected: fail because `shoot-board-session-header.tsx` does not exist yet.

- [ ] **Step 3: Create `ShootBoardSessionHeader`**

```tsx
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardRecipe } from "@/features/recipes/lib/shoot-board-model";

type Copy = {
  back: string;
  done: string;
  more: string;
};

export function ShootBoardSessionHeader({
  board,
  copy,
  language,
  onBack,
  onDone,
  onMore,
  topInset,
}: {
  board: ShootBoardRecipe;
  copy: Copy;
  language: AppLanguage;
  onBack: () => void;
  onDone: () => void;
  onMore: () => void;
  topInset: number;
}) {
  const totalCuts = board.cuts.length;
  const completedCuts = board.cuts.filter((cut) => cut.takes.length > 0).length;
  const takeCount = board.cuts.reduce((sum, cut) => sum + cut.takes.length, 0);
  const durationSeconds = board.cuts.reduce(
    (sum, cut) => sum + cut.durationSeconds,
    0,
  );

  return (
    <View style={[styles.shell, { paddingTop: topInset + 12 }]}>
      <View style={styles.navRow}>
        <Pressable accessibilityLabel={copy.back} accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
          <MaterialCommunityIcons color="#ffffff" name="chevron-down" size={25} />
        </Pressable>
        <Pressable accessibilityLabel={copy.more} accessibilityRole="button" onPress={onMore} style={styles.iconButton}>
          <MaterialCommunityIcons color="#ffffff" name="dots-horizontal" size={24} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onDone} style={styles.doneButton}>
          <Text style={styles.doneText}>{copy.done}</Text>
        </Pressable>
      </View>
      <View style={styles.statsRow}>
        <SessionStat label={language === "ko" ? "컷" : "Cuts"} value={`${completedCuts}/${totalCuts}`} />
        <SessionStat label={language === "ko" ? "테이크" : "Takes"} value={String(takeCount)} />
        <SessionStat label={language === "ko" ? "길이" : "Length"} value={formatDuration(durationSeconds, language)} />
      </View>
    </View>
  );
}

function SessionStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function formatDuration(seconds: number, language: AppLanguage) {
  if (seconds < 60) return language === "ko" ? `${seconds}초` : `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return remaining === 0 ? `${minutes}:00` : `${minutes}:${String(remaining).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  doneButton: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: 8,
  },
  doneText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  iconButton: {
    alignItems: "center",
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  navRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  shell: {
    backgroundColor: "#0B0F14",
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  stat: {
    flex: 1,
    gap: 2,
  },
  statLabel: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
  },
  statValue: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 0,
  },
  statsRow: {
    flexDirection: "row",
    gap: 18,
    paddingTop: 18,
  },
});
```

- [ ] **Step 4: Wire the header into the screen**

Replace `CutBoardHeader` usage in `RecipeDetailScreen`:

```tsx
<ShootBoardSessionHeader
  board={renderedShootBoard}
  copy={boardCopy}
  language={language}
  onBack={handleBack}
  onDone={handleBack}
  onMore={() => setReorderMode((current) => !current)}
  topInset={insets.top}
/>
```

Then remove the old local `CutBoardHeader` function and unused header styles from `recipe-detail-screen.tsx`.

- [ ] **Step 5: Run the test and commit**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-session-contract.test.ts
```

Expected: PASS.

Commit:

```bash
git add src/features/recipes/screens/recipe-detail-screen.tsx src/features/recipes/components/shoot-board-session-header.tsx src/features/recipes/screens/recipe-detail/recipe-detail-board-session-contract.test.ts
git commit -m "feat: add shooting board session header"
```

---

## Task 3: Body Header and Note Entry Surface

**Files:**
- Create: `src/features/recipes/components/shoot-board-body-header.tsx`
- Rename or replace: `src/features/recipes/components/shoot-board-note-cta.tsx`
- Modify: `src/features/recipes/screens/recipe-detail-screen.tsx`
- Test: `src/features/recipes/components/shoot-board-note-entry-contract.test.ts`

- [ ] **Step 1: Write the failing source-contract test**

```ts
import { readFileSync } from "fs";
import { join } from "path";

const screenSource = readFileSync(
  join(__dirname, "../screens/recipe-detail-screen.tsx"),
  "utf8",
);

const bodyHeaderSource = readFileSync(
  join(__dirname, "shoot-board-body-header.tsx"),
  "utf8",
);

const noteSource = readFileSync(join(__dirname, "shoot-board-note-cta.tsx"), "utf8");

if (!screenSource.includes("ShootBoardBodyHeader")) {
  throw new Error("Recipe detail must render ShootBoardBodyHeader above the cut list.");
}

if (!bodyHeaderSource.includes("board.title")) {
  throw new Error("Body header must own the recipe title.");
}

if (!noteSource.includes("expanded")) {
  throw new Error("Note entry must support collapsed and expanded states.");
}

if (noteSource.includes("accessibilityRole=\"checkbox\"") && !noteSource.includes("expanded")) {
  throw new Error("Checklist controls should not be the default collapsed note row.");
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-note-entry-contract.test.ts
```

Expected: fail because `ShootBoardBodyHeader` does not exist yet.

- [ ] **Step 3: Add body header**

```tsx
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardRecipe } from "@/features/recipes/lib/shoot-board-model";

export function ShootBoardBodyHeader({
  board,
  language,
  onOpenNote,
}: {
  board: ShootBoardRecipe;
  language: AppLanguage;
  onOpenNote: () => void;
}) {
  const hasNote = Boolean(board.boardNote?.trim());

  return (
    <View style={styles.shell}>
      <Text numberOfLines={2} style={styles.title}>
        {board.title}
      </Text>
      <Pressable accessibilityRole="button" onPress={onOpenNote} style={styles.noteRow}>
        <MaterialCommunityIcons color="#94a3b8" name="pencil-outline" size={18} />
        <Text numberOfLines={1} style={[styles.noteText, hasNote && styles.noteTextFilled]}>
          {hasNote
            ? board.boardNote
            : language === "ko"
              ? "오늘의 메모를 입력해보세요."
              : "Add today's shooting note."}
        </Text>
        <MaterialCommunityIcons color="#94a3b8" name="chevron-right" size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  noteRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 34,
  },
  noteText: {
    color: "#94a3b8",
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0,
  },
  noteTextFilled: {
    color: "#64748b",
  },
  shell: {
    backgroundColor: "#ffffff",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
  },
  title: {
    color: "#111827",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 31,
  },
});
```

- [ ] **Step 4: Convert note CTA into expandable surface**

Keep the file name for a smaller diff, but change its contract:

```tsx
export function ShootBoardNoteCta({
  checked,
  expanded,
  language,
  onChangeText,
  onClose,
  onToggleChecked,
  value,
}: {
  checked: boolean;
  expanded: boolean;
  language: AppLanguage;
  onChangeText: (value: string) => void;
  onClose: () => void;
  onToggleChecked: () => void;
  value: string;
}) {
  if (!expanded) return null;

  return (
    <View className="mx-5 mb-3 border-b border-stroke bg-white pb-4">
      <TextInput
        accessibilityLabel={language === "ko" ? "오늘의 촬영 메모" : "Today's shooting note"}
        className="min-h-[74px] px-0 py-0 text-[15px] font-bold leading-6 text-ink"
        maxLength={160}
        multiline
        onChangeText={onChangeText}
        placeholder={language === "ko" ? "촬영 전에 기억할 점을 적어두세요." : "Write one reminder before recording."}
        placeholderTextColor="#94a3b8"
        value={value}
      />
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} className="mt-3 flex-row items-center gap-2 py-1" onPress={onToggleChecked}>
        <View className={`h-6 w-6 items-center justify-center rounded-full border ${checked ? "border-violet bg-violet" : "border-slate-300 bg-white"}`}>
          {checked ? <MaterialCommunityIcons color="#ffffff" name="check" size={14} /> : null}
        </View>
        <Text className="flex-1 text-[14px] font-black text-ink">
          {language === "ko" ? "촬영 전 확인 완료" : "Ready before recording"}
        </Text>
      </Pressable>
      <Pressable accessibilityRole="button" className="mt-3 self-start rounded-full bg-ink px-4 py-2" onPress={onClose}>
        <Text className="text-[13px] font-black text-white">
          {language === "ko" ? "닫기" : "Done"}
        </Text>
      </Pressable>
    </View>
  );
}
```

- [ ] **Step 5: Wire collapsed body header and expanded note**

Add state:

```tsx
const [noteEntryOpen, setNoteEntryOpen] = useState(false);
```

Use this list header:

```tsx
ListHeaderComponent={
  <>
    <ShootBoardBodyHeader
      board={renderedShootBoard}
      language={language}
      onOpenNote={() => setNoteEntryOpen(true)}
    />
    <ShootBoardNoteCta
      checked={renderedShootBoard.boardNoteChecked ?? false}
      expanded={noteEntryOpen}
      language={language}
      value={renderedShootBoard.boardNote ?? ""}
      onChangeText={(boardNote) => updateBoardNote({ boardNote })}
      onClose={() => setNoteEntryOpen(false)}
      onToggleChecked={() =>
        updateBoardNote({
          boardNoteChecked: !(renderedShootBoard.boardNoteChecked ?? false),
        })
      }
    />
    <ShootBoardStickyHeader
      language={language}
      onToggleReorder={() => setReorderMode((current) => !current)}
      reorderMode={reorderMode}
      title={boardCopy.cutsList}
    />
  </>
}
```

- [ ] **Step 6: Run the note test and commit**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-note-entry-contract.test.ts
```

Expected: PASS.

Commit:

```bash
git add src/features/recipes/components/shoot-board-body-header.tsx src/features/recipes/components/shoot-board-note-cta.tsx src/features/recipes/screens/recipe-detail-screen.tsx src/features/recipes/components/shoot-board-note-entry-contract.test.ts
git commit -m "feat: add shooting board note entry"
```

---

## Task 4: Execution Titles Instead of Role Labels

**Files:**
- Create: `src/features/recipes/lib/cut-card-execution-title.ts`
- Test: `src/features/recipes/lib/cut-card-execution-title.test.ts`
- Modify: `src/features/recipes/lib/cut-card-header.ts`
- Modify: `src/features/recipes/components/shoot-board-scene-card.tsx`

- [ ] **Step 1: Write the failing unit test**

```ts
import { getCutCardExecutionTitle } from "./cut-card-execution-title";
import type { ShootBoardCut } from "./shoot-board-model";

const baseCut = {
  instruction: "Open on the finished look so the routine has a reason to exist.",
  instructionKo: "완성된 결과를 먼저 보여주세요.",
  lineToSay: "Here is the glow.",
  order: 1,
  role: "hook",
  roleLabel: "Hook",
} as ShootBoardCut;

if (getCutCardExecutionTitle(baseCut, "en") !== "Open on the finished look") {
  throw new Error("Hook cut should expose an execution title, not the role label.");
}

if (getCutCardExecutionTitle(baseCut, "ko") !== "완성된 결과 먼저 보여주기") {
  throw new Error("Korean hook title should be execution-first.");
}

const customCut = {
  ...baseCut,
  instruction: "",
  role: "custom",
  roleLabel: "UGC close-up",
} as ShootBoardCut;

if (getCutCardExecutionTitle(customCut, "en") !== "UGC close-up") {
  throw new Error("Custom cut should preserve the user's title.");
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-execution-title.test.ts
```

Expected: fail because the helper does not exist yet.

- [ ] **Step 3: Add the helper**

```ts
import type { AppLanguage } from "@/core/i18n/app-language";
import type { ShootBoardCut } from "@/features/recipes/lib/shoot-board-model";

const titleByRole = {
  en: {
    hook: "Open on the finished look",
    proof: "Show the proof close-up",
    scene: "Film the repeatable steps",
    cta: "End with the save line",
    custom: "Custom cut",
  },
  ko: {
    hook: "완성된 결과 먼저 보여주기",
    proof: "증거 장면 클로즈업",
    scene: "따라 할 순서 촬영하기",
    cta: "저장하고 싶게 마무리하기",
    custom: "직접 구성한 컷",
  },
} satisfies Record<AppLanguage, Record<ShootBoardCut["role"], string>>;

const blockedPrimaryRoleNames = new Set([
  "hook",
  "proof",
  "demonstration",
  "cta",
]);

export function getCutCardExecutionTitle(
  cut: ShootBoardCut,
  language: AppLanguage,
) {
  const roleLabel = cut.roleLabel.trim();
  if (cut.role === "custom" && roleLabel) return roleLabel;

  const normalizedRoleLabel = roleLabel.toLowerCase();
  if (roleLabel && !blockedPrimaryRoleNames.has(normalizedRoleLabel)) {
    return roleLabel;
  }

  return titleByRole[language][cut.role];
}
```

- [ ] **Step 4: Extend header parts**

Update `cut-card-header.ts`:

```ts
import { getCutCardExecutionTitle } from "@/features/recipes/lib/cut-card-execution-title";

export type CutCardHeaderParts = {
  executionTitle: string;
  numberLabel: string;
  roleLabel: string;
};

export function getCutCardHeaderParts(
  cut: ShootBoardCut,
  language: AppLanguage,
): CutCardHeaderParts {
  return {
    executionTitle: getCutCardExecutionTitle(cut, language),
    numberLabel: language === "ko" ? `컷 #${cut.order}` : `Cut #${cut.order}`,
    roleLabel:
      cut.roleLabel.trim() ||
      (language === "ko" ? "직접 구성" : "Custom"),
  };
}
```

- [ ] **Step 5: Render execution title in the card**

In `ShootBoardSceneCard`, render `headerParts.executionTitle` as the primary collapsed title under the compact number/duration row:

```tsx
<Text
  className="mt-2 text-[18px] font-black leading-[22px] text-ink"
  numberOfLines={2}
>
  {headerParts.executionTitle}
</Text>
```

Do not render `headerParts.roleLabel` as the primary visible title in collapsed state.

- [ ] **Step 6: Run test and commit**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-execution-title.test.ts
```

Expected: PASS.

Commit:

```bash
git add src/features/recipes/lib/cut-card-execution-title.ts src/features/recipes/lib/cut-card-execution-title.test.ts src/features/recipes/lib/cut-card-header.ts src/features/recipes/components/shoot-board-scene-card.tsx
git commit -m "feat: use execution titles for cut rows"
```

---

## Task 5: 9:16 Short-Form Media Frames

**Files:**
- Modify: `src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify: `src/features/recipes/components/shoot-board-media-slot.tsx`
- Test: `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`

- [ ] **Step 1: Extend the design contract test**

Add these assertions:

```ts
const sceneCardSource = readFileSync(
  join(__dirname, "shoot-board-scene-card.tsx"),
  "utf8",
);

const mediaSlotSource = readFileSync(
  join(__dirname, "shoot-board-media-slot.tsx"),
  "utf8",
);

if (!sceneCardSource.includes("aspectRatio: 9 / 16")) {
  throw new Error("Cut reference preview must use 9:16 short-form framing.");
}

if (!mediaSlotSource.includes("aspectRatio: 9 / 16")) {
  throw new Error("My Take media slot must use 9:16 short-form framing.");
}

if (sceneCardSource.includes("height: 120")) {
  throw new Error("Cut reference preview should not be a fixed 16:9-like strip.");
}
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
```

Expected: fail while fixed-height reference slot remains.

- [ ] **Step 3: Update reference preview frame**

Replace `cutReferenceSlot` and `cutReferencePreview` fixed height with 9:16 sizing:

```ts
cutReferencePreview: {
  alignItems: "center",
  aspectRatio: 9 / 16,
  backgroundColor: "#111827",
  borderRadius: 14,
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
  width: 86,
},
cutReferenceSlot: {
  alignSelf: "flex-start",
  marginBottom: 10,
},
```

If the collapsed row needs a larger expanded reference later, add a second style named `expandedReferencePreview`; keep the collapsed default 9:16.

- [ ] **Step 4: Update My Take slot frame**

Replace fixed `height: 96`, `width: 72`, and `preview.height: 67` in `shoot-board-media-slot.tsx`:

```ts
root: {
  backgroundColor: "#ffffff",
  borderRadius: 12,
  borderWidth: 1.2,
  flexShrink: 0,
  overflow: "hidden",
  width: 72,
},
preview: {
  aspectRatio: 9 / 16,
  backgroundColor: "#f8fafc",
  overflow: "hidden",
  position: "relative",
  width: "100%",
},
```

Keep the label area below the frame compact. The frame owns the take count badge and state icon.

- [ ] **Step 5: Run test and commit**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
```

Expected: PASS.

Commit:

```bash
git add src/features/recipes/components/shoot-board-scene-card.tsx src/features/recipes/components/shoot-board-media-slot.tsx src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
git commit -m "feat: use short-form media frames on shoot board"
```

---

## Task 6: Cut Row Hierarchy and Reorder Mode

**Files:**
- Modify: `src/features/recipes/components/shoot-board-scene-card.tsx`
- Modify: `src/features/recipes/components/shoot-board-sticky-header.tsx`
- Test: `src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts`

- [ ] **Step 1: Add contract checks**

```ts
if (!sceneCardSource.includes("reorderMode ? (")) {
  throw new Error("Reorder handle should render only in reorder mode.");
}

if (sceneCardSource.includes("No take yet") || sceneCardSource.includes("0 takes")) {
  throw new Error("Collapsed rows must not show redundant take-state labels.");
}

if (!sceneCardSource.includes("headerParts.executionTitle")) {
  throw new Error("Collapsed cut rows must use execution title as the primary name.");
}
```

- [ ] **Step 2: Make sticky header quiet**

Change `ShootBoardStickyHeader` title copy to a quiet list label and keep reorder as a small mode toggle:

```tsx
<Text className="text-[16px] font-black text-ink">
  {title ?? (language === "ko" ? "컷 리스트" : "Cut list")}
</Text>
```

The session-level `완료` stays in `ShootBoardSessionHeader`; this sticky header's `Done` only exits reorder mode.

- [ ] **Step 3: Simplify collapsed row layout**

In `ShootBoardSceneCard`, keep collapsed row order:

1. 9:16 reference thumbnail.
2. Compact `Cut #` and duration.
3. Execution title.
4. `말할 문장` and `촬영 가이드`.
5. My Take frame and Film/Reshoot button.
6. Reorder handle only when `reorderMode` is true.

Do not add a separate completion circle, `No take yet`, `0 takes`, or `Take saved` pill.

- [ ] **Step 4: Run contract and commit**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
```

Expected: PASS.

Commit:

```bash
git add src/features/recipes/components/shoot-board-scene-card.tsx src/features/recipes/components/shoot-board-sticky-header.tsx src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
git commit -m "feat: simplify cut row hierarchy"
```

---

## Task 7: Full Verification and QA Artifacts

**Files:**
- Update: `context/context_YYYYMMDD_shooting_session_board_redesign.md`
- Create: `output/playwright/shooting-session-board-YYYYMMDD/android-board.png`
- Create: `output/playwright/shooting-session-board-YYYYMMDD/ios-board.png`
- Create: `output/reports/YYYYMMDD_shooting_session_board_redesign.md`

- [ ] **Step 1: Run targeted tests**

Run:

```bash
./node_modules/.bin/sucrase-node src/features/recipes/lib/cut-card-execution-title.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-note-entry-contract.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/components/shoot-board-scene-card-design-contract.test.ts
./node_modules/.bin/sucrase-node src/features/recipes/screens/recipe-detail/recipe-detail-board-session-contract.test.ts
```

Expected: all PASS.

- [ ] **Step 2: Run project checks**

Run:

```bash
./node_modules/.bin/tsc --noEmit --pretty false -p tsconfig.json
npm run check:architecture
npx -y @google/design.md lint DESIGN.md
git diff --check
```

Expected:

```text
TypeScript PASS
Architecture PASS
DESIGN.md lint: 0 errors
git diff --check: no output
```

- [ ] **Step 3: Capture Android and iPhone**

Use the existing simulator QA path from prior #10 work. Capture at least:

- Android shooting board overview with collapsed rows.
- Android note expanded state.
- iPhone shooting board overview with collapsed rows.
- iPhone note expanded state.

Save screenshots under:

```text
output/playwright/shooting-session-board-YYYYMMDD/
```

- [ ] **Step 4: Write context**

Create `context/context_YYYYMMDD_shooting_session_board_redesign.md`:

```markdown
# YYYY-MM-DD Shooting Session Board Redesign

## 배경

The shooting board was updated to match the new short-form session design contract in DESIGN.md.

## 변경 사항

- Added dark session header with Done / 완료.
- Moved recipe title into the body header.
- Converted shooting note into an entry row plus expanded note/check surface.
- Updated reference and My Take frames to 9:16.
- Changed collapsed cut rows to use execution-first names.
- Kept reorder handle limited to reorder mode.

## 검증

PASS:

- sucrase source-contract tests
- TypeScript
- architecture check
- DESIGN.md lint
- git diff --check
- Android/iPhone screenshot QA

## 산출물

- output/playwright/shooting-session-board-YYYYMMDD/android-board.png
- output/playwright/shooting-session-board-YYYYMMDD/ios-board.png
```

- [ ] **Step 5: Final commit and push**

Run:

```bash
git status --short
git add src/features/recipes context output
git commit -m "feat: redesign shooting session board"
git pull --rebase origin main
git push origin main
```

Expected: push succeeds to `origin/main`.

---

## Self-Review

- Spec coverage: dark session bar, `완료`, body title, note entry, 9:16 media, execution naming, no box-in-box checklist default, and reorder handle scope are all covered.
- Placeholder scan: no red-flag placeholder instructions remain.
- Type consistency: all new components use existing `AppLanguage`, `ShootBoardRecipe`, and `ShootBoardCut` types. `ShootBoardNoteCta` keeps its current file name to reduce import churn, while its behavior changes to an expanded note surface.

## 실행 옵션

Plan complete and saved to `plans/20260517_shooting_session_board_redesign.md`.

1. **Subagent-Driven (recommended)** - dispatch one focused worker per task, review between tasks, then integrate.
2. **Inline Execution** - execute tasks in this session with checkpoints.

For this repo, Subagent-Driven is recommended because session header, note surface, and cut-card media hierarchy are separable and easier to review independently.

## 결과

- Implemented with Subagent-Driven task slices and review checkpoints.
- Added dark shooting session header with top-bar `Done` / `완료`.
- Added body title header and note entry surface.
- Added execution-first cut titles.
- Changed Reference and My Take media to 9:16 frames.
- Quieted the cut-list header and strengthened cut-row design contracts.
- Fixed board status bar contrast with screen-local `StatusBar style="light"`.
- Android runtime QA passed with fresh screenshots.
- iPhone fresh capture remains blocked by local `simctl` timeout / Simulator window capture failure.

## 연결된 context

- `context/context_20260517_shooting_session_board_redesign.md`
