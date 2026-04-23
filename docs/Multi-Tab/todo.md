# Helium — Multi-Tab System Todo

## Types

- [x] Define `Tab` type in a shared types file or at the top of the editor screen

## Editor Screen State (`app/editor/[name].tsx`)

- [x] Add `tabs: Tab[]` state
- [x] Add `activeTabPath: string | null` state

## Tab Logic (editor screen)

- [x] `openFile(relativePath)` — reads file via `readFile`, adds new tab or switches to existing
- [x] Wire `onFileOpen` prop on FileTree to `openFile`
- [x] `closeTab(path)` — removes tab, switches to nearest adjacent tab
- [x] `switchTab(path)` — sets active tab, restores scroll position
- [x] `updateContent(path, content)` — updates tab content and sets `isDirty: true`
- [x] `saveFile(path)` — writes to filesystem via `writeFile`, sets `isDirty: false`

## TabBar Component (`components/TabBar.tsx`)

- [x] Create component with props: `tabs`, `activeTabPath`, `onSwitch`, `onClose`
- [x] Horizontally scrollable via `ScrollView` horizontal
- [x] Each tab shows filename (`tab.name`)
- [x] Active tab highlighted using `theme.accent` / `theme.surface`
- [x] Dirty tab shows `●` dot instead of `✕` close button
- [x] Tapping dot on dirty tab closes (can warn later)
- [x] Tapping `✕` closes the tab
- [x] Tapping tab body switches to it
- [x] `accessibilityLabel` on all `TouchableOpacity` elements
- [x] Styles memoized with `useMemo`

## Editor Pane (below tab bar)

- [x] Render `TabBar` at top of editor pane
- [x] Below tab bar: show active file content in a `TextInput` (placeholder for now)
- [x] `TextInput` calls `updateContent` on change
- [x] Restore scroll position when switching tabs
- [x] Show empty state when no tabs are open

## Scroll / Cursor Persistence

- [x] Track `scrollPosition` per tab in state
- [x] Save scroll position on tab switch (before switching away)
- [x] Restore scroll position after switching to a tab

## Tab Reordering

- [ ] ~~Allow tabs to be dragged and rearranged in the tab bar~~ — deferred until native build
- [ ] ~~Use `react-native-gesture-handler` for drag detection (already a dependency)~~ — deferred until native build
- [ ] ~~Reorder `tabs` array in state on drop~~ — deferred until native build

## Save System

### Manual Save

- [ ] ~~Add `Cmd+S` keyboard shortcut handler in editor screen~~ — deferred until native build
- [x] Add save button in `topBar` of editor screen
- [x] Both invoke `saveFile(activeTabPath)` when there is an active tab

### Auto-Save

- [x] Add auto-save setting to a settings store (e.g. `utils/settings.ts`)
- [x] Add toggle for auto-save in a settings screen
- [x] In editor screen, debounce `updateContent` — if auto-save is enabled, call `saveFile` after delay (e.g. 1000ms)
- [x] Cancel debounce timer on tab switch or unmount
