import { useTheme } from "@/constants/theme";
import { Tabs } from "expo-router";

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.accent,
                headerShown: false,
                tabBarStyle: { display: "none" },
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Home" }} />
        </Tabs>
    );
}
