import { TextInput } from "react-native"
import { Easing } from "react-native-reanimated";

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

export function closeAnimation(duration: number) {
    return {
        duration: duration + 50,
        easing: Easing.in(Easing.ease)
    }
}

export function openAnimation(duration: number) {
    return {
        duration,
        easing: Easing.inOut(Easing.ease)
    }
}