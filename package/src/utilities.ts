import { TextInput } from "react-native"

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

