import { Tab } from "@/app/types/editor";
import { Theme, useTheme } from "@/constants/theme";
import { useMemo } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

type Props = {
	tabs: Tab[];
	activeTabPath: string | null;
	onSwitch: (path: string) => void;
	onClose: (path: string) => void;
	onSave: (path: string) => Promise<void>;
};

function makeStyles(t: Theme) {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			borderBottomWidth: StyleSheet.hairlineWidth,
			borderBottomColor: t.border,
			backgroundColor: t.surface,
			maxHeight: 28,
		},
		tab: {
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 8,
			paddingVertical: 1,
			borderRightWidth: StyleSheet.hairlineWidth,
			borderRightColor: t.border,
		},
		activeTab: {
			backgroundColor: t.bg,
			borderBottomWidth: 2,
			borderBottomColor: t.accent,
		},
		tabName: {
			fontSize: 12,
			color: t.textSecondary,
		},
		activeTabName: {
			color: t.text,
		},
		closeButton: {
			marginLeft: 6,
			padding: 2,
		},
		closeText: {
			fontSize: 12,
			color: t.textSecondary,
		},
		dirtyDot: {
			fontSize: 11,
			color: t.accent,
		},
	});
}

export default function TabBar({
	tabs,
	activeTabPath,
	onSwitch,
	onClose,
	onSave,
}: Props) {
	const theme = useTheme();
	const styles = useMemo(() => makeStyles(theme), [theme]);

	function handleClose(tab: Tab) {
		if (tab.isDirty) {
			Alert.alert("Unsaved Changes", `${tab.name} has unsaved changes.`, [
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Discard",
					style: "destructive",
					onPress: () => onClose(tab.path),
				},
				{
					text: "Save",
					onPress: async () => {
						await onSave(tab.path);
						onClose(tab.path);
					},
				},
			]);
			return;
		}
		onClose(tab.path);
	}

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={styles.container}
		>
			{tabs.map((tab) => {
				const isActive = tab.path === activeTabPath;
				return (
					<TouchableOpacity
						key={tab.path}
						style={[styles.tab, isActive && styles.activeTab]}
						onPress={() => onSwitch(tab.path)}
						accessibilityLabel={`Switch to ${tab.name}`}
					>
						<Text style={[styles.tabName, isActive && styles.activeTabName]}>
							{tab.name}
						</Text>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => handleClose(tab)}
							accessibilityLabel={
								tab.isDirty
									? `${tab.name} has unsaved changes`
									: `Close ${tab.name}`
							}
						>
							<Text style={tab.isDirty ? styles.dirtyDot : styles.closeText}>
								{tab.isDirty ? "●" : "✕"}
							</Text>
						</TouchableOpacity>
					</TouchableOpacity>
				);
			})}
		</ScrollView>
	);
}
