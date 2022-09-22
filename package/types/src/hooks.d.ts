import { KeyboardEventListener } from "react-native";
export declare function useKeyboardHandlers({ showHandler, hideHandler, enabled, }: {
    showHandler: KeyboardEventListener;
    hideHandler: KeyboardEventListener;
    enabled?: boolean;
}, deps?: any[]): void;
