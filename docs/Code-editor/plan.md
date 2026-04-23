# Helium — Custom Native Code Editor Plan

## Overview

A custom code editor built in React Native using a TextInput layer synced to a syntax-highlighted Text layer beneath it. No third-party editor libraries — fully native, offline, iPad-first.

---

## Architecture

The editor is composed of three layers stacked on top of each other:

1. **Highlight layer** — a `ScrollView` containing `Text` spans with token colors, purely visual, not interactive
2. **TextInput layer** — transparent, sits on top of the highlight layer, captures all input
3. **Gutter layer** — a fixed-width column on the left showing line numbers, synced to scroll position

The `TextInput` and highlight layer are kept in sync — as the user types, the content is tokenized and the highlight layer re-renders with updated colors.

---

## Phase 1 — Tokenizer

### Supported languages (initial)

- TypeScript / TSX
- JavaScript / JSX
- CSS
- HTML
- JSON
- Markdown

### Token types

- `keyword` — e.g. `const`, `let`, `function`, `return`
- `string` — single/double/template literals
- `comment` — single line `//` and block `/* */`
- `number` — numeric literals
- `operator` — `=`, `+`, `=>`, etc.
- `punctuation` — `{`, `}`, `(`, `)`, `;`
- `tag` — HTML/JSX tags
- `attribute` — HTML/JSX attributes
- `identifier` — variable names, function names, class names
- `whitespace` — spaces, tabs, newlines (preserved for layout)
- `plain` — everything else

### Tokenizer shape

```typescript
type TokenType =
    | "keyword"
    | "string"
    | "comment"
    | "number"
    | "operator"
    | "punctuation"
    | "tag"
    | "attribute"
    | "identifier"
    | "whitespace"
    | "plain";

type Token = {
    type: TokenType;
    value: string;
};

function tokenize(code: string, language: string): Token[][];
// Returns an array of lines, each line is an array of tokens
```

### File

- `utils/tokenizer.ts`

---

## Phase 2 — Syntax Highlight Layer

### Approach

- Map each `TokenType` to a color from the theme
- Render each line as a `Text` element containing child `Text` spans per token
- Wrap all lines in a `ScrollView` that shares scroll position with the `TextInput`
- Horizontal scroll enabled for long lines — both layers scroll together

### Token colors

- Added to `constants/theme.ts` as a `syntax` object on the `Theme` type
- Never hardcoded — always from `useTheme()`

### File

- `components/editor/HighlightLayer.tsx`

---

## Phase 3 — TextInput Layer

### Approach

- Transparent `TextInput` with `multiline`, `scrollEnabled`
- Positioned absolutely on top of the highlight layer
- Same font, font size, line height as the highlight layer — must match exactly or text will misalign
- Captures all user input, fires `onChangeText` to update content in tab state

### Auto-indent

- On `Return` key, detect indentation level of current line
- Insert same number of spaces/tabs on new line
- If previous line ends with `{`, indent one level deeper

### Tab key

- Insert `tabSize` spaces (from settings) instead of a tab character

### Bracket and quote auto-close

- On typing `(`, `[`, `{`, `"`, `'` — insert the matching closer and place cursor between the pair

### Bracket matching

- On typing a closing bracket `)`, `}`, `]`, highlight the matching opener
- Store match positions in state, render highlight behind matched pair

### Select all, copy, paste

- Select all: standard iOS text selection (`Cmd+A` on native build, long press menu in Expo Go)
- Copy/paste: handled natively by iOS `TextInput`

### File

- `components/editor/EditorInput.tsx`

---

## Phase 4 — Gutter (Line Numbers)

### Approach

- Fixed-width `ScrollView` on the left, scroll position synced to editor scroll
- Each line number rendered as a `Text` element
- Same line height as editor — must match exactly
- Active line number highlighted in accent color
- Hidden by default, toggled via settings (`showLineNumbers`)

### Settings integration

- Add `showLineNumbers: boolean` to `Settings` type in `utils/settings.ts`
- Add toggle in settings screen

### File

- `components/editor/Gutter.tsx`

---

