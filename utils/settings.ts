import AsyncStorage from "@react-native-async-storage/async-storage";

export type Settings = {
    autoSave: boolean;
    autoSaveDelay: number; // milliseconds
};

const DEFAULTS: Settings = {
    autoSave: false,
    autoSaveDelay: 1000,
};

const KEY = "helium:settings";

export async function getSettings(): Promise<Settings> {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
}

export async function saveSettings(updates: Partial<Settings>): Promise<void> {
    const current = await getSettings();
    await AsyncStorage.setItem(KEY, JSON.stringify({ ...current, ...updates }));
}
