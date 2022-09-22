import Animated from "react-native-reanimated";
export declare type CommonProps = {
    /**
     * Duration of the keyboard avoiding animation.
     */
    animationTime?: number;
    /**
     * Extra space between the keyboard avoiding element and the keyboard.
     */
    extraSpace?: number;
    /**
     * Easing function to use. Can be any `react-native-reanimated` easing function. Defaults to Easing.quad.
     * Open animation will use Easing.out(animationEasing), close animation will use Easing.in(animationEasing).
     */
    animationEasing?: Animated.EasingFunction;
};
export declare const defaultCommonProps: {
    animationTime: number;
    animationEasing: Animated.EasingFunction;
    extraSpace: number;
};
