import Animated from 'react-native-reanimated';
export declare function measureFocusedInputBottomYAsync(): Promise<number>;
export declare function measureFocusedInputBottomY(callback: (bottomY: number) => void): void;
export declare function measureInputBottomYAsync(): Promise<number>;
export declare function calcAndroidSystemPan({ keyboardEndY, inputBottomY, }: {
    keyboardEndY: number;
    inputBottomY: number;
}): number;
export declare function closeAnimation(duration: number, easing: Animated.EasingFunction): {
    duration: number;
    easing: Animated.EasingFunction;
};
export declare function openAnimation(duration: number, easing: Animated.EasingFunction): {
    duration: number;
    easing: Animated.EasingFunction;
};
