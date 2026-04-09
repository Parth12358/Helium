# Phase 1 — Detailed Todo

---

## 1. Project Setup ✅

- [x] Install Expo CLI
- [x] Create new Expo project — `iVibe`
- [x] Install core dependencies
    - [x] `isomorphic-git`
    - [x] `@expo/vector-icons`
    - [x] `expo-file-system`
    - [x] `expo-secure-store`
    - [x] `expo-network`
- [x] Set up folder structure
    ```
    /app
      /editor
      /filemanager
      /git
      /utils
    /components
    /constants
    /hooks
    ```
- [x] Configure app.json (dark mode, tablet support, expo-router, splash screen)
- [x] TypeScript configured with strict mode

---

## 2. File System Layer ✅

- [x] Create a file system abstraction using `expo-file-system`
- [x] `createFile(path, content)`
- [x] `readFile(path)`
- [x] `writeFile(path, content)`
- [x] `deleteFile(path)`
- [x] `createFolder(path)`
- [x] `deleteFolder(path)`
- [x] `listDirectory(path)`
- [x] `rename(path, newName)`
- [x] `moveFile(path, destination)`
- [x] `moveFolder(path, destination)`
- [x] `renameProject(oldName, newName)`
- [x] `createProject(name)`
- [x] `deleteProject(name)`
- [x] `listProjects()`
- [x] `getProjectMeta(name)`
- [x] `updateProjectMeta(name, updates)`
- [x] Define a root workspace directory inside app sandbox

---

## 3. Home Page ✅

- [x] Home screen as the app entry point
- [x] List all existing projects
- [x] Tap project to open it and navigate to file tree
- [x] Create new project button
    - [x] Input for project name
    - [x] Confirmation to create
- [x] Long press project for options (three dots button also)
    - [x] Rename project
    - [x] Delete project
- [x] Empty state when no projects exist

---

## 4. File Tree Sidebar

- [ ] `FileTree` component in `components/FileTree.tsx`
    - [ ] Receives `projectName` as prop
    - [ ] Collapsible — collapses to thin bar with icon to re-expand
    - [ ] Draggable/resizable width like VS Code
- [ ] Recursive file tree rendering
    - [ ] Renders folders and files
    - [ ] Folders have chevron, tap to expand/collapse inline
    - [ ] Files show correct icon per extension (.js, .ts, .css, .md, etc.)
- [ ] Tap file to open in editor
- [ ] Long press file or folder for context menu
    - [ ] File options: Rename, Delete, Move
    - [ ] Folder options: New file, New subfolder, Rename, Delete, Move
- [ ] New file button at top of sidebar
- [ ] New folder button at top of sidebar
- [ ] Active file highlighted in tree
- [ ] Temporary editor screen `app/editor/[name].tsx`
    - [ ] Receives project name from route params
    - [ ] Renders FileTree on the left
    - [ ] Empty placeholder on the right for now

---

## 5. Multi-Tab System

- [ ] Tab bar component across top of editor
- [ ] Open file adds a tab
- [ ] Tap tab to switch to that file
- [ ] Close tab (x button)
- [ ] Unsaved changes indicator on tab (dot or asterisk)
- [ ] Tabs persist scroll/cursor position per file
- [ ] Max tab limit or horizontal scroll for many tabs
- [ ] File tree sidebar collapsible (toggle button)
- [ ] File tree sidebar resizable/movable like VS Code

---

## 6. Custom Native Code Editor

### 6a. Tokenizer

- [ ] Define token types: `keyword`, `string`, `comment`, `number`, `operator`, `identifier`, `punctuation`, `whitespace`
- [ ] Write tokenizer for JavaScript/TypeScript
- [ ] Write tokenizer for HTML
- [ ] Write tokenizer for CSS
- [ ] Write tokenizer for JSON
- [ ] Write tokenizer for Markdown
- [ ] Language detection by file extension

### 6b. Syntax Highlighter

- [ ] Map token types to colors (dark theme first)
- [ ] Render highlighted code as `Text` spans inside a `ScrollView`
- [ ] Handle long lines (horizontal scroll)
- [ ] Re-tokenize on every keystroke (debounced for performance)

### 6c. Editor Component

- [ ] Transparent `TextInput` overlaid on highlighted `Text`
- [ ] Sync scroll position between TextInput and highlighted layer
- [ ] Line numbers column on left, synced to scroll
- [ ] Auto-indent on Enter
- [ ] Tab key inserts 2 spaces
- [ ] Bracket/quote auto-close ( `(`, `[`, `{`, `"`, `'` )
- [ ] Select all, copy, paste support
- [ ] Undo/redo (basic)

### 6d. Touch Optimizations

- [ ] Tap to place cursor
- [ ] Double tap to select word
- [ ] Triple tap to select line
- [ ] Touch selection handles
- [ ] External keyboard support (arrow keys, cmd+s to save, cmd+z undo)

---

## 7. Save System

- [ ] Auto-save on pause (debounced, ~1s after last keystroke)
- [ ] Manual save (cmd+s or save button)
- [ ] Unsaved changes tracked per file
- [ ] Warn before closing unsaved file

---

## 8. Git Integration (isomorphic-git)

### 8a. Setup

- [ ] Initialize isomorphic-git with `expo-file-system` as the fs adapter
- [ ] `git.init()` for new projects
- [ ] `.gitignore` file created by default

### 8b. GitHub Auth

- [ ] GitHub personal access token input screen
- [ ] Store token securely via `expo-secure-store`
- [ ] Validate token on entry
- [ ] Sign out / remove token option

### 8c. Core Git Operations

- [ ] Clone repo from GitHub URL
- [ ] Stage files (`git add`)
- [ ] Commit with message
- [ ] Push to GitHub
- [ ] Pull from GitHub
- [ ] View current branch
- [ ] Create new branch
- [ ] Switch branch

### 8d. Git UI

- [ ] Source control panel (like VS Code sidebar)
- [ ] List of changed files
- [ ] Diff viewer (before/after per file)
- [ ] Commit message input
- [ ] Stage/unstage individual files
- [ ] Push/pull buttons with status indicator

### 8e. Offline Queue

- [ ] Detect network status via `expo-network`
- [ ] If offline, queue commits locally
- [ ] On reconnect, prompt to push queued commits
- [ ] Show offline indicator in UI

---

## 9. Layout

- [ ] Split pane — file tree sidebar on left, editor on right
- [ ] Sidebar collapsible (swipe or button)
- [ ] Bottom panel for git status
- [ ] Top bar with file name, save status, branch name
- [ ] iPad landscape optimized as primary layout
- [ ] Portrait mode supported (sidebar becomes drawer)
