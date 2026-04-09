# iVibe – Mobile IDE for Expo Projects

A React Native / Expo based code editor with integrated file system, multi‑tab editing, and Git support using **isomorphic‑git**. The app provides a VS Code‑like experience on mobile, including a file tree sidebar, syntax‑highlighted editor, and offline‑first Git workflow.

## Features

- **File system abstraction** – create, read, write, move and delete files/folders within the app sandbox.
- **Multi‑tab editor** – open several files, see unsaved changes, and persist cursor/scroll positions.
- **Custom syntax highlighter** – tokenizes JavaScript/TypeScript, HTML, CSS, JSON and Markdown for dark‑theme highlighting.
- **Git integration** – initialize repos, clone, stage, commit, push/pull and view diffs, with offline queue support.
- **Responsive layout** – split‑pane view with draggable/resizable file‑tree sidebar, optimized for tablets and portrait mode.
- **Secure token storage** – GitHub personal‑access‑token saved via `expo-secure-store`.

## Getting Started

```bash
npm install          # install dependencies
npx expo start       # launch Metro bundler
```

Use the home screen to create or open a project, then explore the file tree, edit files, and manage version control directly from your device.

For more details see the `docs/` folder.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
