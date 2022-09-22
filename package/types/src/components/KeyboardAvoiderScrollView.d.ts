/// <reference types="react" />
import { ScrollViewProps, View } from "react-native";
import { CommonProps } from "./common-props";
declare type Props = ScrollViewProps & CommonProps & {
    /**
     * What to do when the keyboard hides on iOS.
     * @option 'stay' - *Default* scroll view will not move when the keyboard hides (it will stay where it is.)
     * @option 'revert' - Scroll view will return to its original position when the keyboard hides.
     */
    iosHideBehavior?: 'stay' | 'revert';
};
export default function KeyboardAvoiderScrollView({ animationEasing, animationTime, extraSpace, iosHideBehavior, ...props }: Props): JSX.Element;
export declare function useScrollViewContext(): {
    registerView: ({ view, id, }: {
        view: View;
        id: string;
    }) => void;
    unregisterView: (id: string) => void;
};
export {};
