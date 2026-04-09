import { useColorScheme } from "@/hooks/use-color-scheme";

export type ColorScheme = "light" | "dark";

export interface Theme {
    // Backgrounds
    bg: string;
    surface: string;
    // Borders
    border: string;
    // Text
    text: string;
    textSecondary: string;
    // Interactive
    accent: string;
    accentText: string;
    // Semantic
    error: string;
    success: string;
    // Input
    inputBg: string;
    inputBorder: string;
    // Overlay
    overlay: string;
}

const light: Theme = {
    bg: "#ffffff",
    surface: "#f3f3f3",
    border: "#e0e0e0",
    text: "#1e1e1e",
    textSecondary: "#888888",
    accent: "#0e639c",
    accentText: "#ffffff",
    error: "#cd3131",
    success: "#4caf50",
    inputBg: "#ffffff",
    inputBorder: "#cccccc",
    overlay: "rgba(0,0,0,0.4)",
};

const dark: Theme = {
    bg: "#1e1e1e",
    surface: "#252526",
    border: "#2d2d2d",
    text: "#cccccc",
    textSecondary: "#6a6a6a",
    accent: "#0e639c",
    accentText: "#ffffff",
    error: "#f44747",
    success: "#4caf50",
    inputBg: "#3c3c3c",
    inputBorder: "#555555",
    overlay: "rgba(0,0,0,0.5)",
};

export const themes: Record<ColorScheme, Theme> = { light, dark };

export function useTheme(): Theme {
    const scheme = useColorScheme() ?? "dark";
    return themes[scheme];
}
