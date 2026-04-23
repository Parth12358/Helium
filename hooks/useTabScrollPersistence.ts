import { Tab } from "@/.expo/types/editor";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    TextInput,
} from "react-native";

export function useTabScrollPersistence(
    activeTab: Tab | null,
    onSaveScroll: (path: string, scrollPosition: number) => void,
) {
    const inputRef = useRef<TextInput>(null);
    const [scrollY, setScrollY] = useState(0);
    const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleScroll = useCallback(
        (e: { nativeEvent: { contentOffset: { y: number } } }) => {
            const y = e.nativeEvent.contentOffset.y;
            setScrollY(y);

            if (throttleRef.current) clearTimeout(throttleRef.current);
            throttleRef.current = setTimeout(() => {
                if (activeTab) onSaveScroll(activeTab.path, y);
            }, 100);
        },
        [activeTab, onSaveScroll],
    );

    useEffect(() => {
        // TextInput does not expose a scrollTo API — position is saved but not restored
    }, [activeTab?.path]);

    useEffect(() => {
        return () => {
            if (throttleRef.current) clearTimeout(throttleRef.current);
        };
    }, []);

    return { inputRef, handleScroll, scrollY };
}
