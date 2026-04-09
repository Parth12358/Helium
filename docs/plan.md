# iPad Native IDE — Project Plan

## What We're Building
A native iPad coding environment that works offline, syncs to GitHub, and runs code on a local PC over WebSocket. AI assistance powered by a forked/stripped version of Open Code running in TypeScript/Expo.

---

## Architecture

### iPad App (Expo)
- Custom native code editor (TextInput + token-based syntax highlighter)
- Local file manager (sandboxed)
- Offline Git via isomorphic-git
- GitHub sync when online
- AI assistant (Open Code fork, TypeScript)
- Context management via per-project `context.md` files
- Claude API calls directly from app for simple edits
- WebSocket client to connect to PC for execution
- GUI output rendered in WebView

### PC Server (Node.js)
- WebSocket server
- Code execution via child_process
- stdout/stderr streamed back to iPad
- GUI apps served as URL, opened in WebView on iPad
- Tailscale for remote access outside home network

---

## Stack

| Layer | Technology |
|---|---|
| App framework | Expo (React Native) |
| Code editor | Custom native (TextInput + token-based syntax highlighter) |
| Git | isomorphic-git |
| AI | Open Code fork (TypeScript) + Claude API |
| Context management | Per-project context.md |
| PC bridge | WebSocket (Node.js) |
| Remote access | Tailscale |

---

## Phase 1 — Local Editor + Git + File Management (No Server Needed)
- [ ] Set up Expo project
- [ ] Build custom native code editor
  - [ ] Tokenizer (keywords, strings, comments per language)
  - [ ] Syntax highlighter (Text spans inside ScrollView)
  - [ ] TextInput layer synced to highlighted layer
  - [ ] Line numbers synced to scroll position
  - [ ] Cursor and selection handling
- [ ] File manager UI (create, open, rename, delete files)
- [ ] Folder/directory navigation
- [ ] File tree sidebar
- [ ] Multi-tab support (open multiple files at once)
- [ ] Integrate isomorphic-git
- [ ] GitHub auth (personal access token)
- [ ] Clone, commit, push, pull
- [ ] Offline queue — commits saved locally, pushed when online

## Phase 2 — PC Bridge
- [ ] Node.js WebSocket server on PC
- [ ] Connect iPad app to server over local WiFi
- [ ] Send code to PC, receive stdout/stderr
- [ ] Stream output back to iPad terminal UI
- [ ] Tailscale setup for remote access
- [ ] GUI output detection — serve as URL, open in WebView

## Phase 3 — AI Assistant (Open Code Fork)
- [ ] Fork Open Code repo
- [ ] Strip out Python/vector database dependencies
- [ ] Replace semantic search with context.md per project
- [ ] Port remaining logic to TypeScript/Expo compatible code
- [ ] Wire Claude API for edits
- [ ] Multi-file context awareness via context.md
- [ ] Touch-friendly AI chat UI

## Phase 4 — Polish
- [ ] Touch optimized UI (tap to select blocks, swipe to switch files)
- [ ] Split pane layout for iPad (editor + terminal side by side)
- [ ] iPhone support (same codebase, adapted layout)
- [ ] Keyboard shortcuts for external keyboards
- [ ] Dark mode

---

## Key Decisions

**Why Expo over Swift?**
No Mac available. Expo lets us build for iPad and iPhone from any machine.

**Why a custom native editor?**
Full control over the editing experience, no WebView lag or feel. Built with TextInput + token-based syntax highlighting rendered as Text spans.

**Why isomorphic-git?**
Pure JavaScript Git implementation. No native modules. Works in Expo sandbox. Full offline support.

**Why replace vector DB with context.md?**
Vector databases require Python and system-level access — both blocked on iPadOS. Markdown context files are simple, portable, and good enough for this use case.

**Why WebSocket over SSH?**
Simpler to implement, easier to stream output in real time, works well on same network with near-zero lag.

---

## Limitations (Known)

- File system is sandboxed — no access to broader iPad file system
- Cannot run code locally on iPad (Apple restriction)
- Votor/Python backend must stay on PC
- Server must be on for remote execution (offline = edit only)
- No Mac = no App Store distribution (use Expo Go or TestFlight via a Mac friend)

---

## Open Questions
- Which Open Code fork/repo are we starting from?
- Personal access token or OAuth for GitHub auth?
- How to handle multiple PC servers (home vs work)?
