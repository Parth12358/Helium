# Save System — Todo & Plan

## Status Summary

Core save loop is working. Missing: close warnings, error handling,
app background save, and settings UI polish.

---

## HIGH PRIORITY

### 1. Warn before closing unsaved tab

**File:** `components/TabBar.tsx`

- [x] Intercept close button tap when `tab.isDirty === true`
- [x] Show `Alert.alert` with options: Save, Discard, Cancel
- [x] If Save — call `saveFile(tab.path)` then close tab
- [x] If Discard — close tab without saving
- [x] If Cancel — do nothing

### 2. Warn before navigating back with unsaved files

**File:** `app/editor/[name].tsx`

- [x] Check if any tab has `isDirty === true` before navigating back
- [x] Add `beforeRemove` listener via `navigation.addListener`
- [x] Show `Alert.alert` listing unsaved files
- [x] Options: Save All, Discard All, Cancel
- [x] If Save All — call `saveFile` for each dirty tab then navigate
- [x] If Discard All — navigate without saving
- [x] If Cancel — prevent navigation

### 3. Error handling on save failure

**File:** `app/editor/[name].tsx`

- [x] In `saveFile`, read `result.error` when `!result.ok`
- [x] Show `Alert.alert` with the error message
- [x] Keep `isDirty: true` on failure (already correct)
- [x] Log the error for debugging

### 4. Save on app background

**File:** `app/editor/[name].tsx`

- [x] Import `AppState` from `react-native`
- [x] Add `AppState.addEventListener('change', handler)` on mount
- [x] In handler — if state becomes `background` or `inactive`,
      save all dirty tabs
- [x] Clean up listener on unmount

---

## MEDIUM PRIORITY

### 5. Cmd+S keyboard shortcut

**File:** `app/editor/[name].tsx`

- [ ] Deferred to native build per project docs
- [ ] Wire `Cmd+S` to `saveFile(activeTabPath)` in native build

### 6. User feedback when auto-save fires

**File:** `app/editor/[name].tsx`

- [x] Show a subtle status indicator in the top bar
- [x] Options: small "Saved" text that fades out, or a checkmark icon
- [x] Trigger after `saveFile` resolves successfully in auto-save path
- [x] Auto-hide after 2 seconds

### 7. Loading state on manual save button

**File:** `app/editor/[name].tsx`

- [x] Add `isSaving` state — set to `true` before save, `false` after
- [x] Disable save button while `isSaving` is true
- [x] Show activity indicator or "Saving..." text on button

---

## LOW PRIORITY

### 8. Auto-save delay slider in settings

**File:** `app/settings/index.tsx` --deferred for nwo

- [ ] Add a `Slider` component below the auto-save toggle
- [ ] Range: 500ms to 5000ms
- [ ] Show current value as label (e.g. "1.0s")
- [ ] On change — call `saveSettings({ autoSaveDelay: value })`
- [ ] Only visible when auto-save is enabled

### 9. Use result.error on save failure

**File:** `app/editor/[name].tsx`

- [x] Already tracked in `FSResult` — just needs to be read
- [x] Pass `result.error` string into the Alert message from item 3
