# Helium — Multi-Tab System Context

## What is Helium

Helium is a native iPad code editor built in Expo/React Native TypeScript. It works like VS Code — offline-first, Git integrated, AI assisted. You are building Phase 1 which is the local editor with no server needed.

---

## Current State of the App

### What is built

- `utils/filesystem.ts` — full file system abstraction layer
- `app/index.tsx` — home screen (project list, create, rename, delete)
- `app/editor/[name].tsx` — temporary editor screen (FileTree on left, placeholder on right)
- `components/FileTree.tsx` — fully working file tree sidebar

### What needs to be built next

**Multi-tab system** — the tab bar across the top of the editor that lets you have multiple files open at once, switch between them, and close them.

---

## Editor Screen Current State (app/editor/[name].tsx)

```tsx
// Layout:
// SafeAreaView (root)
//   View (topBar) — back button + project name
//   View (body, flexDirection: row)
//     FileTree (left, manages own width via Animated.Value ~250px)
//     View (editorPane, flex: 1) — "Editor coming soon" placeholder
```

The FileTree is on the left. The right side (`editorPane`) is where the tab bar and editor will go. Do NOT constrain FileTree's width — it manages itself via `Animated.Value`.

---

## Multi-Tab System Requirements

### Tab bar

- Sits at the top of the editor pane (right side)
- Each open file is a tab
- Tabs show the filename (not full path)
- Active tab is highlighted
- Tabs have an X button to close
- Unsaved changes shown as a dot (●) on the tab instead of X, clicking dot also closes but could warn
- Tabs scroll horizontally if there are many
- Switching tabs restores scroll/cursor position of that file

### Opening files

- `onFileOpen` prop on FileTree currently just `console.log`s
- Wire it up to open the file as a new tab
- If file is already open, switch to it instead of opening a duplicate

### Tab state shape

```typescript
type Tab = {
    path: string; // relative path e.g. 'src/index.ts'
    name: string; // just the filename e.g. 'index.ts'
    content: string; // file content
    isDirty: boolean; // unsaved changes
    scrollPosition: number; // scroll position to restore
};
```

### Tab behaviors

- Open file → add Tab, set as active
- Close tab → remove from tabs, switch to adjacent tab
- Switch tab → set as active, restore scroll position
- Edit content → set isDirty: true
- Save → set isDirty: false, write to filesystem

---

## FileTree Component Props (components/FileTree.tsx)

```typescript
type Props = {
    projectName: string;
    onFileOpen: (relativePath: string) => void;
};
```

`onFileOpen` is called with the relative path of the tapped file. In the editor screen, implement this to open the file as a tab.

---

## Filesystem Functions Available (utils/filesystem.ts)

```typescript
readFile(projectName: string, relativePath: string): FSResult<string>
writeFile(projectName: string, relativePath: string, content: string): FSResult
```

`FSResult<T>` is always `{ ok: true; data: T } | { ok: false; error: string }` — always handle both cases.

---

## Theme System (constants/theme.ts)

```typescript
export function useTheme(): Theme;

export interface Theme {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    accent: string;
    accentText: string;
    error: string;
    success: string;
    inputBg: string;
    inputBorder: string;
    overlay: string;
}
```

Always use `useTheme()` — never hardcode colors.

---

## Coding Conventions

- All colors from `useTheme()` — no hardcoded hex values
- Styles memoized with `useMemo` or defined outside component via `makeStyles(theme)` pattern
- No inline styles
- `SafeAreaView` from `react-native-safe-area-context`
- `accessibilityLabel` on all `TouchableOpacity` elements
- TypeScript strict mode — no `any` types
- Handle both `ok` and `error` from all filesystem calls
- Keep screens in `app/`, utilities in `utils/`, shared components in `components/`

---

## Multi-Tab Todo

- [x] Define `Tab` type
- [x] `tabs: Tab[]` state in editor screen
- [x] `activeTabPath: string | null` state
- [x] `openFile(relativePath)` function — reads file, adds tab or switches to existing
- [x] Wire `onFileOpen` on FileTree to `openFile`
- [x] `closeTab(path)` function — removes tab, switches to adjacent
- [x] `TabBar` component — horizontal scrollable list of tabs
    - [x] Each tab shows filename
    - [x] Active tab highlighted
    - [x] X button to close (or dot if dirty)
    - [x] Tap to switch
- [x] `EditorPane` area below tab bar — shows active file content (placeholder TextInput for now)
- [x] Tab scroll/cursor position persistence
- [x] Unsaved changes tracking (isDirty)
- [x] Collapsible/resizable sidebar (already in FileTree via Animated.Value, just needs drag handle)

---

## Key Decisions Already Made

- No modals — inline inputs like VS Code
- Popover context menus (not bottom sheet)
- FileTree manages its own width — never wrap in fixed-width container
- `autoFocus` unreliable in ScrollView on iPadOS — use ref + setTimeout
- Styles outside component or memoized with useMemo
- `overflow: hidden` removed from FileTree container — caused clipping
