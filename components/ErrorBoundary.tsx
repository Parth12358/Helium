import { themes } from "@/constants/theme";
import { Component, ErrorInfo, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
    children: ReactNode;
}

interface State {
    error: Error | null;
}

// ErrorBoundary is a class component and cannot use hooks.
// We use the dark theme palette directly as a safe, always-visible fallback.
const t = themes.dark;

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error("[ErrorBoundary]", error, info.componentStack);
    }

    private handleReset = () => {
        this.setState({ error: null });
    };

    render(): ReactNode {
        if (this.state.error) {
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong</Text>
                    <Text style={styles.message}>
                        {this.state.error.message}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={this.handleReset}
                        accessibilityLabel="Try again"
                        accessibilityRole="button"
                    >
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        backgroundColor: t.bg,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: t.text,
        marginBottom: 12,
    },
    message: {
        fontSize: 13,
        color: t.textSecondary,
        textAlign: "center",
        marginBottom: 24,
        fontFamily: "monospace",
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: t.accent,
    },
    buttonText: {
        color: t.accentText,
        fontSize: 13,
        fontWeight: "500",
    },
});