## Phase 5 — Undo / Redo

### Native iOS undo

- Works automatically via `TextInput` on a native build
- Not available in Expo Go — shake gesture and `Cmd+Z` are suppressed

### Custom undo stack

- Maintain a stack of content snapshots in state
- On every edit, push current content to undo stack (debounced to avoid per-keystroke snapshots)
- `undo()` pops from undo stack, pushes to redo stack, restores content
- `redo()` pops from redo stack, pushes back to undo stack, restores content
- Stack capped at 100 entries to limit memory usage

### Shape

```typescript
type UndoStack = {
    past: string[];
    future: string[];
};
```

### File

- `hooks/useUndoRedo.ts`

---

## Phase 5b — Touch Optimizations

### Gestures (Expo Go compatible)

- Tap to place cursor — handled natively by `TextInput`
- Double tap to select word — handled natively by iOS
- Triple tap to select line — handled natively by iOS
- Touch selection handles — handled natively by iOS

### External keyboard (deferred to native build)

- Arrow key navigation
- `Cmd+S` to save
- `Cmd+Z` / `Cmd+Shift+Z` for undo/redo
- `Cmd+A` to select all

### File

- No separate file — gestures are native, keyboard shortcuts wired into `CodeEditor.tsx` on native build

---

## Phase 6 — Editor Component Assembly

Compose all layers into a single `CodeEditor` component that replaces the placeholder `TextInput` in the editor pane.

### Props

```typescript
type Props = {
    content: string;
    language: string;
    onChange: (content: string) => void;
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
    scrollEventThrottle: number;
    ref: RefObject<TextInput>;
};
```

### File

- `components/editor/CodeEditor.tsx`

---

## Phase 7 — Theme System Extension

### Preset themes

Built-in themes shipped with the app. Each defines a full `Theme` object including syntax token colors.

| Theme           | Style                           |
| --------------- | ------------------------------- |
| Helium Dark     | Default dark theme              |
| Helium Light    | Default light theme             |
| Monokai         | Classic dark, warm token colors |
| GitHub Light    | GitHub's editor theme           |
| GitHub Dark     | GitHub's dark editor theme      |
| Solarized Dark  | Low-contrast dark               |
| Solarized Light | Low-contrast light              |

### Custom themes

- User can create a custom theme by starting from any preset
- Each token color and UI color is individually editable via a color picker
- Custom themes are saved to `AsyncStorage` and loaded on app start
- Multiple custom themes can be saved and named

### Theme type extension

```typescript
export interface Theme {
    // existing UI colors...
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

    // new syntax colors
    syntax: {
        keyword: string;
        string: string;
        comment: string;
        number: string;
        operator: string;
        punctuation: string;
        tag: string;
        attribute: string;
        plain: string;
    };
}
```

### Theme storage shape

```typescript
type SavedTheme = {
    id: string; // uuid
    name: string; // user-defined name
    builtIn: boolean; // true for presets, false for custom
    colors: Theme;
};
```

### Files

- `constants/themes/dark.ts` — Helium Dark preset
- `constants/themes/light.ts` — Helium Light preset
- `constants/themes/monokai.ts`
- `constants/themes/githubLight.ts`
- `constants/themes/githubDark.ts`
- `constants/themes/solarizedDark.ts`
- `constants/themes/solarizedLight.ts`
- `constants/theme.ts` — updated to load active theme from settings
- `utils/themeStore.ts` — load, save, list, delete custom themes

---

## Phase 8 — Settings Screen Sections

The settings screen is split into dedicated sections. Each section navigates to its own sub-screen.

### Settings screen structure

```
app/settings/index.tsx        — root settings screen with section list
app/settings/editor.tsx       — editor preferences
app/settings/theme.tsx        — theme picker + custom theme editor
```

### Editor Preferences section (`app/settings/editor.tsx`)

All preferences read from and write to `utils/settings.ts`.

