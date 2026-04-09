import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ProjectScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();

    return (
        <View style={{ flex: 1 }}>
            <Text>{name}</Text>
        </View>
    );
}
