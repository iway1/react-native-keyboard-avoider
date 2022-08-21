import { useEffect, useState } from "react";
import { Keyboard, KeyboardEventListener, Platform } from "react-native";

export function useKeyboardHandlers({
    showHandler,
    hideHandler,
    enabled=true,
} : {
    showHandler: KeyboardEventListener,
    hideHandler: KeyboardEventListener,
    enabled?: boolean,
}, deps?: any[]) {
    useEffect(() => {
        if(!enabled) return;
        const subscribe = Keyboard.addListener(
            Platform.OS == 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
            showHandler,
        )
        const subscribe2 = Keyboard.addListener(
            Platform.OS == 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
            hideHandler,
        )
        return () => {
            subscribe.remove()
            subscribe2.remove()
        }
    }, deps?[enabled].concat(deps):[enabled])
}