| Preference        | Type      | Default | UI                            |
| ----------------- | --------- | ------- | ----------------------------- |
| `autoSave`        | `boolean` | `false` | Switch                        |
| `autoSaveDelay`   | `number`  | `1000`  | Slider (500ms–5000ms)         |
| `showLineNumbers` | `boolean` | `true`  | Switch                        |
| `fontSize`        | `number`  | `13`    | Stepper (10–24)               |
| `tabSize`         | `number`  | `4`     | Segmented control (2 / 4 / 8) |

### Theme section (`app/settings/theme.tsx`)

- List of all preset themes with a preview swatch
- List of saved custom themes
- Tap any theme to apply it immediately (live preview)
- "New Custom Theme" button — opens custom theme editor
- Swipe to delete custom themes (not presets)

### Custom theme editor

- Launched from the theme screen
- Shows all UI colors and syntax token colors as a list
- Tap any color row to open a color picker
- Color picker: hex input + hue/saturation/brightness sliders
- "Save Theme" saves to `AsyncStorage` via `themeStore`
- "Reset to Preset" reverts all changes to the selected base preset

### Files

- `components/settings/ColorPickerRow.tsx` — reusable color picker row
- `components/settings/ThemePreview.tsx` — small swatch showing a theme's key colors
- `utils/themeStore.ts` — CRUD for custom themes in AsyncStorage

---

## Settings Additions

| Setting           | Type      | Default         |
| ----------------- | --------- | --------------- |
| `showLineNumbers` | `boolean` | `true`          |
| `fontSize`        | `number`  | `13`            |
| `tabSize`         | `number`  | `4`             |
| `autoSaveDelay`   | `number`  | `1000`          |
| `activeThemeId`   | `string`  | `"helium-dark"` |

---

## Todo

### Tokenizer

- [ ] Define `Token` and `TokenType` types in `types/editor.ts` (include `identifier`, `whitespace`)
- [ ] Build `tokenize(code, language)` in `utils/tokenizer.ts` for JS/TS first
- [ ] Extend tokenizer for CSS, HTML, JSON, Markdown
- [ ] Language detection by file extension

### Highlight Layer

- [ ] Add `syntax` token colors to `Theme` in `constants/theme.ts`
- [ ] Build `HighlightLayer` component
- [ ] Sync scroll position with `TextInput` layer
- [ ] Horizontal scroll for long lines

### TextInput Layer

- [ ] Build `EditorInput` component with transparent overlay
- [ ] Match font metrics exactly to highlight layer
- [ ] Implement auto-indent on Return key
- [ ] Tab key inserts `tabSize` spaces
- [ ] Bracket and quote auto-close `(`, `[`, `{`, `"`, `'`
- [ ] Implement bracket matching highlight
- [ ] Select all, copy, paste (native iOS)

### Gutter

- [ ] Add `showLineNumbers` to `Settings`
- [ ] Add toggle in settings screen under Editor Preferences
- [ ] Build `Gutter` component
- [ ] Sync gutter scroll to editor scroll

### Undo / Redo

- [ ] Build `useUndoRedo` hook with debounced snapshots
- [ ] Wire into `CodeEditor` component
- [ ] Native undo passthrough for native build

### Touch Optimizations

- [ ] Tap, double tap, triple tap — native, no implementation needed
- [ ] ~~External keyboard shortcuts~~ — deferred to native build

### Assembly

- [ ] Build `CodeEditor` component composing all layers
- [ ] Replace placeholder `TextInput` in editor pane with `CodeEditor`

### Theme System

- [ ] Extend `Theme` type with `syntax` colors in `constants/theme.ts`
- [ ] Build preset theme files in `constants/themes/`
- [ ] Update `useTheme()` to load active theme from settings
- [ ] Build `themeStore.ts` for custom theme CRUD
- [ ] Build custom theme editor with color picker

### Settings Screen

- [ ] Restructure `app/settings/` into `index.tsx`, `editor.tsx`, `theme.tsx`
- [ ] Build Editor Preferences screen with all toggles, sliders, steppers
- [ ] Build Theme screen with preset list and custom theme list
- [ ] Build `ColorPickerRow` component
- [ ] Build `ThemePreview` swatch component
- [ ] Add `activeThemeId` and `autoSaveDelay` to `Settings` type
