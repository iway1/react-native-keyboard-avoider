/// <reference types="react" />
import { ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { CommonProps } from './common-props';
export declare type KeyboardAvoidMode = 'whole-view' | 'focused-input';
export default function KeyboardAvoiderView({ animationEasing, animationTime, extraSpace, enableAndroid, avoidMode, ...props }: Animated.AnimateProps<ViewProps> & CommonProps & {
    /**
     * Enable on android. Defaults to true to ensure consistent behavior.
     */
    enableAndroid?: boolean;
    /**
     * Sets the avoid mode. Defaults to 'whole-view'.
     * @option 'whole-view' - view moves to show the entire view when the keyboard is shown.
     * @option 'focused-input' - view moves to show only the focused text input.
     */
    avoidMode?: KeyboardAvoidMode;
}): JSX.Element;
