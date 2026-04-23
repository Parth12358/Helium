# Helium — Custom Native Code Editor Todo

---

## Phase 1 — Tokenizer

### Types (`types/editor.ts`)

- [ ] Add `TokenType` union type with all token types: `keyword`, `string`, `comment`, `number`, `operator`, `punctuation`, `tag`, `attribute`, `identifier`, `whitespace`, `plain`
- [ ] Add `Token` type: `{ type: TokenType; value: string }`
- [ ] Add `Language` union type: `"typescript" | "javascript" | "css" | "html" | "json" | "markdown" | "plaintext"`

### Language Detection (`utils/tokenizer.ts`)

- [ ] Write `detectLanguage(filename: string): Language` that maps file extension to language
    - `.ts` `.tsx` → `typescript`
    - `.js` `.jsx` → `javascript`
    - `.css` → `css`
    - `.html` → `html`
    - `.json` → `json`
    - `.md` → `markdown`
    - everything else → `plaintext`

### JavaScript / TypeScript Tokenizer

- [ ] Tokenize keywords: `const`, `let`, `var`, `function`, `return`, `if`, `else`, `for`, `while`, `class`, `import`, `export`, `from`, `default`, `new`, `typeof`, `instanceof`, `null`, `undefined`, `true`, `false`, `async`, `await`, `try`, `catch`, `throw`, `type`, `interface`, `extends`, `implements`
- [ ] Tokenize single-line strings: `'...'` and `"..."`
- [ ] Tokenize template literals: `` `...` ``
- [ ] Tokenize single-line comments: `// ...`
- [ ] Tokenize block comments: `/* ... */`
- [ ] Tokenize numbers: integers, floats, hex (`0x...`), binary (`0b...`)
- [ ] Tokenize operators: `=`, `==`, `===`, `!=`, `!==`, `=>`, `+`, `-`, `*`, `/`, `%`, `&&`, `||`, `!`, `?`, `:`, `??`, `?.`
- [ ] Tokenize punctuation: `{`, `}`, `(`, `)`, `[`, `]`, `;`, `,`, `.`
- [ ] Tokenize identifiers: any word not matched as a keyword
- [ ] Tokenize whitespace: spaces and tabs (preserve for layout)
- [ ] Return `Token[][]` — array of lines, each line is array of tokens

### HTML Tokenizer

- [ ] Tokenize opening tags: `<tagName`
- [ ] Tokenize closing tags: `</tagName>`
- [ ] Tokenize self-closing tags: `<tagName />`
- [ ] Tokenize attributes: `attributeName="value"`
- [ ] Tokenize attribute values: `"..."` and `'...'`
- [ ] Tokenize HTML comments: `<!-- ... -->`
- [ ] Tokenize plain text content between tags

### CSS Tokenizer

- [ ] Tokenize selectors: `.class`, `#id`, `element`, `::pseudo`, `:pseudo`
- [ ] Tokenize property names: e.g. `color`, `font-size`
- [ ] Tokenize property values: e.g. `red`, `16px`, `1rem`
- [ ] Tokenize strings: `"..."` and `'...'`
- [ ] Tokenize numbers and units: `16`, `1.5rem`, `100%`
- [ ] Tokenize punctuation: `{`, `}`, `:`, `;`
- [ ] Tokenize comments: `/* ... */`

### JSON Tokenizer

- [ ] Tokenize keys: `"key":`
- [ ] Tokenize string values: `"value"`
- [ ] Tokenize number values: integers and floats
- [ ] Tokenize boolean values: `true`, `false`
- [ ] Tokenize null: `null`
- [ ] Tokenize punctuation: `{`, `}`, `[`, `]`, `:`, `,`

### Markdown Tokenizer

