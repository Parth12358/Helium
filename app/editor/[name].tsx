import FileTree from "@/components/FileTree";
import { Theme, useTheme } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: t.bg,
        },
        editorPlaceholder: {
            fontSize: 14,
            color: t.textSecondary,
        },
    });
}

export default function EditorScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

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
            </View>

            <View style={styles.body}>
                <FileTree
                    projectName={name ?? ""}
                    onFileOpen={(relativePath: string) =>
                        console.log("open", relativePath)
                    }
                />

                <View style={styles.editorPane}>
                    <Text style={styles.editorPlaceholder}>
                        Editor coming soon
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
