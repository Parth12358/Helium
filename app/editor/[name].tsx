import { Tab } from "@/.expo/types/editor";
import FileTree from "@/components/FileTree";
import TabBar from "@/components/TabBar";
import { Theme, useTheme } from "@/constants/theme";
import { useTabScrollPersistence } from "@/hooks/useTabScrollPersistence";
import { readFile, writeFile } from "@/utils/filesystem";
import { getSettings } from "@/utils/settings";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function makeStyles(t: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: t.bg,
        },
        topBar: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: t.border,
        },
        backButton: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        backButtonText: {
            fontSize: 14,
            color: t.accent,
            fontWeight: "500",
        },
        projectTitle: {
            flex: 1,
            fontSize: 14,
            fontWeight: "600",
            color: t.text,
            marginLeft: 12,
        },
        body: {
            flex: 1,
            flexDirection: "row",
        },
        editorPane: {
            flex: 1,
            backgroundColor: t.bg,
        },
        editorPlaceholder: {
            fontSize: 14,
            color: t.textSecondary,
        },
        saveButton: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: t.border,
        },
        saveButtonText: {
            fontSize: 13,
            color: t.accent,
            fontWeight: "500" as const,
        },
        editorInput: {
            flex: 1,
            color: t.text,
            fontSize: 13,
            fontFamily: "Courier",
            padding: 12,
            textAlignVertical: "top",
        },
        emptyState: {
            flex: 1,
            alignItems: "center" as const,
            justifyContent: "center" as const,
        },
    });
}

export default function EditorScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTabPath, setActiveTabPath] = useState<string | null>(null);
    const [autoSave, setAutoSave] = useState(false);
    const [autoSaveDelay, setAutoSaveDelay] = useState(1000);

    useEffect(() => {
        getSettings().then((s) => {
            setAutoSave(s.autoSave);
            setAutoSaveDelay(s.autoSaveDelay);
        });
    }, []);

    const openFile = useCallback(
        async (relativePath: string) => {
            const existing = tabs.find((t) => t.path === relativePath);
            if (existing) {
                setActiveTabPath(relativePath);
                return;
            }

            const result = await readFile(name ?? "", relativePath);
            if (!result.ok) return;

            const newTab: Tab = {
                path: relativePath,
                name: relativePath.split("/").pop() ?? relativePath,
                content: result.data,
                isDirty: false,
                scrollPosition: 0,
            };

            setTabs((prev) => [...prev, newTab]);
            setActiveTabPath(relativePath);
        },
        [tabs, name],
    );

    const closeTab = useCallback(
        (path: string) => {
            setTabs((prev) => {
                const index = prev.findIndex((t) => t.path === path);
                const next = prev.filter((t) => t.path !== path);

                if (activeTabPath === path) {
                    const adjacent = next[index] ?? next[index - 1] ?? null;
                    setActiveTabPath(adjacent?.path ?? null);
                }

                return next;
            });
        },
        [activeTabPath],
    );

    const switchTab = useCallback((path: string) => {
        setActiveTabPath(path);
    }, []);

    const saveFile = useCallback(
        async (path: string) => {
            const tab = tabs.find((t) => t.path === path);
            if (!tab) return;

            const result = await writeFile(name ?? "", path, tab.content);
            if (!result.ok) return;

            setTabs((prev) =>
                prev.map((t) =>
                    t.path === path ? { ...t, isDirty: false } : t,
                ),
            );
        },
        [tabs, name],
    );

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const updateContent = useCallback(
        (path: string, content: string) => {
            setTabs((prev) =>
                prev.map((t) =>
                    t.path === path ? { ...t, content, isDirty: true } : t,
                ),
            );

            if (autoSave) {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                    saveFile(path);
                }, autoSaveDelay);
            }
        },
        [autoSave, autoSaveDelay, saveFile],
    );

    const onSaveScroll = useCallback((path: string, scrollPosition: number) => {
        setTabs((prev) =>
            prev.map((t) => (t.path === path ? { ...t, scrollPosition } : t)),
        );
    }, []);

    const activeTab = tabs.find((t) => t.path === activeTabPath) ?? null;
    const { inputRef, handleScroll } = useTabScrollPersistence(
        activeTab,
        onSaveScroll,
    );

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return (
        <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityLabel="Back to projects"
                    accessibilityRole="button"
                >
                    <Text style={styles.backButtonText}>← Projects</Text>
                </TouchableOpacity>
                <Text
                    style={styles.projectTitle}
                    numberOfLines={1}
                    accessibilityRole="header"
                >
                    {name}
                </Text>
                {activeTabPath && (
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => saveFile(activeTabPath)}
                        accessibilityLabel="Save file"
                    >
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.body}>
                <FileTree projectName={name ?? ""} onFileOpen={openFile} />

                <View style={styles.editorPane}>
                    <TabBar
                        tabs={tabs}
                        activeTabPath={activeTabPath}
                        onSwitch={switchTab}
                        onClose={closeTab}
                    />
                    {activeTabPath ? (
                        <TextInput
                            ref={inputRef}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            style={styles.editorInput}
                            value={
                                tabs.find((t) => t.path === activeTabPath)
                                    ?.content ?? ""
                            }
                            onChangeText={(text) =>
                                updateContent(activeTabPath, text)
                            }
                            multiline
                            scrollEnabled
                            autoCorrect={false}
                            autoCapitalize="none"
                            spellCheck={false}
                            accessibilityLabel="Code editor"
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.editorPlaceholder}>
                                Open a file to start editing
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
