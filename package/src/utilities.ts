import { TextInput } from "react-native"
import Animated, { Easing } from "react-native-reanimated";

export async function measureFocusedInputBottomYAsync() {
    return new Promise<number>(resolve=>{
        const input = TextInput.State.currentlyFocusedInput();
        if(!input) return;
        input.measure((x, y, width, height, pageX, pageY)=>{
            resolve(pageY + height);
        })
    })
}

export function measureFocusedInputBottomY(callback: (bottomY: number)=>void) {
    const input = TextInput.State.currentlyFocusedInput();
    if(!input) return;
    input.measure((x, y, width, height, pageX, pageY)=>{
        callback(pageY + height);
    })
}

export function measureInputBottomYAsync() {
    return new Promise<number>(resolve=>{
        measureFocusedInputBottomY(resolve)
    })
}

export function calcAndroidSystemPan({
    keyboardEndY,
    inputBottomY,
} : {
    keyboardEndY: number,
    inputBottomY: number
}) {
    const delta = inputBottomY - keyboardEndY;
    return Math.max(0, delta);
}

export function closeAnimation(duration: number, easing: Animated.EasingFunction) {
    return {
        duration: duration + 50,
        easing: Easing.in(easing)
    }
}

export function openAnimation(duration: number, easing: Animated.EasingFunction) {
    return {
        duration,
        easing: Easing.out(easing)
    }
}