import { Theme, useTheme } from "@/constants/theme";
import { getSettings, saveSettings } from "@/utils/settings";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
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
        title: {
            flex: 1,
            fontSize: 14,
            fontWeight: "600",
            color: t.text,
            marginLeft: 12,
        },
        section: {
            marginTop: 24,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: t.border,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: t.border,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: t.surface,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: t.border,
        },
        rowLabel: {
            fontSize: 14,
            color: t.text,
        },
        rowSubLabel: {
            fontSize: 12,
            color: t.textSecondary,
            marginTop: 2,
        },
    });
}

export default function SettingsScreen() {
    const theme = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    const [autoSave, setAutoSave] = useState(false);

    useEffect(() => {
        getSettings().then((s) => setAutoSave(s.autoSave));
    }, []);

    const toggleAutoSave = async (value: boolean) => {
        setAutoSave(value);
        await saveSettings({ autoSave: value });
    };

    return (
        <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityLabel="Back"
                    accessibilityRole="button"
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title} accessibilityRole="header">
                    Settings
                </Text>
            </View>
            <View style={styles.section}>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.rowLabel}>Auto Save</Text>
                        <Text style={styles.rowSubLabel}>
                            Automatically save after 1 second of inactivity
                        </Text>
                    </View>
                    <Switch
                        value={autoSave}
                        onValueChange={toggleAutoSave}
                        accessibilityLabel="Toggle auto save"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
