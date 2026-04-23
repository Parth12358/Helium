import { Theme, useTheme } from "@/constants/theme";
import {
    createProject,
    deleteProject,
    initWorkspace,
    listProjects,
    renameProject,
} from "@/utils/filesystem";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
    ActionSheetIOS,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

function makeStyles(t: Theme) {
    return StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: t.bg,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: t.border,
        },
        appName: {
            fontSize: 18,
            fontWeight: "600",
            color: t.text,
            letterSpacing: 0.3,
        },
        headerRight: {
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 8,
        },
        settingsButton: {
            padding: 4,
        },
        newButton: {
            backgroundColor: t.accent,
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 4,
        },
        newButtonText: {
            color: t.accentText,
            fontSize: 13,
            fontWeight: "500",
        },
        list: {
            flex: 1,
        },
        listContent: {
            paddingTop: 4,
        },
        listContentEmpty: {
            flex: 1,
        },
        projectRow: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: t.border,
        },
        projectName: {
            flex: 1,
            fontSize: 14,
            color: t.text,
        },
        menuButton: {
            paddingHorizontal: 10,
            paddingVertical: 4,
        },
        menuButtonText: {
            fontSize: 20,
            color: t.textSecondary,
            letterSpacing: 1,
        },
        emptyContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 40,
            paddingBottom: 80,
        },
        emptyText: {
            fontSize: 15,
            color: t.textSecondary,
            textAlign: "center",
            lineHeight: 22,
        },
        // Modal
        modalOverlay: {
            flex: 1,
            backgroundColor: t.overlay,
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
        },
        modalCard: {
            width: "100%",
            maxWidth: 420,
            backgroundColor: t.surface,
            borderRadius: 8,
            padding: 24,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: t.border,
        },
        modalTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: t.text,
            marginBottom: 16,
        },
        modalInput: {
            backgroundColor: t.inputBg,
            borderWidth: 1,
            borderColor: t.inputBorder,
            borderRadius: 4,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 14,
            color: t.text,
            marginBottom: 20,
        },
        modalActions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 10,
        },
        modalCancelBtn: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: t.border,
        },
        modalCancelText: {
            fontSize: 13,
            color: t.textSecondary,
        },
        modalConfirmBtn: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 4,
            backgroundColor: t.accent,
        },
        modalConfirmText: {
            fontSize: 13,
            color: t.accentText,
            fontWeight: "500",
        },
    });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ModalState =
    | { type: "none" }
    | { type: "create" }
    | { type: "rename"; projectName: string };

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function HomePage() {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    const [projects, setProjects] = useState<string[]>([]);
    const [modal, setModal] = useState<ModalState>({ type: "none" });
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<TextInput>(null);

    const loadProjects = useCallback(() => {
        const result = listProjects();
        if (result.ok) {
            setProjects(result.data);
        } else {
            Alert.alert("Error", result.error);
        }
    }, []);

    useEffect(() => {
        initWorkspace();
        loadProjects();
    }, [loadProjects]);

    // --- modal helpers ---

    function closeModal() {
        setModal({ type: "none" });
    }

    function openCreateModal() {
        setInputValue("");
        setModal({ type: "create" });
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    function openRenameModal(projectName: string) {
        setInputValue(projectName);
        setModal({ type: "rename", projectName });
        setTimeout(() => inputRef.current?.focus(), 0);
    }

    // --- actions ---

    function handleConfirm() {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        if (modal.type === "create") {
            const result = createProject(trimmed);
            if (!result.ok) {
                Alert.alert("Error", result.error);
                return;
            }
        } else if (modal.type === "rename") {
            const result = renameProject(modal.projectName, trimmed);
            if (!result.ok) {
                Alert.alert("Error", result.error);
                return;
            }
        }

        closeModal();
        loadProjects();
    }

    function handleDelete(projectName: string) {
        Alert.alert(
            "Delete Project",
            `Delete "${projectName}"? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const result = deleteProject(projectName);
                        if (!result.ok) {
                            Alert.alert("Error", result.error);
                        } else {
                            loadProjects();
                        }
                    },
                },
            ],
        );
    }

    function showProjectOptions(projectName: string) {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", "Rename", "Delete"],
                cancelButtonIndex: 0,
                destructiveButtonIndex: 2,
                title: projectName,
            },
            (buttonIndex) => {
                if (buttonIndex === 1) openRenameModal(projectName);
                if (buttonIndex === 2) handleDelete(projectName);
            },
        );
    }

    function handleOpenProject(projectName: string) {
        router.push({
            pathname: "/editor/[name]",
            params: { name: projectName },
        });
    }

    // --- render ---

    return (
        <SafeAreaView style={styles.root}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.appName} accessibilityRole="header">
                    Helium
                </Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => router.push("/settings")}
                        accessibilityLabel="Open settings"
                        accessibilityRole="button"
                    >
                        <Ionicons name="settings-outline" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.newButton}
                        onPress={openCreateModal}
                        accessibilityLabel="New Project"
                        accessibilityRole="button"
                    >
                        <Text style={styles.newButtonText}>New Project</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Project list */}
            <FlatList
                style={styles.list}
                contentContainerStyle={
                    projects.length === 0
                        ? styles.listContentEmpty
                        : styles.listContent
                }
                data={projects}
                keyExtractor={(item) => item}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No projects yet.{"\n"}Create one to get started.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.projectRow}
                        onPress={() => handleOpenProject(item)}
                        onLongPress={() => showProjectOptions(item)}
                        accessibilityLabel={`Open project ${item}`}
                        accessibilityHint="Long press for rename or delete options"
                        accessibilityRole="button"
                    >
                        <Text style={styles.projectName} numberOfLines={1}>
                            {item}
                        </Text>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => showProjectOptions(item)}
                            accessibilityLabel={`Options for ${item}`}
                            accessibilityRole="button"
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Text style={styles.menuButtonText}>⋯</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />

            {/* Create / Rename modal */}
            <Modal
                visible={modal.type !== "none"}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeModal}
                    accessibilityLabel="Dismiss modal"
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalCard}
                    >
                        <Text style={styles.modalTitle}>
                            {modal.type === "create"
                                ? "New Project"
                                : "Rename Project"}
                        </Text>
                        <TextInput
                            ref={inputRef}
                            style={styles.modalInput}
                            value={inputValue}
                            onChangeText={setInputValue}
                            placeholder="Project name"
                            placeholderTextColor={theme.textSecondary}
                            autoCorrect={false}
                            autoCapitalize="none"
                            returnKeyType="done"
                            onSubmitEditing={handleConfirm}
                            accessibilityLabel="Project name"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={closeModal}
                                accessibilityLabel="Cancel"
                                accessibilityRole="button"
                            >
                                <Text style={styles.modalCancelText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalConfirmBtn}
                                onPress={handleConfirm}
                                accessibilityLabel={
                                    modal.type === "create"
                                        ? "Create project"
                                        : "Confirm rename"
                                }
                                accessibilityRole="button"
                            >
                                <Text style={styles.modalConfirmText}>
                                    {modal.type === "create"
                                        ? "Create"
                                        : "Rename"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}