- [ ] Tokenize headings: `# `, `## `, `### ` etc.
- [ ] Tokenize bold: `**text**`
- [ ] Tokenize italic: `*text*`
- [ ] Tokenize inline code: `` `code` ``
- [ ] Tokenize code blocks: ` ``` ` fences
- [ ] Tokenize links: `[text](url)`
- [ ] Tokenize blockquotes: `> `
- [ ] Tokenize list items: `- ` and `1. `
- [ ] Tokenize horizontal rules: `---`
- [ ] Plain text for everything else

### Plaintext

- [ ] Return entire content as a single `plain` token per line — no tokenization

---

## Phase 2 — Syntax Highlight Layer

### Theme extension (`constants/theme.ts`)

- [ ] Add `syntax` object to `Theme` interface:
    - `keyword`, `string`, `comment`, `number`, `operator`, `punctuation`, `tag`, `attribute`, `identifier`, `whitespace`, `plain`
- [ ] Add syntax colors to all preset themes (dark first)

### `HighlightLayer` component (`components/editor/HighlightLayer.tsx`)

- [ ] Accept props: `tokens: Token[][]`, `fontSize: number`, `lineHeight: number`, `scrollRef: RefObject<ScrollView>`
- [ ] Render each line as a `Text` element
- [ ] Render each token as a child `Text` span with color from `theme.syntax[token.type]`
- [ ] Horizontal scroll enabled for long lines
- [ ] Vertical scroll synced to `TextInput` layer via shared `scrollRef`
- [ ] Font family monospace, font size and line height from props
- [ ] No inline styles — all via `makeStyles`

---

## Phase 3 — TextInput Layer

### `EditorInput` component (`components/editor/EditorInput.tsx`)

- [ ] Accept props: `content`, `onChange`, `onScroll`, `scrollEventThrottle`, `fontSize`, `fontFamily`, `fontWeight`, `lineHeight`, `letterSpacing`, `tabSize`, `cursorStyle`, `ref`
- [ ] Transparent background — positioned absolutely over `HighlightLayer`
- [ ] Same font family, size, weight, line height, letter spacing as `HighlightLayer` — must match exactly
- [ ] `multiline`, `scrollEnabled`, `autoCorrect={false}`, `autoCapitalize="none"`, `spellCheck={false}`
- [ ] `accessibilityLabel="Code editor"`

### Auto-indent

- [ ] On `Return` key press, detect indentation of current line
- [ ] Insert matching indentation on new line
- [ ] If current line ends with `{`, `(`, or `[`, indent one extra level

### Tab key

- [ ] On `Tab` key press, insert `tabSize` spaces at cursor position

### Bracket and quote auto-close

- [ ] On `(` insert `()` and place cursor between
- [ ] On `[` insert `[]` and place cursor between
- [ ] On `{` insert `{}` and place cursor between
- [ ] On `"` insert `""` and place cursor between
- [ ] On `'` insert `''` and place cursor between
- [ ] Skip auto-close if next character is already the closing pair

### Bracket matching highlight

- [ ] On cursor move, detect if cursor is adjacent to a bracket
- [ ] Find the matching opener/closer
- [ ] Store both positions in state
- [ ] Render a highlight behind both matched brackets in `HighlightLayer`

### Select all, copy, paste

- [ ] Handled natively by iOS `TextInput` — no implementation needed
- [ ] Verify works correctly in Expo Go

---

## Phase 4 — Gutter (Line Numbers)

### Settings

- [ ] Add `showLineNumbers: boolean` (default `true`) to `Settings` type in `utils/settings.ts`
- [ ] Add `showLineNumbers` toggle to Editor Preferences screen

### `Gutter` component (`components/editor/Gutter.tsx`)

- [ ] Accept props: `lineCount: number`, `activeLineIndex: number`, `fontSize: number`, `lineHeight: number`, `scrollRef: RefObject<ScrollView>`, `visible: boolean`
- [ ] Fixed width column on left side of editor
- [ ] Render one line number per line
- [ ] Active line number highlighted in `theme.accent`
- [ ] Inactive line numbers in `theme.textSecondary`
- [ ] Scroll position synced to editor scroll via `scrollRef`
- [ ] Hidden when `visible` is false
- [ ] Same font size and line height as editor — must match exactly
- [ ] No inline styles — all via `makeStyles`

---

## Phase 5 — Undo / Redo

### `useUndoRedo` hook (`hooks/useUndoRedo.ts`)

- [ ] Accept `initialContent: string`
- [ ] Maintain `past: string[]` and `future: string[]` stacks in state
- [ ] `push(content)` — debounced (500ms), adds snapshot to `past`, clears `future`
- [ ] `undo()` — pops from `past`, pushes current to `future`, returns previous content
- [ ] `redo()` — pops from `future`, pushes current to `past`, returns next content
- [ ] Cap `past` stack at 100 entries to limit memory
- [ ] Return `{ undo, redo, push, canUndo, canRedo }`
- [ ] `canUndo` — `past.length > 0`
- [ ] `canRedo` — `future.length > 0`

### Native undo (deferred to native build)

- [ ] ~~Wire native iOS undo via `TextInput` on native build~~ — deferred

---

## Phase 5b — Touch Optimizations

### Native gestures (no implementation needed)

- [ ] Tap to place cursor — native
- [ ] Double tap to select word — native
- [ ] Triple tap to select line — native
- [ ] Touch selection handles — native
- [ ] Copy / paste menu — native

### External keyboard (deferred to native build)

- [ ] ~~Arrow key navigation~~ — deferred
- [ ] ~~`Cmd+S` to save~~ — deferred
- [ ] ~~`Cmd+Z` / `Cmd+Shift+Z` undo/redo~~ — deferred
- [ ] ~~`Cmd+A` select all~~ — deferred

---

## Phase 6 — Editor Component Assembly

### `CodeEditor` component (`components/editor/CodeEditor.tsx`)

- [ ] Accept props: `content`, `language`, `fontSize`, `fontFamily`, `fontWeight`, `lineHeight`, `letterSpacing`, `tabSize`, `cursorStyle`, `showLineNumbers`, `onChange`, `onScroll`, `scrollEventThrottle`, `ref`
- [ ] Compose `Gutter` + `HighlightLayer` + `EditorInput` into a single component
- [ ] Run `tokenize(content, language)` and pass tokens to `HighlightLayer` — debounced on content change
- [ ] Share scroll ref across all three layers
- [ ] Wire `useUndoRedo` hook — pass `push` into `EditorInput` onChange, expose `undo`/`redo` via ref or context
- [ ] Load all font and typography settings from `utils/settings.ts`
- [ ] No inline styles — all via `makeStyles`

### Wire into editor screen

- [ ] Replace placeholder `TextInput` in editor pane with `CodeEditor`
- [ ] Pass `activeTab.content` as `content`
- [ ] Pass `detectLanguage(activeTab.name)` as `language`
- [ ] Pass `onChange` → `updateContent`
- [ ] Pass `onScroll` and `ref` from `useTabScrollPersistence`

---

## Phase 7 — Theme System

### Preset themes (`constants/themes/`)

- [ ] `dark.ts` — Helium Dark (default dark)
- [ ] `light.ts` — Helium Light (default light)
- [ ] `monokai.ts` — Monokai
- [ ] `githubLight.ts` — GitHub Light
- [ ] `githubDark.ts` — GitHub Dark
- [ ] `solarizedDark.ts` — Solarized Dark
- [ ] `solarizedLight.ts` — Solarized Light
- [ ] Each file exports a complete `Theme` object including all `syntax` colors

### Theme store (`utils/themeStore.ts`)

- [ ] `listThemes(): Promise<SavedTheme[]>` — returns presets + saved custom themes
- [ ] `getActiveTheme(): Promise<Theme>` — reads `activeThemeId` from settings, returns matching theme
- [ ] `saveCustomTheme(theme: SavedTheme): Promise<void>` — persists to `AsyncStorage`
- [ ] `deleteCustomTheme(id: string): Promise<void>`
- [ ] `setActiveTheme(id: string): Promise<void>` — saves `activeThemeId` to settings

### `useTheme()` update (`constants/theme.ts`)

- [ ] Update `useTheme()` to load active theme from `themeStore` on mount
- [ ] Re-render app when active theme changes

---

## Phase 8 — Settings Screen

### Restructure settings (`app/settings/`)

- [ ] `index.tsx` — root settings screen, list of sections: Editor, Theme
- [ ] `editor.tsx` — editor preferences
- [ ] `theme.tsx` — theme picker + custom theme editor

### Editor Preferences (`app/settings/editor.tsx`)

- [ ] `autoSave` toggle — `Switch`
- [ ] `autoSaveDelay` slider — 500ms to 5000ms
- [ ] `showLineNumbers` toggle — `Switch`
- [ ] `fontSize` stepper — range 10–24
- [ ] `fontFamily` picker — list of available monospace fonts with live preview
    - System fonts (no loading needed): `Courier`, `Courier New`, `Menlo`, `Monaco`, `Consolas`
    - Custom fonts via `expo-font`: `JetBrains Mono`, `Fira Code`, `Source Code Pro`, `Hack`
- [ ] `fontWeight` segmented control — Light / Regular / Medium / Bold
- [ ] `lineHeight` slider — range 1.0–2.5
- [ ] `letterSpacing` slider — range -1–3
- [ ] `tabSize` segmented control — options: 2, 4, 8
- [ ] `cursorStyle` segmented control — Line / Block / Underline

### Theme Screen (`app/settings/theme.tsx`)

- [ ] List all preset themes with `ThemePreview` swatch
- [ ] List all saved custom themes with `ThemePreview` swatch
- [ ] Tap any theme to apply immediately (live preview)
- [ ] "New Custom Theme" button — opens custom theme editor
- [ ] Swipe to delete custom themes (not presets)

### Custom Theme Editor

- [ ] List all UI colors and syntax token colors as rows
- [ ] Tap any row to open color picker
- [ ] Color picker: hex input + hue/saturation/brightness sliders
- [ ] Live preview updates as colors change
- [ ] "Save Theme" — saves via `themeStore`
- [ ] "Reset to Preset" — reverts to selected base preset

### Shared components

- [ ] `ColorPickerRow` (`components/settings/ColorPickerRow.tsx`) — label + color swatch + picker
- [ ] `ThemePreview` (`components/settings/ThemePreview.tsx`) — small swatch of key theme colors

### Settings type updates (`utils/settings.ts`)

- [ ] Add `activeThemeId: string` (default `"helium-dark"`)
- [ ] Add `autoSaveDelay: number` (default `1000`)
- [ ] Add `showLineNumbers: boolean` (default `true`)
- [ ] Add `fontSize: number` (default `13`)
- [ ] Add `fontFamily: string` (default `"Courier"`)
- [ ] Add `fontWeight: string` (default `"400"`)
- [ ] Add `lineHeight: number` (default `1.5`)
- [ ] Add `letterSpacing: number` (default `0`)
- [ ] Add `tabSize: number` (default `4`)
- [ ] Add `cursorStyle: string` (default `"line"`)
